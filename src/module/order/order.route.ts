import { Router } from "express";
import { orderController } from "./order.controller";
import { OrderValidation } from "./order.validation";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

// ==============================
// Buyer Routes
// ==============================

router.post(
    "/",
    auth(Role.BUYER),
    validateRequest(OrderValidation.createOrderValidation),
    orderController .createOrder
);

router.get(
    "/my-orders",
    auth(Role.BUYER),
    orderController.getMyOrders
);

// ==============================
// Shared & Farmer/Admin Routes
// ==============================

router.get(
    "/:id",
    auth(Role.BUYER, Role.FARMER, Role.ADMIN, Role.SUPER_ADMIN),
    // validateRequest(OrderValidation.orderIdValidation),
    orderController.getOrderById
);

router.patch(
    "/:id/status",
    auth(Role.FARMER, Role.ADMIN, Role.SUPER_ADMIN),
    // validateRequest(OrderValidation.updateOrderStatusValidation),
    orderController.updateOrderStatus
);

export const OrderRoutes = router;