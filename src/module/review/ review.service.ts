import {prisma} from "../../lib/prisma";
// import { Prisma } from "../../../generated/prisma";
import { ICreateReview, IUpdateReview } from "./review.interface";

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
// const getAllReviews = async (query: Record<string, unknown>) => {
//     const {
//         searchTerm,
//         productId,
//         buyerId,
//         orderId,
//         rating,
//         page = "1",
//         limit = "10",
//         sortBy = "createdAt",
//         sortOrder = "desc",
//     } = query;
//
//     const pageNumber = Number(page);
//     const limitNumber = Number(limit);
//     const skip = (pageNumber - 1) * limitNumber;
//
//     const andConditions: Prisma.ReviewWhereInput[] = [
//         {
//             isDeleted: false,
//         },
//     ];
//
//     if (searchTerm) {
//         andConditions.push({
//             comment: {
//                 contains: String(searchTerm),
//                 mode: "insensitive",
//             },
//         });
//     }
//
//     if (productId) {
//         andConditions.push({
//             productId: String(productId),
//         });
//     }
//
//     if (buyerId) {
//         andConditions.push({
//             buyerId: String(buyerId),
//         });
//     }
//
//     if (orderId) {
//         andConditions.push({
//             orderId: String(orderId),
//         });
//     }
//
//     if (rating) {
//         andConditions.push({
//             rating: Number(rating),
//         });
//     }
//
//     const where: Prisma.ReviewWhereInput = {
//         AND: andConditions,
//     };
//
//     const [data, total] = await Promise.all([
//         prisma.review.findMany({
//             where,
//             skip,
//             take: limitNumber,
//             orderBy: {
//                 [String(sortBy)]: sortOrder === "asc" ? "asc" : "desc",
//             },
//             include: {
//                 buyer: true,
//                 product: true,
//             },
//         }),
//
//         prisma.review.count({
//             where,
//         }),
//     ]);
//
//     return {
//         meta: {
//             page: pageNumber,
//             limit: limitNumber,
//             total,
//             totalPage: Math.ceil(total / limitNumber),
//         },
//         data,
//     };
// };

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

export const ReviewService = {
    createReview,
    // getAllReviews,
    getSingleReview,
    getMyReviews,
    getProductReviews,
    updateReview,
    deleteReview,
    adminDeleteReview,
};
