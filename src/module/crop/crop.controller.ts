import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catch-async'
import { sendResponse } from '../../utils/send-response'
import { CropService } from "../crop/crop.service";

const createCrop = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user as { userId: string; role: string };
        // const user = req.user as IRequestUser;

        const result = await CropService.createCrop(
            user.userId,
            req.body
        );

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Crop created successfully",
            data: result,
        });
    }
);

const getAllCrops = catchAsync(
    async ( req: Request, res: Response) => {
        const result = await CropService.getAllCrops();

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Crops retrieved successfully",
            data: result,
        });
    }
);

const getCropsByFarm = catchAsync(
    async (req: Request, res: Response) => {
        const result = await CropService.getCropsByFarm(
            req.params.farmId as string
        );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Farm crops retrieved successfully",
            data: result,
        });
    }
);

const getCropById = catchAsync(
    async (req: Request, res: Response) => {
        const result = await CropService.getCropById(
            req.params.id as string
        );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Crop retrieved successfully",
            data: result,
        });
    }
);

const updateCrop = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user as { userId: string; role: string };

        const result = await CropService.updateCrop(
            user.userId,
            req.params.id as string,
            req.body
        );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Crop updated successfully",
            data: result,
        });
    }
);

const updateCropStatus = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user as { userId: string; role: string };

        const result = await CropService.updateCropStatus(
            user.userId,
            req.params.id as string,
            req.body.status
        );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Crop status updated successfully",
            data: result,
        });
    }
);

const deleteCrop = catchAsync(
    async (req: Request, res: Response) => {
        const user = req.user as { userId: string; role: string };

        await CropService.deleteCrop(
            user.userId,
            req.params.id as string
        );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Crop deleted successfully",
            data: null,
        });
    }
);

export const CropController = {
    createCrop,
    getAllCrops,
    getCropsByFarm,
    getCropById,
    updateCrop,
    updateCropStatus,
    deleteCrop,
};