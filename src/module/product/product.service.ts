import {prisma} from "../../lib/prisma";
import { CreateProduct, UpdateProduct } from './product.interface';
import {IProductQuery} from "./product.interface";
import {ProductStatus, Role} from '../../../generated/prisma/enums';

const createProduct = async (payload: CreateProduct) => {
    const { categoryId, farmerId } = payload;
    // Check category
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
            isDeleted: false,
        },
    });
    if (!category) {
        throw new Error( 'Category not found');
    }
    // Check farmer
    const farmer = await prisma.farmer.findUnique({
        where: {
            id: farmerId,
        },
    });
    if (!farmer) {
        throw new Error ('Farmer not found');
    }
    const result = await prisma.product.create({
        data: payload,
        include: {
            category:{
                select:{
                    id:true,
                    name:true
                }
            },
            farmer: {
                select:{
                    id:true,
                    name:true
                }
            }
        },
    });
    return result;
};

const getAllProducts = async (query:IProductQuery)=>{
    const {
        searchTerm,
        category,
        farmer,
        rating,
        status,
        minPrice,
        maxPrice,
        page = '1',
        limit = '9',
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const where: any = {
        isDeleted: false,
    };
    // Search
    if (searchTerm) {
        where.OR = [
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
            {
                category: {
                    name: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
            },
            {
                farmer :{
                    name:{
                        contains: searchTerm,
                        mode: "insensitive",
                    }
                }
            }

        ];
    }

    // Category filter
    if (category) {
        where.category = {
            name: {
                contains: category,
                mode: "insensitive",
            },
        }
    }

    // Farmer filter
    if (farmer) {
        where.farmer = {
            name: {
                contains: farmer,
                mode: "insensitive",
            },
        };
    }

    // Status filter
    if (status) {
        where.status = status;
    }

    // Rating filter
    if (rating) {
        const ratingNumber = Number(rating);
        if (!Number.isNaN(ratingNumber)) {
            where.reviews = {
                some: {
                    rating: {
                        gte: ratingNumber,
                    },
                },
            };
        }
    }
    // Price filter
    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) {
            where.price.gte = Number(minPrice);
        }
        if (maxPrice) {
            where.price.lte = Number(maxPrice);
        }
    }
    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limitNumber,
            orderBy: {
                [sortBy]: sortOrder,
            },
            include: {
                category: true,
                farmer: true,
                _count: {
                    select: {
                        reviews: true,
                        orderItems: true,
                    },
                },
            },
        }),

        prisma.product.count({
            where,
        }),
    ]);

    return {
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPage: Math.ceil(total / limitNumber),
        },
        data: products,
    };

}

const getSingleProduct = async (id: string) => {
    const result = await prisma.product.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            category: true,
            farmer: {
                select:{
                    id:true,
                    name:true,
                    certification:true,
                    isDeleted:true,
                    deletedAt:true,
                    farms:{
                        select:{
                            id:true,
                            farmName:true,
                            location:true,
                            landSize:true,
                            soilType:true,
                            farmerId:true,
                            isDeleted:true,
                            deletedAt:true
                        }
                    }
                }
            },
            reviews: {
                include: {
                    buyer: true,
                },
            },
            _count: {
                select: {
                    reviews: true,
                    orderItems: true,
                },
            },
        },
    });

    if (!result) {
        throw new Error( 'Product not found');
    }

    return result;
};

const updateProduct = async (id: string, payload: UpdateProduct) => {
    const product = await prisma.product.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });

    if (!product) {
        throw new Error( 'Product not found');
    }

    // Check category if category is changed
    if (payload.categoryId) {
        const category = await prisma.category.findUnique({
            where: {
                id: payload.categoryId,
                isDeleted: false,
            },
        });

        if (!category) {
            throw new Error( 'Category not found');
        }
    }

    const result = await prisma.product.update({
        where: {
            id,
        },
        data: {
            name: payload.name,
            description: payload.description,
            price: payload.price,
            quantity: payload.quantity,
            unit: payload.unit,
            image: payload.image,
            categoryId: payload.categoryId,
            status: payload.status,
        },

        include: {
            category:{
                select:{
                    id:true,
                    name:true
                }
            },
            farmer: {
                select:{
                    id:true,
                    name:true
                }
            }
        },
    });

    return result;
};

const deleteProduct = async (id: string, role: Role) => {
    const product = await prisma.product.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });

    if (!product) {
        throw new Error('Product not found');
    }

    if (role === Role.ADMIN) {
        const result = await prisma.category.update({
            where: {
                id,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: ProductStatus.INACTIVE,
            },
        });
        return result;
    }

    if (role === Role.SUPER_ADMIN) {
        const result = await prisma.category.delete({
            where: {
                id,
            },
        });
        return result;
    }

};

const getMyProducts = async (userId: string) => {
    if (!userId) {
        throw new Error('User ID is required');
    }
    const products = await prisma.product.findMany({
        where: {
            isDeleted: false,
            farmer: {
                userId: userId,
            },
        },
        include: {
            category:{
                select:{
                    id: true,
                    name: true,
                }
            },
            _count: {
                select: {
                    reviews: true,
                    orderItems: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return products;
};

const getProductsByCategory = async (
    categoryId: string
) => {
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
            isDeleted: false,
        },
    });

    if (!category) {
        throw new Error( 'Category not found');
    }

    const products = await prisma.product.findMany({
        where: {
            categoryId,
            status: 'ACTIVE',
            isDeleted: false,
        },
        include: {
            category:{
                select:{
                    id: true,
                    name: true
                }
            },
            farmer: {
                select:{
                    id: true,
                    name: true
                }
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return products;
};

const updateProductStatus = async (
    id: string,
    status: ProductStatus
) => {
    const product = await prisma.product.findUnique({
        where: {
            id,
            isDeleted: false,
        },
    });

    if (!product) {
        throw new Error( 'Product not found');
    }

    const result = await prisma.product.update({
        where: {
            id,
        },
        data: {
            status,
        },
    });

    return result;
};
export const productService = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    getMyProducts,
    getProductsByCategory,
    updateProductStatus
}