import { z } from "zod";
import {
    ProductStatus,
    Role,
    UserStatus,
} from "../../../generated/prisma/enums";

/**
 * Update User Status
 */
export const updateUserStatusValidation = z.object({
    params: z.object({
        id: z.string().uuid("Invalid user ID"),
    }),

    body: z.object({
        status: z.enum(UserStatus),
    }),
});

/**
 * Update User Role
 */
export const updateUserRoleValidation = z.object({
    params: z.object({
        id: z.string().uuid("Invalid user ID"),
    }),

    body: z.object({
        role: z.enum(Role),
    }),
});

/**
 * Ban / Unban User
 */
export const updateUserBanValidation = z.object({
    params: z.object({
        id: z.string().uuid("Invalid user ID"),
    }),

    body: z.object({
        isBanned: z.boolean(),
    }),
});

/**
 * Update Product Status
 */
export const updateProductStatusValidation = z.object({
    params: z.object({
        id: z.string().uuid("Invalid product ID"),
    }),

    body: z.object({
        status: z.enum(ProductStatus),
    }),
});

/**
 * ID Validation
 */
export const adminIdValidation = z.object({
    params: z.object({
        id: z.string().uuid("Invalid ID"),
    }),
});

export const adminValidation = {
    updateUserStatusValidation,
    updateUserRoleValidation,
    updateUserBanValidation,
    updateProductStatusValidation,
    adminIdValidation,
};