import { z } from "zod";

const updateProfileValidationSchema = z.object({
    body: z.object({
        // User টেবিলের কমন ফিল্ডসমূহ
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        imageUrl: z.string().optional(),
        imagePublicId: z.string().optional(),

        // Buyer টেবিলের ফিল্ডসমূহ
        city: z.string().optional(),
        country: z.string().optional(),

        // Farmer টেবিলের ফিল্ডসমূহ
        certification: z.string().optional(),

        // Expert টেবিলের ফিল্ডসমূহ
        specialization: z.string().optional(),
        qualification: z.string().optional(),
        experience: z.number().optional(),
    }),
});

export const ProfileValidation = {
    updateProfileValidationSchema,
};