import bcrypt from 'bcryptjs'
import { JwtPayload, SignOptions } from 'jsonwebtoken'
import {AuthProvider, Role, UserStatus} from '../../../generated/prisma/enums'
import config from '../../config'
import { prisma } from '../../lib/prisma'
import { jwtUtils } from '../../utils/jwt'
import {IExpertQuery, IRegisterExpertPayload} from "./expert.interface";
import {ExpertWhereInput} from "../../../generated/prisma/models/Expert";

const registerExpert = async (
    payload: IRegisterExpertPayload
) => {
    const email = payload.email.trim().toLowerCase();

    // ==============================
    // Check Email
    // ==============================
    const isEmailExists = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (isEmailExists) {
        throw new Error(
            "Email is already registered. Please login."
        );
    }

    // ==============================
    // Password Validation
    // ==============================
    if (!payload.password) {
        throw new Error(
            "Password is required for expert registration"
        );
    }

    // ==============================
    // Hash Password
    // ==============================
    const hashedPassword = await bcrypt.hash(
        payload.password,
        8
    );

    // ==============================
    // Create User + Expert
    // ==============================
    const newUser = await prisma.user.create({
        data: {
            name: payload.name,
            email,
            password: hashedPassword,
            phone: payload.phone,
            address: payload.address,
            // Expert role is fixed
            role: Role.EXPERT,
            authProvider: AuthProvider.CREDENTIAL,
            emailVerified: false,
            expert: {
                create: {
                    name: payload.name,
                    email,
                    city: payload.city,
                    specialization: payload.specialization,
                    qualification: payload.qualification,
                    experience: payload.experience,
                },
            },
        },

        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            role: true,
            status: true,
            createdAt: true,

            expert: {
                select: {
                    id: true,
                    name:true,
                    email:true,
                    city: true,
                    specialization: true,
                    qualification: true,
                    experience: true,
                },
            },
        },
    });

    if (!newUser) {
        throw new Error("Failed to create expert");
    }

    // ==============================
    // JWT Payload
    // ==============================
    const jwtPayload = {
        userId: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
    };

    // ==============================
    // Access Token
    // ==============================
    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    );

    // ==============================
    // Refresh Token
    // ==============================
    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    );

    return {
        user: newUser,
        accessToken,
        refreshToken,
    };
};

// ==============================
// Get My Expert Profile
// ==============================
// const getMyExpertProfile = async (userId: string) => {
//     const result = await prisma.expert.findFirst({
//         where: {
//             userId,
//             isDeleted: false,
//         },
//         include: {
//             user: {
//                 select: {
//                     id: true,
//                     name: true,
//                     email: true,
//                     phone: true,
//                     address: true,
//                     imageUrl: true,
//                     role: true,
//                     status: true,
//                 },
//             },
//         },
//     });
//
//     if (!result) {
//         throw new Error("Expert profile not found");
//     }
//     return result;
// };

// ==============================
// Get All Experts
// ==============================
const getAllExperts = async (query: IExpertQuery) => {
    const {
        searchTerm,
        specialization,
        page = "1",
        limit = "10",
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const andConditions: ExpertWhereInput[] = [
        {
            isDeleted: false,
        },
    ];

    if (searchTerm) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    email: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    specialization: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                {
                    qualification: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            ],
        });
    }

    if (specialization) {
        andConditions.push({
            specialization: {
                contains: specialization,
                mode: "insensitive",
            },
        });
    }

    const whereConditions: ExpertWhereInput = {
        AND: andConditions,
    };

    const [result, total] = await Promise.all([
        prisma.expert.findMany({
            where: whereConditions,
            skip,
            take: limitNumber,
            orderBy: {
                [sortBy]: sortOrder === "asc" ? "asc" : "desc",
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        imageUrl: true,
                        role: true,
                        status: true,
                    },
                },
            },
        }),

        prisma.expert.count({
            where: whereConditions,
        }),
    ]);

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPage: Math.ceil(total / limitNumber),
        },
        data: result,
    };
};

// ==============================
// Get Single Expert
// ==============================
const getSingleExpert = async (id: string) => {
    const result = await prisma.expert.findFirst({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    imageUrl: true,
                    role: true,
                    status: true,
                },
            },
        },
    });

    if (!result) {
        throw new Error("Expert not found");
    }

    return result;
};



// ==============================
// Delete Expert (Service)
// ==============================
const deleteExpert = async (id: string, userId: string, role: Role) => {

    // ডিলিট করার আগে এক্সপার্ট প্রোফাইলটি চেক করে নেওয়া
    const expert = await prisma.expert.findUnique({
        where: { id },
    });

    if (!expert) {
        throw new Error( "Expert profile not found");
    }

    // ১. যদি SUPER_ADMIN হয় -> ডাটাবেজ থেকে Permanent/Hard Delete হবে (Expert & User দুটোই)
    if (role === Role.SUPER_ADMIN) {
        return await prisma.$transaction(async (tx) => {
            // প্রথমে Expert প্রোফাইল ডিলিট
            const deletedExpert = await tx.expert.delete({
                where: { id },
            });
            // তারপর মেইন User অ্যাকাউন্ট ডিলিট
            await tx.user.delete({
                where: { id: expert.userId },
            });
            return deletedExpert;
        });
    }

    // ২. যদি ADMIN হয় অথবা এক্সপার্ট নিজে নিজের প্রোফাইল ডিলিট করতে চায় -> Soft Delete
    const isOwnProfile = expert.userId === userId;

    if (role === Role.ADMIN || isOwnProfile) {
        if (expert.isDeleted) {
            throw new Error( "Expert profile is already deleted");
        }

        return await prisma.$transaction(async (tx) => {
            // Expert প্রোফাইল Soft Delete
            const updatedExpert = await tx.expert.update({
                where: { id },
                data: {
                    isDeleted: true,
                    deletedAt: new Date(),
                },
            });
            // মেইন User অ্যাকাউন্টও Soft Delete
            await tx.user.update({
                where: { id: expert.userId },
                data: {
                    isDeleted: true,
                    deletedAt: new Date(),
                    status: "DELETED", // UserStatus enum অনুযায়ী
                },
            });
            return updatedExpert;
        });
    }

    // ৩. পারমিশন না থাকলে এরর থ্রো করবে
    throw new Error("You do not have permission to delete this expert");
};

export const ExpertService = {
    registerExpert,
    getAllExperts,
    getSingleExpert,
    deleteExpert
};