import { Router } from "express";

import { FarmController } from "./farm.controller";

import {
    createFarmValidation,
    updateFarmValidation,
} from "./farm.validation";

import { auth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

// ==============================
// Public Routes
// ==============================

router.get(
    "/",
    FarmController.getAllFarms,
);

router.get(
    "/farmer/:farmerId",
    FarmController.getFarmsByFarmer,
);

router.get(
    "/:id",
    FarmController.getFarmById,
);

// ==============================
// Farmer Routes
// ==============================

router.post(
    "/",
    auth("FARMER"),
    validateRequest(createFarmValidation),
    FarmController.createFarm,
);

router.patch(
    "/:id",
    auth("FARMER"),
    validateRequest(updateFarmValidation),
    FarmController.updateFarm,
);

router.delete(
    "/:id",
    auth("FARMER"),
    FarmController.deleteFarm,
);


export const FarmRoutes = router;