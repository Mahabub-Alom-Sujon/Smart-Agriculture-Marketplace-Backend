import {prisma} from "../../lib/prisma";
import { CreateProduct, UpdateProduct } from './product.interface';
import {IProductQuery} from "./product.interface";
import { ProductStatus } from '../../../generated/prisma/enums';

const createProduct = async (payload: CreateProduct) => {
    const { categoryId, farmerId } = payload;

    // Check category
    const category = await prisma.category.findUnique({
        where: {
            id: categoryId,
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
        categoryId,
        farmerId,
        status,
        minPrice,
        maxPrice,
        page = '1',
        limit = '10',
        sortBy = 'createdAt',
        sortOrder = 'desc',
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const where: any = {};

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
        ];
    }

    // Category filter
    if (categoryId) {
        where.categoryId = categoryId;
    }

    // Farmer filter
    if (farmerId) {
        where.farmerId = farmerId;
    }

    // Status filter
    if (status) {
        where.status = status;
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
        },
        include: {
            category: true,
            farmer: true,
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

const deleteProduct = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: {
            id,
        },
    });

    if (!product) {
        throw new Error( 'Product not found');
    }

    const result = await prisma.product.delete({
        where: {
            id,
        },
    });

    return result;
};

const getMyProducts = async (userId: string) => {
    if (!userId) {
        throw new Error('User ID is required');
    }
    const products = await prisma.product.findMany({
        where: {
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
        },
    });

    if (!category) {
        throw new Error( 'Category not found');
    }

    const products = await prisma.product.findMany({
        where: {
            categoryId,
            status: 'ACTIVE',
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