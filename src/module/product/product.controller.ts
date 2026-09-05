import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { catchAsync } from '../../utils/catch-async'
import { sendResponse } from '../../utils/send-response'
import { productService } from './product.service'

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


const getSingleProduct = catchAsync(
    async (req: Request, res: Response) => {
        const result = await productService.getSingleProduct(
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

        const result = await productService.deleteProduct(
            id
        );

        sendResponse(res, {
            success: true,
            statusCode : httpStatus.OK,
            message: 'Product deleted successfully',
            data: result,
        });
    }
);

const getMyProducts = catchAsync(
    async (req: Request, res: Response) => {
        const farmerId = req.user?.userId as string;
        //const farmerId = req.id as string;

        const result = await productService.getMyProducts(
            farmerId
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
    getSingleProduct,
    updateProduct,
    deleteProduct,
    getMyProducts,
    getProductsByCategory,
    updateProductStatus
}