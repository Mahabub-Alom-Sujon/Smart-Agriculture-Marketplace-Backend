import {prisma} from "../../lib/prisma";
import {CreateCategory} from "./category.interface";

const createCategory = async (payload: CreateCategory) => {
    return prisma.category.create({
        data: payload,
    });
};

const getAllCategories = async () => {
    const result = await prisma.category.findMany({
        where: {
            isDeleted: false,
        },
        include: {
            _count: {
                select: {
                    products: true,
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
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

const deleteCategory = async (id: string ) => {
    const category = await prisma.category.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });

    if (!category) {
        throw new Error('Category not found' );
    }

    // const result = await prisma.category.delete({
    //     where: {
    //         id,
    //     },
    // });

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

export const categoryServices ={
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
}