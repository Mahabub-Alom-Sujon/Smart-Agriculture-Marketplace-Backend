import { z } from "zod";
import { OrderStatus } from "../../../generated/prisma/enums";
export const createOrderValidation = z.object({
    body: z.object({
        deliveryAddress: z
            .string()
            .min(5, "Delivery address is required"),

        items: z
            .array(
                z.object({
                    productId: z
                        .string()
                        .uuid("Invalid product ID"),

                    quantity: z
                        .number()
                        .positive("Quantity must be greater than 0"),
                })
            )
            .min(1, "At least one product is required"),
    }),
});

export const orderIdValidation = z.object({
    params: z.object({
        id: z
            .string()
            .uuid("Invalid order ID"),
    }),
});


const updateOrderStatusValidation = z.object({
    params: z.object({
        id: z
            .string()
            .uuid("Invalid order ID"),
    }),

    body: z.object({
        status: z.enum(OrderStatus),
    }),
});


export const OrderValidation = {
    createOrderValidation,
    orderIdValidation,
    updateOrderStatusValidation
};