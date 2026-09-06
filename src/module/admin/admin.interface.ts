import { UserStatus } from "../../../generated/prisma/enums";

export interface UpdateUserStatusPayload {
    status: UserStatus;
}

export interface UpdateUserRolePayload {
    role: "FARMER" | "BUYER" | "EXPERT" | "ADMIN" | "SUPER_ADMIN";
}

export interface ProductStatusPayload {
    status: "ACTIVE" | "INACTIVE" | "BLOCKED";
}