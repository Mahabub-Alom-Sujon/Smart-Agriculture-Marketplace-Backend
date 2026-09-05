import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catch-async'
import { sendResponse } from '../../utils/send-response'
import {categoryServices} from "./category.service";

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryServices.createCategory(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Category created successfully",
        data: result,
    });
});

const getAllCategories = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await categoryServices.getAllCategories();

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Categories retrieved successfully",
            data: result,
        });
    }
);

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryServices.getSingleCategory(
        req.params.id as string,
    )

    sendResponse(res, {
        success: true,
        statusCode : httpStatus.OK,
        message: "Category Single successfully",
        data: result,
    });
})

const updateCategory = catchAsync(
    async (req: Request, res: Response) => {
        const  id  = req.params.id as string;
        const payload = req.body;

        const result = await categoryServices.updateCategory(
            id,
            payload
        );

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Category updated successfully',
            data: result,
        });
    }
);

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryServices.deleteCategory(
        req.params.id as string,
    )

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Category deleted successfully',
        data: result,
    });
})

export const categoryController={
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory
}