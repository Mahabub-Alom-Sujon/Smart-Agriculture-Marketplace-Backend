import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/checkAuth";
import {categoryController} from "./category.controller";
import {validateRequest} from "../../middlewares/validateRequest";
import {categoryValidation} from "./category.validation";

const router = Router();

// ==============================
// Public Routes
// ==============================

// Get All Categories
router.get(
    "/",
    categoryController.getAllCategories,
);

// Get Single Category
router.get(
    "/:id",
    categoryController.getSingleCategory,
);

// ==============================
// Admin Routes
// ==============================

// Create Category
router.post(
    "/",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(
        categoryValidation.createCategoryValidation
    ),
    categoryController.createCategory,
);



// Update Category
router.patch(
    "/:id",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(
        categoryValidation.updateCategoryValidation
    ),
    categoryController.updateCategory,
);

// Delete Category
router.delete(
    "/:id",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    categoryController.deleteCategory,
);

export const CategoryRoutes = router;