import express, { Router } from "express";
import { paymentController } from "./payment.controller";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/checkAuth";

const router = Router();

router.post(
    "/create",
    auth(Role.BUYER),
    paymentController.createPaymentSession
);

router.post(
    "/webhook",
    express.raw({ type: 'application/json' }),
    paymentController.handleWebhook
);

router.get(
    "/:id",
    auth(Role.BUYER, Role.FARMER, Role.ADMIN, Role.SUPER_ADMIN),
    paymentController.getPaymentById
);

export const PaymentRoutes = router;