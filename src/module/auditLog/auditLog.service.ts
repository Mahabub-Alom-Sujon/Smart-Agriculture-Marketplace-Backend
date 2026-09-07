import { prisma } from '../../lib/prisma'
import { ICreateAuditLog } from "./auditLog.interface";

const createAuditLog = async (data: ICreateAuditLog) => {
    const result = await prisma.auditLog.create({
        data: {
            userId: data.userId,
            action: data.action,
            resource: data.resource,
            resourceId: data.resourceId,
            description: data.description,
            oldValue: data.oldValue,
            newValue: data.newValue,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
        },
    });

    return result;
};

const getAllAuditLogs = async (query: {
    page?: number;
    limit?: number;
    action?: string;
    resource?: string;
    userId?: string;
}) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;

    const skip = (page - 1) * limit;

    const where = {
        ...(query.action && {
            action: query.action,
        }),

        ...(query.resource && {
            resource: query.resource,
        }),

        ...(query.userId && {
            userId: query.userId,
        }),
    };

    const [data, total] = await Promise.all([
        prisma.auditLog.findMany({
            where,
            skip,
            take: limit,

            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },

            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.auditLog.count({
            where,
        }),
    ]);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },

        data,
    };
};

const getAuditLogById = async (id: string) => {
    const result = await prisma.auditLog.findUnique({
        where: {
            id,
        },

        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    if (!result) {
        throw new Error("Audit log not found");
    }

    return result;
};

export const AuditLogService = {
    createAuditLog,
    getAllAuditLogs,
    getAuditLogById,
};
