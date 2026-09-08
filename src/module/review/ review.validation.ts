
import { z } from "zod";

const createReviewValidationSchema = z.object({
  body: z.object({
    rating: z
      .number({
        message: "Rating must be a number",
      })
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot be more than 5"),

    comment: z
      .string()
      .trim()
      .max(1000, "Comment cannot exceed 1000 characters")
      .optional(),

      buyerId: z
          .string({
              message: "Buyer ID must be a string",
          })
          .uuid("Invalid buyer ID")
          .optional(),
    productId: z
      .string({
        message: "Product ID is required",
      })
      .uuid("Invalid product ID"),

    orderId: z
      .string({
        message: "Order ID is required",
      })
      .uuid("Invalid order ID"),
  }),
});

const updateReviewValidationSchema = z.object({
  body: z
    .object({
      rating: z
        .number()
        .int("Rating must be an integer")
        .min(1, "Rating must be at least 1")
        .max(5, "Rating cannot be more than 5")
        .optional(),

      comment: z
        .string()
        .trim()
        .max(1000, "Comment cannot exceed 1000 characters")
        .optional(),
    })
    .refine(
      (data) => data.rating !== undefined || data.comment !== undefined,
      {
        message: "At least one field is required to update review",
      }
    ),
});

export const ReviewValidation = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
};
