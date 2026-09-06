import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catch-async'
import { sendResponse } from '../../utils/send-response'
import { FarmService } from "./farm.service";

const createFarm = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user as { userId: string; role: string };

        const result = await FarmService.createFarm(
            user.userId,
            req.body,
        );

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Farm created successfully",
            data: result,
        });
    },
);

const getAllFarms = catchAsync(
    async (req: Request, res: Response) => {
        const result = await FarmService.getAllFarms();

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Farms retrieved successfully",
            data: result,
        });
    },
);

const getFarmById = catchAsync(
    async (req: Request, res: Response) => {
        const  id  = req.params.id as string;

        const result = await FarmService.getFarmById(id);

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Farm retrieved successfully",
            data: result,
        });
    },
);

const getFarmsByFarmer = catchAsync(
    async (req: Request, res: Response) => {
        const { farmerId } = req.params;

        const result =
            await FarmService.getFarmsByFarmer(farmerId as string );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Farmer farms retrieved successfully",
            data: result,
        });
    },
);

const updateFarm = catchAsync(
    async (req: Request, res: Response) => {
        const  id  = req.params.id as string;
        const user = req.user as { userId: string; role: string };

        const result = await FarmService.updateFarm(
            id,
            user.userId,
            req.body,
        );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Farm updated successfully",
            data: result,
        });
    },
);

const deleteFarm = catchAsync(
    async (req: Request, res: Response) => {
        const  id  = req.params.id as string;
        const user = req.user as { userId: string; role: string };
        const result = await FarmService.deleteFarm(
            id,
            user.userId,
        );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Farm deleted successfully",
            data: result,
        });
    },
);


export const FarmController = {
    createFarm,
    getAllFarms,
    getFarmById,
    getFarmsByFarmer,
    updateFarm,
    deleteFarm,
};
