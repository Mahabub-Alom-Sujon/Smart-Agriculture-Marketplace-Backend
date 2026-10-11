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

router.get(
    "/",
    auth(Role.SUPER_ADMIN, Role.ADMIN, Role.FARMER),
    CropController.getAllCrops
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
    auth(Role.FARMER),
    // validateRequest(cropIdValidation),
    CropController.deleteCrop
);

router.delete(
    "/admin/:id",
    auth(Role.SUPER_ADMIN, Role.ADMIN,),
    // validateRequest(cropIdValidation),
    CropController.deleteCrop
);

export const CropRoutes = router;

