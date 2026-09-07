
// @ts-ignore
import { Prisma } from '@prisma/client';
export interface ICreateAuditLog {
    userId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    description?: string;
    oldValue?: Prisma.InputJsonValue;
    newValue?: Prisma.InputJsonValue;
    ipAddress?: string;
    userAgent?: string;
}