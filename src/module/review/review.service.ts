import {prisma} from "../../lib/prisma";
import { ICreateReview, IUpdateReview } from "./review.interface";
import {ReviewWhereInput} from "../../../generated/prisma/models/Review";
import {Role} from "../../../generated/prisma/enums";

// ==============================
// Create Review
// ==============================

const createReview = async (userId: string, data: ICreateReview) => {
    const { productId, orderId, rating, comment } = data;

    const buyer = await prisma.buyer.findUnique({
        where: {
            userId: userId,
        },
    });

    if (!buyer) {
        throw new Error("Buyer not found");
    }

    // Check order
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
            buyerId:buyer.id,
            isDeleted: false,
        },
        include: {
            orderItems: true
        },
    });

    if (!order) {
        throw new Error("Order not found or does not belong to this buyer");
    }

    // Only completed order can be reviewed
    if (order.status !== "COMPLETED") {
        throw new Error("You can review only completed orders");
    }

    // Check product exists in this order
    const orderItem = order.orderItems.find(
        (item) => item.productId === productId
    );

    if (!orderItem) {
        throw new Error("This product does not belong to the specified order");
    }

    // Prevent duplicate review
    const existingReview = await prisma.review.findFirst({
        where: {
            buyerId:buyer.id,
            productId,
            orderId,
            isDeleted: false,
        },
    });

    if (existingReview) {
        throw new Error("You have already reviewed this product");
    }

    // Create the review
    const result = await prisma.review.create({
        data: {
            rating,
            comment,
            buyerId:buyer.id,
            productId,
            orderId,
        },
        include: {
            product: true,
            buyer: true,
            order: true,
        },
    });

    return result;
};

// ==============================
// Get All Reviews
// ==============================
// @ts-ignore
const getAllReviews = async (query: IQuery) => {

    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc";

    const andConditions: ReviewWhereInput[] = [];

    // Searching (শুধু কমেন্টের ওপর সার্চ হবে)
    if (query.searchTerm) {
        andConditions.push({
            comment: {
                contains: query.searchTerm,
                mode: "insensitive",
            },
        });
    }

    // Filtering
    if (query.productId) {
        andConditions.push({
            productId: { equals: String(query.productId) },
        });
    }

    if (query.buyerId) {
        andConditions.push({
            buyerId: { equals: String(query.buyerId) },
        });
    }

    if (query.orderId) {
        andConditions.push({
            orderId: { equals: String(query.orderId) },
        });
    }

    if (query.rating) {
        andConditions.push({
            rating: { equals: Number(query.rating) },
        });
    }

    // সফট-ডিলিট ফিল্টার
    andConditions.push({ isDeleted: false });

    const allReviews = await prisma.review.findMany({
        where: {
            AND: andConditions.length > 0 ? andConditions : undefined
        },

        take: limit,
        skip: skip,

        orderBy: {
            [sortBy]: sortOrder
        },

        include: {
            product: true,
            buyer: {
                include: {
                    user: {
                        omit: {
                            password: true // 👈 আপনার প্যাটার্ন অনুযায়ী পাসওয়ার্ড রিমুভ করা হয়েছে
                        }
                    }
                }
            },
            order: true
        }
    });

    const totalReviewCount = await prisma.review.count({
        where: {
            AND: andConditions
        }
    });

    return {
        data: allReviews,
        meta: {
            page: page,
            limit: limit,
            total: totalReviewCount,
            totalPages: Math.ceil(totalReviewCount / limit)
        }
    };
};

// ==============================
// Get Single Review
// ==============================
const getSingleReview = async (id: string) => {
    const result = await prisma.review.findFirst({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            buyer: true,
            product: true,
            order: true,
        },
    });

    if (!result) {
        throw new Error("Review not found");
    }

    return result;
};

// ==============================
// Get My Reviews
// ==============================
const getMyReviews = async (userId: string) => {

    const buyer = await prisma.buyer.findUnique({
        where: {
            userId: userId,
        },
    });

    if (!buyer) {
        throw new Error("Buyer not found");
    }
    const result = await prisma.review.findMany({
        where: {
            buyerId: buyer.id,
            isDeleted: false,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            product: true,
            order: true,
        },
    });

    return result;
};

// ==============================
// Get Product Reviews
// ==============================
const getProductReviews = async (productId: string) => {
    const result = await prisma.review.findMany({
        where: {
            productId,
            isDeleted: false,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            buyer: true,
        },
    });

    return result;
};

