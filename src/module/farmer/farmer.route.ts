import { Router } from "express";
import { FarmerController } from "./farmer.controller";
import {auth} from "../../middlewares/checkAuth";
import {Role} from "../../../generated/prisma/enums";

const router = Router();

// ==============================
// Public Routes
// ==============================

router.get("/", FarmerController.getAllFarmers)
router.get("/admin",
    auth(Role.SUPER_ADMIN, Role.ADMIN),
    FarmerController.getAllAdminFarmers
)
router.get("/:id", FarmerController.getFarmerById);

router.delete("/:id",
    auth(Role.SUPER_ADMIN, Role.ADMIN),
    FarmerController.getFarmerById
);

export const FarmerRoutes = router;