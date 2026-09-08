import { z } from "zod";

// ==============================
// Expert Registration
// ==============================
const registerExpertValidationSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must not exceed 100 characters"),

        email: z
            .string()
            .email("Invalid email address")
            .trim()
            .toLowerCase(),

        password: z
            .string()
            .min(6, "Password must be at least 6 characters"),

        phone: z
            .string()
            .optional(),

        address: z
            .string()
            .optional(),

        city: z
            .string()
            .optional(),

        specialization: z
            .string()
            .optional(),

        qualification: z
            .string()
            .optional(),

        experience: z
            .number()
            .min(0, "Experience cannot be negative")
            .optional(),
    }),
});


// ==============================
// Update Expert
// ==============================
const updateExpertValidationSchema = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must not exceed 100 characters")
            .optional(),

        email: z
            .string()
            .email("Invalid email address")
            .trim()
            .toLowerCase()
            .optional(),

        city: z
            .string()
            .optional(),

        specialization: z
            .string()
            .optional(),

        qualification: z
            .string()
            .optional(),

        experience: z
            .number()
            .min(0, "Experience cannot be negative")
            .optional(),
    }),
});


export const ExpertValidation = {
    registerExpertValidationSchema,
    updateExpertValidationSchema,
};