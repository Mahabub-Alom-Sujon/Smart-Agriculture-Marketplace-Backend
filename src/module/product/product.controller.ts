import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catch-async'
import { sendResponse } from '../../utils/send-response'
import { productService } from './product.service'
import {Role} from "../../../generated/prisma/enums";
import {IRequestUser} from "../auth/auth.interface";

const createProduct = catchAsync(
    async (req: Request, res: Response) => {
        const result = await productService.createProduct(
            req.body
        );
        sendResponse(res, {
            success: true,
            statusCode : httpStatus.OK,
            message: 'Product created successfully',
            data: result,
        });
    }
);

const getAllProducts = catchAsync(
    async (req: Request, res: Response) => {
        const result = await productService.getAllProducts( req.query);

        sendResponse(res, {
            success: true,
            statusCode : httpStatus.OK,
            message: 'Products retrieved successfully',
            meta: result.meta,
            data: result.data,
        });
    }
);

const getAllAdminProducts = catchAsync(
    async (req: Request, res: Response) => {
        const result = await productService.getAllAdminProducts( req.query);
        sendResponse(res, {
            success: true,
            statusCode : httpStatus.OK,
            message: 'Products retrieved successfully',
            meta: result.meta,
            data: result.data,
        });
    }
);


const getSinglePublicProduct = catchAsync(
    async (req: Request, res: Response) => {
        const result = await productService.getSinglePublicProduct(
            req.params.id as string,
        );

        sendResponse(res, {
            success: true,
            statusCode : httpStatus.OK,
            message: 'Product retrieved successfully',
            data: result,
        });
    }
);

const getSingleProduct = catchAsync(
    async (req: Request, res: Response) => {
        const  id  = req.params.id as string;
        const { userId, role } = req.user!;
        const result = await productService.getSingleProduct(
            id,
            userId,
            role
        );

        sendResponse(res, {
            success: true,
            statusCode : httpStatus.OK,
            message: 'Product retrieved successfully',
            data: result,
        });
    }
);

const updateProduct = catchAsync(
    async (req: Request, res: Response) => {
        const  id  = req.params.id as string;
        const result = await productService.updateProduct(
            id,
            req.body
        );
        sendResponse(res, {
            success: true,
            statusCode : httpStatus.OK,
            message: 'Product updated successfully',
            data: result,
        });
    }
);

const deleteProduct = catchAsync(
    async (req: Request, res: Response) => {
        const  id  = req.params.id as string;
        const role = req.user?.role;
        if (!role) {
            throw new Error("Unauthorized");
        }

        const result = await productService.deleteProduct( id, role);
        sendResponse(res, {
            success: true,
            statusCode : httpStatus.OK,
            message: role === Role.SUPER_ADMIN
                ? "Product permanently deleted successfully"
                : "Product deleted successfully",
            data: result,
        });
    }
);

const getMyProducts = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user?.userId as string;
        //const user = req.user as { userId: string; role: string };
        const result = await productService.getMyProducts(
            userId,
            req.query
        );
        sendResponse(res, {
            success: true,
            statusCode : httpStatus.OK,
            message: 'Your products retrieved successfully',
            data: result,
        });
    }
);

const getProductsByCategory = catchAsync(
    async (req: Request, res: Response) => {
        const categoryId = req.params.categoryId as string;
        const result =
            await productService.getProductsByCategory(
                categoryId
            );
        sendResponse(res, {
            success: true,
            statusCode : httpStatus.OK,
            message: 'Category products retrieved successfully',
            data: result,
        });
    }
);
const updateProductStatus = catchAsync(
    async (req: Request, res: Response) => {
        const  id  = req.params.id as string;
        const { status } = req.body;
        const result =
            await productService.updateProductStatus(
                id,
                status
            );
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Product status updated successfully',
            data: result,
        });
    }
);




export const productController ={
    createProduct,
    getAllProducts,
    getAllAdminProducts,
    getSinglePublicProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    getMyProducts,
    getProductsByCategory,
    updateProductStatus
}