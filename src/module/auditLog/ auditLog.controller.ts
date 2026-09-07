import { Request, Response } from "express";
import { AuditLogService } from "./auditLog.service";

const getAllAuditLogs = async (
    req: Request,
    res: Response
) => {
    const result = await AuditLogService.getAllAuditLogs(
        req.query as any
    );

    res.status(200).json({
        success: true,
        message: "Audit logs retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
};


const getAuditLogById = async (
    req: Request,
    res: Response
) => {
    const result = await AuditLogService.getAuditLogById(
        req.params.id as string
    );

    res.status(200).json({
        success: true,
        message: "Audit log retrieved successfully",
        data: result,
    });
};


export const AuditLogController = {
    getAllAuditLogs,
    getAuditLogById,
};