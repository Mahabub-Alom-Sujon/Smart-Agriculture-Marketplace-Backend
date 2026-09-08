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

const registerUser =async (payload: IRegisterPatientPayload,)=>{
    if (payload.role !== Role.FARMER && payload.role !== Role.BUYER) {
        throw new Error("Invalid Role. Only FARMER or BUYER can register.");
    }

    const email = payload.email.trim().toLowerCase();

    const isEmailExists = await prisma.user.findUnique({
        where: { email: email },
    });

    if (isEmailExists) {
        throw new Error("Email is already registered. Please login.");
    }

    if (!payload.password) {
        throw new Error("Password is required for manual registration");
    }
    const hashedPassword = await bcrypt.hash(payload.password, 8);

    const newUser = await prisma.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            phone: payload.phone,
            address: payload.address,
            role: payload.role,
            authProvider: AuthProvider.CREDENTIAL,
            emailVerified: false,

            ...(payload.role === Role.FARMER ? {
                farmer: {
                    create: {
                        name: payload.name,
                        email
                    },
                },
            } : {
                buyer: {
                    create: {
                        name: payload.name,
                        email,
                        address: payload.address,
                        city: payload.city,
                        country: payload.country,
                    },
                },
            }),
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
        },
    });

    if (!newUser) {
        throw new Error("Failed to create user");
    }

    const jwtPayload = {
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
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
        user: newUser,
        accessToken,
        refreshToken,
    };

}

const loginUser =async (payload:ILoginUserPayload)=>{

    const { password } = payload;
    const email = payload.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: {
            email ,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.status === UserStatus.BLOCKED) {
        throw new Error("User is blocked");
    }

    if (user.isDeleted || user.status === UserStatus.DELETED) {
        throw new Error("User is deleted");
    }

    if (user.password === null && user.googleId !== null) {
        throw new Error(
            "User Already Has Account Registered With Google. Try To Login With Google.",
        );
    }

    const isPasswordMatched = await bcrypt.compare(
        password,
        user.password as string,
    );

    if (!isPasswordMatched) {
        throw new Error("Invalid credentials");
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

const getMe = async (user: IRequestUser) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            id: user.userId,
        },
        include: {
            farmer: true,
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


const googleLogin = async (payload: IGoogleLoginPayload) => {
    // 1. Validate role
    if (payload.role !== Role.FARMER && payload.role !== Role.BUYER) {
        throw new Error("Invalid Role for Google Authentication");
    }

    // 2. Verify Google ID Token
    let googleIdTokenPayload: TokenPayload | null | undefined = null;

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: payload.idToken,
            audience: config.google_client_id,
        });

        googleIdTokenPayload = ticket.getPayload() as TokenPayload;
    } catch (error) {
        console.log("Google ID Token Verification Failed", error);
        throw new Error("Invalid Or Expired Google ID Token");
    }

    // 3. Validate Google payload
    if (!googleIdTokenPayload) {
        throw new Error("Invalid Or Expired Google ID Token");
    }

    if (!googleIdTokenPayload.email) {
        throw new Error("Google Email Not Found");
    }

    if (!googleIdTokenPayload.name) {
        throw new Error("Google User Name Not Found");
    }

    if (!googleIdTokenPayload.sub) {
        throw new Error("Google User ID Not Found");
    }

    // 4. Find existing Google user
    const existingGoogleUser = await prisma.user.findFirst({
        where: {
            email: googleIdTokenPayload.email,
            role: payload.role,
            googleId: googleIdTokenPayload.sub,
        },
    });

    let user = existingGoogleUser;

    // 5. If Google user does not exist
    if (!existingGoogleUser) {
        // Check if user already exists with credentials
        const existingCredentialUser = await prisma.user.findFirst({
            where: {
                email: googleIdTokenPayload.email,
                role: payload.role,
                authProvider: AuthProvider.CREDENTIAL,
            },
        });

        // 6. Existing credential user
        if (existingCredentialUser) {
            if (!existingCredentialUser.emailVerified) {
                throw new Error("Email Not Verified");
            }

            if (existingCredentialUser.status === UserStatus.BLOCKED) {
                throw new Error("User Is Blocked");
            }

            if (
                existingCredentialUser.isDeleted ||
                existingCredentialUser.status === UserStatus.DELETED
            ) {
                throw new Error("User Is Deleted");
            }

            // Link Google account with existing account
            user = await prisma.user.update({
                where: {
                    id: existingCredentialUser.id,
                },
                data: {
                    googleId: googleIdTokenPayload.sub,
                },
            });
        } else {
            // 7. Register new Google user
            user = await prisma.user.create({
                data: {
                    name: googleIdTokenPayload.name,
                    email: googleIdTokenPayload.email,
                    role: payload.role,
                    googleId: googleIdTokenPayload.sub,
                    authProvider: AuthProvider.GOOGLE,
                    emailVerified: true,

                    ...(payload.role === Role.FARMER
                        ? {
                            farmer: {
                                create: {
                                    name: googleIdTokenPayload.name,
                                    email: googleIdTokenPayload.email,
                                },
                            },
                        }
                        : {
                            buyer: {
                                create: {
                                    name: googleIdTokenPayload.name,
                                    email: googleIdTokenPayload.email,
                                },
                            },
                        }),
                },
            });
        }
    }

    // 8. Make sure user exists
    if (!user) {
        throw new Error("User Not Found");
    }

    // 9. Check blocked user
    if (user.status === UserStatus.BLOCKED) {
        throw new Error("User Is Blocked");
    }

    // 10. Check deleted user
    if (
        user.isDeleted ||
        user.status === UserStatus.DELETED
    ) {
        throw new Error("User Is Deleted");
    }

    // 11. Create JWT payload
    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    // 12. Create access token
    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions,
    );

    // 13. Create refresh token
    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions,
    );

    // 14. Return tokens
    return {
        accessToken,
        refreshToken,
    };
};


export const AuthService = {
    registerUser,
    loginUser,
    getMe,
    refreshToken,
    googleLogin
}

