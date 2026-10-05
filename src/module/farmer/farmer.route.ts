import { Router } from "express";
import { FarmerController } from "./farmer.controller";

const router = Router();

// ==============================
// Public Routes
// ==============================

router.get("/", FarmerController.getAllFarmers)
router.get("/:id", FarmerController.getFarmerById);

export const FarmerRoutes = router;