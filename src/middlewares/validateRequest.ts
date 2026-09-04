
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { catchAsync } from "../utils/catch-async";
export const validateRequest = (
    zodSchema: z.ZodType<{ body: unknown }>,
) => {
    return catchAsync(
        async (
            req: Request,
            res: Response,
            next: NextFunction,
        ) => {
            const payload = {
                body: req.body,
                params: req.params,
                query: req.query,
            };

            const result = zodSchema.safeParse(payload);

            if (!result.success) {
                throw new Error(
                    result.error.issues[0]?.message ||
                    "Validation failed",
                );
            }

            req.body = result.data.body;

            next();
        },
    );
};