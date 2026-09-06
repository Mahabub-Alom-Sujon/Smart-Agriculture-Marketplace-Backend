import { Router } from "express";
import { CropController } from "./crop.controller";
import { auth } from "../../middlewares/checkAuth";
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
    auth("FARMER"),
    validateRequest(createCropValidation),
    CropController.createCrop
);

router.patch(
    "/:id",
    auth("FARMER"),
    validateRequest(updateCropValidation),
    CropController.updateCrop
);

router.patch(
    "/:id/status",
    auth("FARMER"),
    validateRequest(updateCropStatusValidation),
    CropController.updateCropStatus
);

router.delete(
    "/:id",
    auth("FARMER"),
    // validateRequest(cropIdValidation),
    CropController.deleteCrop
);

export const CropRoutes = router;

