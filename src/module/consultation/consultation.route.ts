import express from "express";
import { auth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middlewares/validateRequest";
import { ConsultationController } from "./consultation.controller";
import { ConsultationValidation } from "./consultation.validation";

const router = express.Router();

// ==================================================
// Farmer Consultation APIs
// ==================================================

// Create consultation
router.post(
    "/",
    auth(Role.FARMER),
    validateRequest(
        ConsultationValidation.createConsultationValidationSchema
    ),
    ConsultationController.createConsultation
);


// Get consultations
router.get(
    "/",
    auth(Role.SUPER_ADMIN, Role.ADMIN, Role.EXPERT, Role.FARMER),
    ConsultationController.getAllConsultations
);


// Get single consultation
router.get(
    "/:id",
    auth(Role.SUPER_ADMIN, Role.ADMIN, Role.EXPERT, Role.FARMER),
    ConsultationController.getSingleConsultation
);


// Update consultation
router.patch(
    "/:id",
    auth(Role.FARMER),
    validateRequest(
        ConsultationValidation.updateConsultationValidationSchema
    ),
    ConsultationController.updateConsultation
);


// Delete consultation
router.delete(
    "/:id",
    auth(Role.FARMER),
    ConsultationController.deleteConsultation
);

// ==================================================
// Consultation Status
// ==================================================

router.patch(
    "/:id/status",
    auth(Role.SUPER_ADMIN, Role.ADMIN, Role.EXPERT),
    validateRequest(
        ConsultationValidation.updateConsultationStatusValidationSchema),
    ConsultationController.updateConsultationStatus
);

// ==================================================
// Expert Advice APIs
// ==================================================

// Create advice
router.post(
    "/:id/advice",
    auth(Role.EXPERT),
    validateRequest(
        ConsultationValidation.createExpertAdviceValidationSchema
    ),
    ConsultationController.createExpertAdvice
);


// Get advice
router.get(
    "/:id/advice",
    auth(Role.SUPER_ADMIN, Role.ADMIN, Role.EXPERT ,Role.FARMER),
    ConsultationController.getConsultationAdvice
);


// Update advice
router.patch(
    "/:id/advice",
    auth(Role.EXPERT),
    validateRequest(
        ConsultationValidation.updateExpertAdviceValidationSchema
    ),
    ConsultationController.updateExpertAdvice
);


// Delete advice
router.delete(
    "/:id/advice",
    auth(Role.EXPERT,),
    ConsultationController.deleteExpertAdvice
);


export const ConsultationRoutes = router;
