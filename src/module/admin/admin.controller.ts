import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catch-async'
import { sendResponse } from '../../utils/send-response'
import { adminService } from "./admin.service";

const getDashboardStats = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await adminService.getDashboardStats();

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Dashboard stats retrieved successfully",
            data: result,
        });
    }
);

const getAllUsers = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await adminService.getAllUsers();

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "Users retrieved successfully",
            data: result,
        });
    }
);

const getSingleUser = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await adminService.getSingleUser(
                req.params.id as string,
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User retrieved successfully",
            data: result,
        });
    }
);

const updateUserStatus = catchAsync(
    async (req: Request, res: Response) => {
        const  id  = req.params.id as string;
        const payload = req.body;
        const result =
            await adminService.updateUserStatus(
                id,
                payload
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User status updated successfully",
            data: result,
        });
    }
);

const updateUserRole = catchAsync(
    async (req: Request, res: Response) => {
        const  id  = req.params.id as string;
        const payload = req.body.role;
        const result =
            await adminService.updateUserRole(
                id,
                payload
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User role updated successfully",
            data: result,
        });
    }
);

const deleteUser = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await adminService.deleteUser(
                req.params.id as string,
            );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.CREATED,
            message: "User deleted successfully",
            data: result,
        });
    }
);

export const adminController ={
    getDashboardStats,
    getAllUsers,
    getSingleUser,
    updateUserStatus,
    updateUserRole,
    deleteUser
}