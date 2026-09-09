import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/checkAuth";
import {adminController} from "./admin.controller";
import {validateRequest} from "../../middlewares/validateRequest";
import {adminValidation} from "./admin.validation";

const router = Router();

router.get(
    "/dashboard-stats",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    adminController.getDashboardStats
);

router.get(
    "/users",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    adminController.getAllUsers
);

router.get(
    "/users/:id",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    // validateRequest(
    //     adminValidation.adminIdValidation
    // ),
    adminController.getSingleUser
);

router.patch(
    "/users/:id/status",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    validateRequest(
        adminValidation.updateUserStatusValidation
    ),
    adminController.updateUserStatus
);

router.patch(
    "/users/:id/role",
    auth(Role.SUPER_ADMIN),
    validateRequest(
        adminValidation.updateUserRoleValidation
    ),
    adminController.updateUserRole
);

router.delete(
    "/users/:id",
    auth(Role.SUPER_ADMIN),
    // validateRequest(
    //     adminValidation.adminIdValidation
    // ),
    adminController.deleteUser
);

export const AdminRoutes = router;
