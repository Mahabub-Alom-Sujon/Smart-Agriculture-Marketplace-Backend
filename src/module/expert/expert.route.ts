import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import {ExpertController} from "./expert.controller";
import {ExpertValidation} from "./expert.validation";

const router = Router();

router.post(
    "/register",
    validateRequest(ExpertValidation.registerExpertValidationSchema),
    ExpertController.registerExpert
);


// ==============================
// Super_admin admin Route
// ==============================

// ==============================
// Get All Experts
// ==============================
router.get(
    "/",
    auth(Role.SUPER_ADMIN, Role.ADMIN),
    ExpertController.getAllExperts
);


// ==============================
// Get Single Expert
// ==============================
router.get(
    "/:id",
    auth(Role.SUPER_ADMIN, Role.ADMIN),
    ExpertController.getSingleExpert
);

// ==============================
// Delete Expert Super_admin admin
// ==============================
router.delete(
    "/:id",
    auth(Role.SUPER_ADMIN, Role.ADMIN),
    ExpertController.deleteExpert
);

export const ExpertRoutes = router;
