import { Request, Response } from 'express'
import { catchAsync } from '../../utils/catch-async'
import { sendResponse } from '../../utils/send-response'
import { FarmerService } from './farmer.service';
import {IRequestUser} from "../auth/auth.interface";
import httpStatus from "http-status";


const getAllFarmers = catchAsync(
    async (req: Request, res: Response) => {
        const result = await FarmerService.getAllFarmers();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Farmers retrieved successfully",
            data: result,
        });
    }
)

const getAllAdminFarmers = catchAsync(
    async (req: Request, res: Response) => {
        const result = await FarmerService.getAllAdminFarmers(req.query);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Farmers retrieved successfully",
            data: result,
        });
    }
)

const getFarmerById = catchAsync(
    async (req: Request, res: Response) => {
        const  id  = req.params.id as string;
        const result = await FarmerService.getFarmerById(id);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Farmer retrieved successfully",
            data: result,
        });
    },
);

const deleteFarmer = catchAsync(
    async (req: Request, res: Response) => {
        const  id  = req.params.id as string;
        const role = req.user?.role;

        if (!role) {
            throw new Error("Unauthorized");
        }

        const result = await FarmerService.deleteFarmer(
            id as string,
            role
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Expert deleted successfully",
            data: result,
        });
    }
);

export const FarmerController = {
    getAllFarmers,
    getFarmerById,
    getAllAdminFarmers,
    deleteFarmer
};