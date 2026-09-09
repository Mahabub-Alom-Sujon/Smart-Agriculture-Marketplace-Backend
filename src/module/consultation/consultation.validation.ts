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
            "ACCEPTED",
            "COMPLETED",
            "CANCELLED"
        ]),
    }),
});

// ==============================
// Create Expert Advice
// ==============================
const createExpertAdviceValidationSchema = z.object({
    body: z.object({
        diagnosis: z
            .string()
            .min(5, "Diagnosis must be at least 5 characters"),

        recommendation: z
            .string()
            .min(5, "Recommendation must be at least 5 characters"),

        fertilizer: z
            .string()
            .optional(),

        pesticide: z
            .string()
            .optional(),
    }),
});


// ==============================
// Update Expert Advice
// ==============================
const updateExpertAdviceValidationSchema = z.object({
    body: z.object({
        diagnosis: z
            .string()
            .min(5, "Diagnosis must be at least 5 characters")
            .optional(),

        recommendation: z
            .string()
            .min(5, "Recommendation must be at least 5 characters")
            .optional(),

        fertilizer: z
            .string()
            .optional(),

        pesticide: z
            .string()
            .optional(),
    }),
});


export const ConsultationValidation = {
    createConsultationValidationSchema,
    updateConsultationValidationSchema,
    updateConsultationStatusValidationSchema,
    createExpertAdviceValidationSchema,
    updateExpertAdviceValidationSchema,
};