import { Router } from "express";
import { CropController } from "./crop.controller";
import { auth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";

import {
    createCropValidation,
    updateCropValidation,
    updateCropStatusValidation,
    cropIdValidation,
    cropsByFarmValidation,
} from "./crop.validation";

const router = Router();

// ========================
// Public Routes
// ========================

router.get(
    "/",
    CropController.getAllCrops
);

router.get(
    "/farm/:farmId",
    //validateRequest(cropsByFarmValidation),
    CropController.getCropsByFarm
);

router.get(
    "/:id",
    // validateRequest(cropIdValidation),
    CropController.getCropById
);

// ========================
// Farmer Routes
// ========================

router.post(
    "/",
    auth(Role.FARMER),
    validateRequest(createCropValidation),
    CropController.createCrop
);

router.patch(
    "/:id",
    auth(Role.FARMER),
    validateRequest(updateCropValidation),
    CropController.updateCrop
);

router.patch(
    "/:id/status",
    auth(Role.FARMER),
    validateRequest(updateCropStatusValidation),
    CropController.updateCropStatus
);

router.delete(
    "/:id",
    auth(Role.SUPER_ADMIN, Role.ADMIN, Role.FARMER),
    // validateRequest(cropIdValidation),
    CropController.deleteCrop
);

export const CropRoutes = router;

