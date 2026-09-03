import bcrypt from 'bcryptjs'
import { JwtPayload, SignOptions } from 'jsonwebtoken'
import {AuthProvider, Role, UserStatus} from '../../../generated/prisma/enums'
import config from '../../config'
import { prisma } from '../../lib/prisma'
import { jwtUtils } from '../../utils/jwt'
import {
    IGoogleLoginPayload,
    ILoginUserPayload,
    IRegisterPatientPayload,
    IRequestUser
} from './auth.interface'
import {TokenPayload} from "google-auth-library";
import {googleClient} from "../../lib/googleAuth";



const getMe = async (user: IRequestUser) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            id: user.userId,
        },
        include: {
            farms: true,
            buyer:true,
        },
        omit: {
            password: true,
        },
    })

    if (!isUserExists) {
        throw new Error('User not found')
    }

    return isUserExists
}

const refreshToken = async (token: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(token, config.jwt_refresh_secret)

    if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
        throw new Error(config.node_env === 'development' ? verifiedRefreshToken.error : 'Invalid refresh token')
    }

    const data = verifiedRefreshToken.data as JwtPayload

    const user = await prisma.user.findUnique({
        where: { id: data.userId },
    })

    if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
        throw new Error("User is inactive or not found");
    }
    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );

    return {
        accessToken,
        refreshToken
    }
}

const googleLogin = async (payload: IGoogleLoginPayload) =>{

    if (payload.role !== Role.FARMER && payload.role !== Role.BUYER) {
        throw new Error("Invalid Role for Google Authentication");
    }

    let googleIdTokenPayload: TokenPayload | null | undefined = null;

    try{
        const ticket=await googleClient.verifyIdToken({
            idToken: payload.idToken,
            audience: config.google_client_id,
        })
        googleIdTokenPayload = ticket.getPayload();
    }catch (error){
        console.log("Google ID Token Verification Failed", error);
        throw new Error("Invalid Or Expired Google Id Token");
    }

    if (!googleIdTokenPayload) {
        throw new Error("Invalid Or Expired Google Id Token");
    }

    if (!googleIdTokenPayload.email) {
        throw new Error("Google Email Not Found");
    }

    if (!googleIdTokenPayload.name) {
        throw new Error("Google Email User Name Not Found");
    }

    const ifPatientExistWithGoogleAuth = await prisma.user.findUnique({
        where: {
            email: googleIdTokenPayload.email,
            role: payload.role,
            googleId: googleIdTokenPayload.sub,
        },
    })

    let user = ifPatientExistWithGoogleAuth;

    if(!ifPatientExistWithGoogleAuth){
        const ifPatientExistWithCredentials = await prisma.user.findUnique({
            where: {
                email: googleIdTokenPayload.email,
                role: payload.role,
                authProvider:AuthProvider.CREDENTIAL
            },
        });

        if(ifPatientExistWithCredentials){
            if (!ifPatientExistWithCredentials.emailVerified) {
                throw new Error("Email Not Verified");
            }

            if (ifPatientExistWithCredentials.status === UserStatus.BLOCKED) {
                throw new Error("User Is Blocked");
            }

            if (
                ifPatientExistWithCredentials.isDeleted ||
                ifPatientExistWithCredentials.status === UserStatus.DELETED
            ) {
                throw new Error("User Is Deleted");
            }

            user = await prisma.user.update({
                where: {
                    id: ifPatientExistWithCredentials.id,
                },

                data: {
                    googleId: googleIdTokenPayload.sub,
                },
            });
        }else {
            // Google Register
            user = await prisma.user.create({
                data: {
                    name: googleIdTokenPayload.name,
                    email: googleIdTokenPayload.email,
                    role: payload.role,
                    googleId: googleIdTokenPayload.sub,
                    authProvider: AuthProvider.GOOGLE,
                    emailVerified: true,
                    ...(payload.role === Role.FARMER ? {
                        farmer: {
                            create: { name: googleIdTokenPayload.name, email: googleIdTokenPayload.email }
                        }
                    } : {
                        buyer: {
                            create: { name: googleIdTokenPayload.name, email: googleIdTokenPayload.email }
                        }
                    })
                },
            });
        }


    }

    if (!user) {
        throw new Error("User Not Found");
    }

    if (user.status === UserStatus.BLOCKED) {
        throw new Error("User Is Blocked");
    }

    if (user.isDeleted || user.status === UserStatus.DELETED) {
        throw new Error("User Is Deleted");
    }

    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions,
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions,
    );

    return {
        accessToken,
        refreshToken,
    };

}


export const AuthService = {
    getMe,
    refreshToken,
    googleLogin
}

