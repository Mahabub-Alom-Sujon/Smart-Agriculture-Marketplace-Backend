import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/checkAuth";
import {categoryController} from "./category.controller";

const router = Router();

router.post(
    "/",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    categoryController.createCategory,
);

router.get(
    "/:id",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    categoryController.getSingleCategory,
);

router.patch(
    "/:id",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    categoryController.updateCategory,
);

router.delete(
    '/:id',
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    categoryController.deleteCategory
);

export const CategoryRoutes = router;