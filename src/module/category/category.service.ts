import {prisma} from "../../lib/prisma";
import {CreateCategory} from "./category.interface";

const createCategory = async (payload: CreateCategory) => {
    return prisma.category.createMany({
        data: payload,
    });
};

const getSingleCategory=async (id: string)=> {
    const result = await prisma.category.findUniqueOrThrow({
        where: {
            id,
        },

    })
    return result;
}

const updateCategory = async (id: string, payload: CreateCategory) => {
    const category = await prisma.category.findUnique({
        where: {
            id,
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
        },
    });

    if (!category) {
        throw new Error('Category not found' );
    }

    const result = await prisma.category.delete({
        where: {
            id,
        },
    });

    return result;
}

export const categoryServices ={
    createCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory
}