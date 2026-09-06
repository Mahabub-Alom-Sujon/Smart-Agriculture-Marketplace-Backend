import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catch-async'
import { sendResponse } from '../../utils/send-response'
import {IRequestUser} from "../auth/auth.interface";
import {paymentService} from "./payment.service";

const createPaymentSession = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IRequestUser;

    const result = await paymentService.createPaymentSession(req.body, user.userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Payment checkout session created successfully",
        data: result,
    });
});

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;

    if (!signature || typeof signature !== "string") {
        throw new Error("Missing Stripe-Signature header");
    }

    // মনে রাখবেন: ওয়েবহুকের জন্য রিকোয়েস্টের raw body (Buffer) পাস করতে হয়
    const result = await paymentService.handleWebhook(
        signature,
        req.body as Buffer
    );

    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Webhook processed successfully",
        data: result,
    });
});

const getPaymentById = catchAsync(
    async (
        req: Request,
        res: Response
    ) => {
        const user = req.user as IRequestUser;
        const result =
            await paymentService.getPaymentById(
                req.params.id as string,
                user.userId,
                user.role
            );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Payment retrieved successfully",
            data: result,
        });
    }
);

export const paymentController = {
    createPaymentSession,
    handleWebhook,
    getPaymentById
};