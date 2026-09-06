import { prisma } from "../../lib/prisma";
import { UpdateUserStatusPayload, UpdateUserRolePayload } from "./admin.interface"

const getDashboardStats = async () => {
    const [
        totalUsers,
        totalFarmers,
        totalBuyers,
        totalExperts,
        totalProducts,
        totalCategories,
        totalOrders,
    ] = await Promise.all([
        prisma.user.count(),

        prisma.user.count({
            where: {
                role: "FARMER",
            },
        }),

        prisma.user.count({
            where: {
                role: "BUYER",
            },
        }),

        prisma.user.count({
            where: {
                role: "EXPERT",
            },
        }),

        prisma.product.count(),

        prisma.category.count(),

        prisma.order.count(),
    ]);

    return {
        totalUsers,
        totalFarmers,
        totalBuyers,
        totalExperts,
        totalProducts,
        totalCategories,
        totalOrders,
    };
};

const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone : true,
            address : true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            farmer:{
                select:{
                    id: true,
                    name: true,
                    email: true,
                }
            },
            buyer:{
                select:{
                    id: true,
                    name: true,
                    email: true,
                    city: true,
                    address: true,
                    country : true,
                }
            }
        },
    });

    return users;
};

const getSingleUser = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone : true,
            address : true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            farmer:{
                select:{
                    id: true,
                    name: true,
                    email: true,
                }
            },
            buyer:{
                select:{
                    id: true,
                    name: true,
                    email: true,
                    city: true,
                    address: true,
                    country : true,
                }
            }
        },
    });

    if (!user) {
        throw new Error( "User not found");
    }

    return user;
};

const updateUserStatus = async (
    id: string,
    payload: UpdateUserStatusPayload
) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!user) {
        throw new Error( "User not found");
    }

    const result = await prisma.user.update({
        where: {
            id,
        },
        data: {
            status: payload.status,
            //isBanned: payload.status === "BLOCKED",
        },
        omit:{
            password: true
        }
    });

    return result;
};

const updateUserRole = async (
    id: string,
    payload: UpdateUserRolePayload
) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const result = await prisma.user.update({
        where: {
            id,
        },
        data: {
            role:payload.role,
        },
        omit:{
            password:true
        }
    });

    return result;
};

const deleteUser = async (id: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const result = await prisma.user.delete({
        where: {
            id,
        },
        omit:{
            password:true
        }
    });

    return result;
};

// Audit Logs Service

export const adminService ={
    getDashboardStats,
    getAllUsers,
    getSingleUser,
    updateUserStatus,
    updateUserRole,
    deleteUser,


}