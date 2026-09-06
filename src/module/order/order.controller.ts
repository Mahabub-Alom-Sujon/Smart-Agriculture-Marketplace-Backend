import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catch-async'
import { sendResponse } from '../../utils/send-response'
import { orderService } from "./order.service";
import {IRequestUser} from "../auth/auth.interface";
import {OrderStatus} from "../../../generated/prisma/enums";

const createOrder = catchAsync(async (req: Request, res: Response) => {
    //const user = req.user as { userId: string; role: string };
    const user = req.user as IRequestUser;
    const result = await orderService.createOrder(
        user.userId,
        req.body
        );

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Order placed successfully",
        data: result,
    });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
    // const user = req.user as { userId: string; role: string };
    const user = req.user as IRequestUser;
    const result = await orderService.getMyOrders(
        user.userId,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Your orders retrieved successfully",
        data: result,
    });
});

const getOrderById = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;
    const result = await orderService.getOrderById(
        req.params.id as string,
        user.userId,
        user.role

    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Order details retrieved successfully",
        data: result,
    });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body; // Zod body ভ্যালিডেশন থেকে আসবে
    const user = req.user as IRequestUser; // লগইন করা ইউজার

    // সার্ভিসে ডাটা পাঠানো
    const result = await orderService.updateOrderStatus(id, status, {
        userId: user.userId,
        role: user.role
    });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Order status updated successfully",
        data: result,
    });
});

export const orderController = {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus
};