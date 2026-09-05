import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/checkAuth";
import { productController } from "./product.controller";
import {validateRequest} from "../../middlewares/validateRequest";
import {productValidation, updateProductStatusValidation} from "./product.validation";

const router = Router();

// Public
router.get('/', productController.getAllProducts);


router.get(
    '/category/:categoryId',
    productController.getProductsByCategory
);

router.get(
    '/:id',
    productController.getSingleProduct
);




// Farmer, SUPER_ADMIN , ADMIN
router.post(
    '/',
    auth(Role.FARMER, Role.ADMIN , Role.SUPER_ADMIN),
    validateRequest(productValidation.createProductValidation),
    productController.createProduct
);

router.get(
    '/farmer/my-products',
    auth(Role.FARMER),
    productController.getMyProducts
);


router.patch(
    '/:id',
    auth(Role.FARMER, Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(productValidation.updateProductValidation),
    productController.updateProduct
);

router.delete(
    '/:id',
    auth(Role.FARMER, Role.ADMIN, Role.SUPER_ADMIN),
    productController.deleteProduct
);


// Admin
router.patch(
    '/:id/status',
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(productValidation.updateProductStatusValidation),
    productController.updateProductStatus
);

export const ProductRoutes = router;