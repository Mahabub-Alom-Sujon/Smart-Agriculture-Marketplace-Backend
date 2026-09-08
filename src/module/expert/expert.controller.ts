import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catch-async'
import { sendResponse } from '../../utils/send-response'
import {ExpertService} from "./expert.service";
import {IRequestUser} from "../auth/auth.interface";

const registerExpert = catchAsync(
    async (req: Request, res: Response) => {
        const result = await ExpertService.registerExpert(
            req.body
        );

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Expert registered successfully",
            data: result,
        });
    }
);

// ==============================
// Get All Experts
// ==============================
const getAllExperts = catchAsync(
    async (req: Request, res: Response) => {
        const result = await ExpertService.getAllExperts(
            req.query
        );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Experts retrieved successfully",
            meta: result.meta,
            data: result.data,
        });
    }
);

// ==============================
// Get Single Expert
// ==============================
const getSingleExpert = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result = await ExpertService.getSingleExpert(
            id as string
        );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Expert retrieved successfully",
            data: result,
        });
    }
);

// ==============================
// Delete Expert (Controller)
// ==============================
const deleteExpert = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = req.user as IRequestUser;
        const result = await ExpertService.deleteExpert(
            id as string,
            user.userId,
            user.role
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Expert deleted successfully",
            data: result,
        });
    }
);


export const ExpertController = {
    registerExpert,
    getAllExperts,
    getSingleExpert,
    deleteExpert
};