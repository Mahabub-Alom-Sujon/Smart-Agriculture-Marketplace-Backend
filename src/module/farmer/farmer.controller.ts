import { Request, Response } from 'express'
import { catchAsync } from '../../utils/catch-async'
import { sendResponse } from '../../utils/send-response'
import { FarmerService } from './farmer.service';


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

export const FarmerController = {
    getAllFarmers,
    getFarmerById
};