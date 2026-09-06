import { z } from "zod";

export const createFarmValidation = z.object({
    body: z.object({
        farmName: z
            .string()
            .min(2, "Farm name must be at least 2 characters")
            .max(100, "Farm name cannot exceed 100 characters"),

        location: z
            .string()
            .min(2, "Location is required")
            .max(255, "Location cannot exceed 255 characters"),

        landSize: z
            .number()
            .positive("Land size must be greater than 0")
            .optional(),

        soilType: z
            .string()
            .max(100, "Soil type cannot exceed 100 characters")
            .optional(),
    }),
});

export const updateFarmValidation = z.object({
    body: z.object({
        farmName: z
            .string()
            .min(2, "Farm name must be at least 2 characters")
            .max(100, "Farm name cannot exceed 100 characters")
            .optional(),

        location: z
            .string()
            .min(2, "Location must be at least 2 characters")
            .max(255, "Location cannot exceed 255 characters")
            .optional(),

        landSize: z
            .number()
            .positive("Land size must be greater than 0")
            .optional(),

        soilType: z
            .string()
            .max(100, "Soil type cannot exceed 100 characters")
            .optional(),
    }),

    params: z.object({
        id: z.string().uuid("Invalid farm ID"),
    }),
});

export const farmIdValidation = z.object({
    params: z.object({
        id: z.string().uuid("Invalid farm ID"),
    }),
});

export const farmerIdValidation = z.object({
    params: z.object({
        farmerId: z.string().uuid("Invalid farmer ID"),
    }),
});