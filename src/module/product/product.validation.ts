import { z } from "zod";
import { ProductStatus } from "../../../generated/prisma/enums";

export const createProductValidation = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, "Product name must be at least 2 characters")
            .max(100, "Product name cannot exceed 100 characters"),

        description: z
            .string()
            .max(1000, "Description cannot exceed 1000 characters")
            .optional(),

        price: z
            .number()
            .int("Price must be an integer")
            .positive("Price must be greater than 0"),

        quantity: z
            .number()
            .positive("Quantity must be greater than 0"),

        unit: z
            .string()
            .min(1, "Unit cannot be empty")
            .default("KG"),

        image: z
            .string()
            .url("Image must be a valid URL")
            .optional(),

        categoryId: z
            .string()
            .uuid("Invalid category ID"),

        farmerId: z
            .string()
            .uuid("Invalid farmer ID"),
    }),
});

export const updateProductValidation = z.object({
    body: z.object({
        name: z
            .string()
            .min(2, "Product name must be at least 2 characters")
            .max(100, "Product name cannot exceed 100 characters")
            .optional(),

        description: z
            .string()
            .max(1000, "Description cannot exceed 1000 characters")
            .optional(),

        price: z
            .number()
            .int("Price must be an integer")
            .positive("Price must be greater than 0")
            .optional(),

        quantity: z
            .number()
            .positive("Quantity must be greater than 0")
            .optional(),

        unit: z
            .string()
            .min(1, "Unit cannot be empty")
            .optional(),

        image: z
            .string()
            .url("Image must be a valid URL")
            .optional(),

        categoryId: z
            .string()
            .uuid("Invalid category ID")
            .optional(),

        status: z
            .nativeEnum(ProductStatus)
            .optional(),
    }),

    params: z.object({
        id: z
            .string()
            .uuid("Invalid product ID"),
    }),
});

export const updateProductStatusValidation = z.object({
    body: z.object({
        status: z.enum(ProductStatus, {
            message: "Product status is required",
        }),
    }),

    params: z.object({
        id: z.string().uuid("Invalid product ID"),
    }),
});

export const productValidation ={
    createProductValidation,
    updateProductValidation,
    updateProductStatusValidation
}


