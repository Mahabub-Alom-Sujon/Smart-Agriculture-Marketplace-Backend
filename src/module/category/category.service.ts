import {prisma} from "../../lib/prisma";
import {CreateCategory, IQuery } from "./category.interface";
import { Role } from "../../../generated/prisma/enums";

const createCategory = async (payload: CreateCategory) => {
    return prisma.category.create({
        data: payload,
    });
};

const getAllAdminCategories = async ()=>{
    const result = await prisma.category.findMany({
        where: {
            isDeleted: false,
        },
        select:{
            id:true,
            name:true,
            description:true,
            isDeleted:true,
            deletedAt:true,
            createdAt:true,
            updatedAt:true,

        }
    })
    return result;
}

const getAllCategories = async (query:IQuery) => {
    const {
        searchTerm,
        page = '1',
        limit = '10',
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const where: any = {
        isDeleted: false,
    };

    if (searchTerm){
        where.OR=[
            {
                name: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            },
            {
                description: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            },
        ]
    }

    // =========================
    // Get Categories + Total
    // =========================
    const [categories, total] = await Promise.all([
        prisma.category.findMany({
            where,
            skip,
            take: limitNumber,
            orderBy: {
                [sortBy]: sortOrder === "asc" ? "asc" : "desc",
            },
            include: {
                _count: {
                    select: {
                        products: true,
                    },
                },
            },
        }),
        prisma.category.count({
            where,
        }),
    ]);

    // =========================
    // Return
    // =========================
    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPage: Math.ceil(total / limitNumber),
        },

        data: categories,
    };
};

const getSingleCategory=async (id: string)=> {
    const result = await prisma.category.findFirst({
        where: {
            id,
            isDeleted: false,
        },

    })
    return result;
}

const updateCategory = async (id: string, payload: CreateCategory) => {
    const category = await prisma.category.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });

    if (!category) {
        throw new Error('Category not found' );
    }

    const result = await prisma.category.update({
        where: {
            id,
        },
        data: {
            name: payload.name,
            description: payload.description,
            image: payload.image,
        },
    });

    return result;
}

const deleteCategory = async ( id: string, role: Role ) => {
    // Check category exists
    const category = await prisma.category.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });

    if (!category) {
        throw new Error("Category not found");
    }

    // =========================
    // ADMIN → Soft Delete
    // =========================

    if (role === Role.ADMIN) {
        const result = await prisma.category.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
            },
        });

        return result;
    }

    // =========================
    // SUPER_ADMIN → Permanent Delete
    // =========================

    if (role === Role.SUPER_ADMIN) {
        const result = await prisma.category.delete({
            where: {
                id,
            },
        });

        return result;
    }

    // =========================
    // Other Roles → Not Allowed
    // =========================
    throw new Error("You are not authorized to delete this category");
}

export const categoryServices ={
    createCategory,
    getAllCategories,
    getAllAdminCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
}