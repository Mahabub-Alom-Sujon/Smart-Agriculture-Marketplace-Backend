export interface IUpdateProfilePayload {
    // User টেবিলের কমন ফিল্ডসমূহ
    name?: string;
    phone?: string;
    address?: string;
    imageUrl?: string;
    imagePublicId?: string;

    // Buyer টেবিলের ফিল্ডসমূহ
    city?: string;
    country?: string;

    // Farmer টেবিলের ফিল্ডসমূহ
    certification?: string;

    // Expert টেবিলের ফিল্ডসমূহ
    specialization?: string;
    qualification?: string;
    experience?: number;
}