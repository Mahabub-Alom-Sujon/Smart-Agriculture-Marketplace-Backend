import type { Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catch-async";
import { sendResponse } from "../../utils/send-response";
import { UserServices } from "./user.service";
import {IRequestUser} from "../auth/auth.interface";

const uploadProfileImage = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
        throw new AppError(httpStatus.BAD_REQUEST, "No File Provided.");
    }

    const userId = req.user?.userId;

    const result = await UserServices.uploadProfileImage(
        req.file?.buffer,
        userId!,
    );
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "New tokens generated successfully",
        data: result,
    });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as IRequestUser; // টোকেন ভেরিফিকেশন থেকে আসা ইউজার ডাটা

    const result = await UserServices.updateProfile(
        user.userId,
        user.role,
        req.body
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
})
export const UserController = {
    uploadProfileImage,
    updateProfile
};