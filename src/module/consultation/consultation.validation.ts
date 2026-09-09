import { z } from "zod";

const createConsultationValidationSchema = z.object({
    body: z.object({
        cropName: z
            .string()
            .min(2, "Crop name must be at least 2 characters")
            .optional(),

        problem: z
            .string()
            .min(5, "Problem must be at least 5 characters"),

        image: z
            .string()
            .url("Invalid image URL")
            .optional(),
    }),
});

const updateConsultationValidationSchema = z.object({
    body: z.object({
        cropName: z
            .string()
            .min(2, "Crop name must be at least 2 characters")
            .optional(),

        problem: z
            .string()
            .min(5, "Problem must be at least 5 characters")
            .optional(),

        image: z
            .string()
            .url("Invalid image URL")
            .optional(),
    }),
});

const updateConsultationStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum([
            "PENDING",
            "IN_REVIEW",
            "ANSWERED",
            "CLOSED",
        ]),
    }),
});

export const ConsultationValidation = {
    createConsultationValidationSchema,
    updateConsultationValidationSchema,
    updateConsultationStatusValidationSchema,
};