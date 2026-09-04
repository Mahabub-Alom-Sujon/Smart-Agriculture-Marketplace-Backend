import { z } from "zod";
import { Role } from "../../../generated/prisma/enums";

const ManualRegistrationZodSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(4, "Name must be at least 4 characters long")
            .max(30, "Name cannot exceed 30 characters"),

        email: z
            .string()
            .trim()
            .toLowerCase()
            .email("Invalid email format"),

        password: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(
                /[a-z]/,
                "Password must contain at least 1 lowercase letter",
            )
            .regex(
                /[A-Z]/,
                "Password must contain at least 1 uppercase letter",
            )
            .regex(
                /[0-9]/,
                "Password must contain at least 1 number",
            )
            .regex(
                /[^A-Za-z0-9]/,
                "Password must contain at least 1 special character",
            ),

        phone: z
            .string()
            .trim()
            .optional(),

        address: z
            .string()
            .trim()
            .optional(),

        city: z
            .string()
            .trim()
            .optional(),

        country: z
            .string()
            .trim()
            .optional(),

        role: z.enum(
            [Role.FARMER, Role.BUYER],
            {
                message: "Role must be either FARMER or BUYER",
            },
        ),
    }),
});

const LoginZodSchema = z.object({
    body: z.object({
        email: z
            .string()
            .trim()
            .toLowerCase()
            .email("Invalid email format"),

        password: z
            .string()
            .min(1, "Password is required"),
    }),
});

const GoogleLoginZodSchema = z.object({
    body: z.object({
        idToken: z
            .string()
            .min(1, "Google ID Token is required"),

        role: z.enum(
            [Role.FARMER, Role.BUYER],
            {
                message: "Role must be either FARMER or BUYER",
            },
        ),
    }),
});

export const UserValidation = {
    ManualRegistrationZodSchema,
    LoginZodSchema,
    GoogleLoginZodSchema,
};