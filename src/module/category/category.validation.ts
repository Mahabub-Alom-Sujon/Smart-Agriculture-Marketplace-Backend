import { z } from "zod";

export const createCategoryValidation = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, "Category name must be at least 2 characters")
            .max(100, "Category name cannot exceed 100 characters"),

        description: z
            .string()
            .max(500, "Description cannot exceed 500 characters")
            .optional(),

        image: z
            .string()
            .url("Image must be a valid URL")
            .optional(),
    }),
});

export const updateCategoryValidation = z.object({
    params: z.object({
        id: z
            .string()
            .uuid("Invalid category ID"),
    }),

    body: z.object({
        name: z
            .string()
            .min(2, "Category name must be at least 2 characters")
            .max(100, "Category name cannot exceed 100 characters")
            .optional(),

        description: z
            .string()
            .max(500, "Description cannot exceed 500 characters")
            .optional(),

        image: z
            .string()
            .url("Image must be a valid URL")
            .optional(),
    }),
});

export const categoryIdValidation = z.object({
    body: z.object({}).optional(),

    params: z.object({
        id: z.string().uuid("Invalid category ID"),
    }),
});

export const categoryValidation = {
    createCategoryValidation,
    updateCategoryValidation,
    categoryIdValidation,
};