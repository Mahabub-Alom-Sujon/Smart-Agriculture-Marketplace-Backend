import { z } from "zod";
import { CropStatus } from "../../../generated/prisma/enums";

// Create Crop
export const createCropValidation = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, "Crop name must be at least 2 characters")
            .max(100, "Crop name cannot exceed 100 characters"),

        variety: z
            .string()
            .max(100, "Variety cannot exceed 100 characters")
            .optional(),

        plantingDate: z
            .string()
            .datetime("Invalid planting date")
            .optional(),

        harvestDate: z
            .string()
            .datetime("Invalid harvest date")
            .optional(),

        status: z
            .nativeEnum(CropStatus)
            .optional(),

        farmId: z
            .string()
            .uuid("Invalid farm ID"),
    }),
});


// Update Crop
export const updateCropValidation = z.object({
    params: z.object({
        id: z
            .string()
            .uuid("Invalid crop ID"),
    }),

    body: z.object({
        name: z
            .string()
            .min(2, "Crop name must be at least 2 characters")
            .max(100, "Crop name cannot exceed 100 characters")
            .optional(),

        variety: z
            .string()
            .max(100, "Variety cannot exceed 100 characters")
            .nullable()
            .optional(),

        plantingDate: z
            .string()
            .datetime("Invalid planting date")
            .nullable()
            .optional(),

        harvestDate: z
            .string()
            .datetime("Invalid harvest date")
            .nullable()
            .optional(),

        status: z
            .nativeEnum(CropStatus)
            .optional(),

        farmId: z
            .string()
            .uuid("Invalid farm ID")
            .optional(),
    }),
});


// Update Crop Status
export const updateCropStatusValidation = z.object({
    params: z.object({
        id: z
            .string()
            .uuid("Invalid crop ID"),
    }),

    body: z.object({
        status: z.nativeEnum(CropStatus),
    }),
});


// Crop ID
export const cropIdValidation = z.object({
    params: z.object({
        id: z
            .string()
            .uuid("Invalid crop ID"),
    }),
});


// Farm ID
export const cropsByFarmValidation = z.object({
    params: z.object({
        farmId: z
            .string()
            .uuid("Invalid farm ID"),
    }),
});