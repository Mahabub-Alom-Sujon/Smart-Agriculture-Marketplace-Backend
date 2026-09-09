import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/checkAuth";
import { AuditLogController } from "./auditLog.controller";

const router = Router();

// Get all audit logs
router.get(
    "/",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    AuditLogController.getAllAuditLogs
);


// Get single audit log
router.get(
    "/:id",
    auth(Role.ADMIN, Role.SUPER_ADMIN),
    AuditLogController.getAuditLogById
);


export const AuditLogRoutes = router;