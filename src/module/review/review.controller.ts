import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catch-async'
import { sendResponse } from '../../utils/send-response'
import { ReviewService } from "./ review.service";
import {IRequestUser} from "../auth/auth.interface";

// ==============================
// Create Review
// ==============================

const createReview = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user as IRequestUser;
        const result = await ReviewService.createReview(
            user.userId, // এখানে userId পাঠানো হচ্ছে
            req.body
        );
        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'Review created successfully', // মেসেজ ঠিক করা হয়েছে
            data: result,
        });
    }
);

// ==============================
// Get All Reviews
// ==============================

const getAllReviews = catchAsync(
    async (req: Request, res: Response) => {
        const result = await ReviewService.getAllReviews(req.query);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Reviews retrieved successfully",
            meta: result.meta,
            data: result.data,
        });
    }
);

// ==============================
// Get Single Review
// ==============================

const getSingleReview = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await ReviewService.getSingleReview(id as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK, // অথবা সরাসরি 200 দিতে পারেন
            message: "Review retrieved successfully",
            data: result,
        });
    }
);

// ==============================
// Get My Reviews
// ==============================
const getMyReviews = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user as IRequestUser; // রিকোয়েস্ট থেকে লগইন করা ইউজারের ডাটা নেওয়া

        // এখানে user.userId-কে buyerId হিসেবে পাস করা হচ্ছে
        const result = await ReviewService.getMyReviews(user.userId);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: 'My reviews retrieved successfully',
            data: result,
        });
    }
);

// ==============================
// Get Product Reviews
// ==============================
const getProductReviews = catchAsync(
    async (req: Request, res: Response) => {
        const { productId } = req.params;

        const result = await ReviewService.getProductReviews(productId as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Product reviews retrieved successfully",
            data: result,
        });
    }
);

// ==============================
// Update Review
// ==============================
const updateReview = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params; // রিভিউ আইডি
        const user = req.user as IRequestUser; // টাইপকাস্ট করে ইউজার অবজেক্ট নেওয়া

        // এখানে user.userId পাঠানো হচ্ছে (পূর্বের কোডের সাথে মিল রেখে)
        const result = await ReviewService.updateReview(
            id as string,
            user.userId,
            req.body
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Review updated successfully",
            data: result,
        });
    }
);

// ==============================
// Delete Review (By Buyer)
// ==============================
const deleteReview = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params; // রিভিউ আইডি
        const user = req.user as IRequestUser; // টাইপকাস্ট করে ইউজার অবজেক্ট নেওয়া

        // এখানে user.userId-কে buyerId হিসেবে পাস করা হচ্ছে
        const result = await ReviewService.deleteReview(
            id as string,
            user.userId
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Review deleted successfully",
            data: result,
        });
    }
);

// ==============================
// Admin Delete Review
// ==============================
const adminDeleteReview = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params; // রাউট প্যারামিটার থেকে রিভিউ আইডি নেওয়া

        const result = await ReviewService.adminDeleteReview(id as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Review deleted successfully by admin",
            data: result,
        });
    }
);

// ==============================
// Admin Delete Review
// ==============================
const superAdminDeleteReview = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params; // রাউট প্যারামিটার থেকে রিভিউ আইডি নেওয়া

        const result = await ReviewService.superAdminDeleteReview(id as string);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Review deleted successfully by admin",
            data: result,
        });
    }
);

export const ReviewController = {
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