// ==============================
// Update Review
// ==============================
const updateReview = async (
    id: string,
    userId: string,
    data: IUpdateReview
) => {
    const buyer = await prisma.buyer.findUnique({
        where: {
            userId: userId,
        },
    });

    if (!buyer) {
        throw new Error("Buyer not found");
    }
    const review = await prisma.review.findFirst({
        where: {
            id,
            buyerId:buyer.id,
            isDeleted: false,
        },
    });

    if (!review) {
        throw new Error("Review not found or you are not authorized");
    }

    const result = await prisma.review.update({
        where: {
            id,
        },
        data: {
            ...(data.rating !== undefined && {
                rating: data.rating,
            }),
            ...(data.comment !== undefined && {
                comment: data.comment,
            }),
        },
        include: {
            product: true,
            buyer: true,
        },
    });

    return result;
};

// ==============================
// Delete Review - Soft Delete
// ==============================
const deleteReview = async (id: string, userId: string) => {
    const buyer = await prisma.buyer.findUnique({
        where: {
            userId: userId,
        },
    });

    if (!buyer) {
        throw new Error("Buyer not found");
    }
    const review = await prisma.review.findFirst({
        where: {
            id,
            buyerId:buyer.id,
            isDeleted: false,
        },
    });

    if (!review) {
        throw new Error("Review not found or you are not authorized");
    }

    const result = await prisma.review.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });

    return result;
};

// ==============================
// Delete Review (Role-based)
// ==============================
// const deleteReview = async (id: string, userId: string, role: Role) => {
//
//     // ১. যদি SUPER_ADMIN হয় -> সরাসরি Permanent/Hard Delete হবে
//     if (role === Role.SUPER_ADMIN) {
//         const review = await prisma.review.findFirst({
//             where: { id }
//         });
//
//         if (!review) {
//             throw new Error("Review not found");
//         }
//
//         const result = await prisma.review.delete({
//             where: { id },
//         });
//
//         return result;
//     }
//
//     // ২. যদি ADMIN হয় -> যেকোনো রিভিউ Soft Delete করতে পারবে
//     if (role === Role.ADMIN) {
//         const review = await prisma.review.findFirst({
//             where: { id, isDeleted: false }
//         });
//
//         if (!review) {
//             throw new Error("Review not found or already deleted");
//         }
//
//         const result = await prisma.review.update({
//             where: { id },
//             data: {
//                 isDeleted: true,
//                 deletedAt: new Date(),
//             },
//         });
//
//         return result;
//     }
//
//     // ৩. যদি BUYER হয় -> শুধুমাত্র নিজের রিভিউ Soft Delete করতে পারবে
//     if (role === Role.BUYER) {
//         const buyer = await prisma.buyer.findUnique({
//             where: { userId },
//         });
//
//         if (!buyer) {
//             throw new Error("Buyer not found");
//         }
//
//         const review = await prisma.review.findFirst({
//             where: {
//                 id,
//                 buyerId: buyer.id,
//                 isDeleted: false,
//             },
//         });
//
//         if (!review) {
//             throw new Error("Review not found or you are not authorized to delete it");
//         }
//
//         const result = await prisma.review.update({
//             where: { id },
//             data: {
//                 isDeleted: true,
//                 deletedAt: new Date(),
//             },
//         });
//
//         return result;
//     }
//
//     // ৪. অন্য কোনো রোল (যেমন: FARMER, EXPERT) হলে এরর থ্রো করবে
//     throw new Error("You do not have permission to delete this review");
// };

// ==============================
// Admin Delete Review
// ==============================
const adminDeleteReview = async (id: string) => {
    const review = await prisma.review.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });

    if (!review) {
        throw new Error("Review not found");
    }

    const result = await prisma.review.update({
        where: {
            id,
        },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        },
    });

    return result;
};

// ==============================
// Super Admin Permanent Delete Review
// ==============================
const superAdminDeleteReview = async (id: string) => {
    const review = await prisma.review.findUnique({
        where: {
            id,
        },
    });

    if (!review) {
        throw new Error("Review not found");
    }

    const result = await prisma.review.delete({
        where: {
            id,
        },
    });

    return result;
};

export const ReviewService = {
    createReview,
    getAllReviews,
    getSingleReview,
    getMyReviews,
    getProductReviews,
    updateReview,
    deleteReview,
    adminDeleteReview,
    superAdminDeleteReview
};
