import { Request, Response } from "express";
import httpStatus from 'http-status'
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { ConsultationService } from "./consultation.service";
import {IRequestUser} from "../auth/auth.interface";

// ==============================
// Create Consultation
// ==============================
const createConsultation = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user as IRequestUser;

        const result =
            await ConsultationService.createConsultation(
                user.userId,
                req.body
            );

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Consultation created successfully",
            data: result,
        });
    }
);

// ==============================
// Get All Consultations
// ==============================
const getAllConsultations = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await ConsultationService.getAllConsultations(
                req.query
            );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Consultations retrieved successfully",
            meta: result.meta,
            data: result.data,
        });
    }
);

// ==============================
// Get Single Consultation
// ==============================
const getSingleConsultation = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result =
            await ConsultationService.getSingleConsultation(
                id as string
            );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Consultation retrieved successfully",
            data: result,
        });
    }
);

// ==============================
// Update Consultation
// ==============================
const updateConsultation = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = req.user as IRequestUser;

        const result =
            await ConsultationService.updateConsultation(
                id as string,
                user.userId,
                req.body
            );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Consultation updated successfully",
            data: result,
        });
    }
);

// ==============================
// Update Consultation Status
// ==============================
const updateConsultationStatus = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status } = req.body;

        const result =
            await ConsultationService.updateConsultationStatus(
                id as string,
                status
            );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Consultation status updated successfully",
            data: result,
        });
    }
);

// ==============================
// Delete Consultation
// ==============================
const deleteConsultation = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = req.user as IRequestUser;

        const result =
            await ConsultationService.deleteConsultation(
                id as string,
                user.userId,
            );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Consultation deleted successfully",
            data: result,
        });
    }
);

// ==================================================
// Create Expert Advice
// ==================================================
const createExpertAdvice = catchAsync(
    async (req: Request, res: Response) => {
        const { id: consultationId } = req.params;
        const user = req.user as IRequestUser;

        const result =
            await ConsultationService.createExpertAdvice(
                consultationId as string,
                user.userId,
                req.body
            );

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Expert advice created successfully",
            data: result,
        });
    }
);

// ==================================================
// Get Consultation Advice
// ==================================================
const getConsultationAdvice = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result =
            await ConsultationService.getConsultationAdvice(
                id as string
            );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Expert advice retrieved successfully",
            data: result,
        });
    }
);

// ==================================================
// Update Expert Advice
// ==================================================
const updateExpertAdvice = catchAsync(
    async (req: Request, res: Response) => {
        const { id: consultationId } = req.params;
        const user = req.user as IRequestUser;

        const result =
            await ConsultationService.updateExpertAdvice(
                consultationId as string,
                user.userId,
                req.body
            );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Expert advice updated successfully",
            data: result,
        });
    }
);

// ==================================================
// Delete Expert Advice
// ==================================================
const deleteExpertAdvice = catchAsync(
    async (req: Request, res: Response) => {
        const { id: consultationId } = req.params;
        const user = req.user as IRequestUser;

        const result =
            await ConsultationService.deleteExpertAdvice(
                consultationId as string,
                user.userId,
            );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Expert advice deleted successfully",
            data: result,
        });
    }
);

export const ConsultationController = {
    createConsultation,
    getAllConsultations,
    getSingleConsultation,
    updateConsultation,
    deleteConsultation,
    updateConsultationStatus,

    createExpertAdvice,
    getConsultationAdvice,
    updateExpertAdvice,
    deleteExpertAdvice,
};
