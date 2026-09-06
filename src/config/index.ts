import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.join(process.cwd(), ".env") });

export default {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL!, // 🟢 যোগ করা হয়েছে
    bak_url: process.env.APP_URL!,           // 🟢 যোগ করা হয়েছে
    frontend_url: process.env.FRONTEND_URL!, // 🟢 অত্যন্ত জরুরি: এখানে '!' যোগ করা হলো
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS!, // 🟢 যোগ করা হয়েছে

    // JWT সেটিংস
    jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN!,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,

    // স্ট্রাইপ (Stripe) পেমেন্ট সেটিংস
    stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
    stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY!,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
    stripe_product_id: process.env.STRIPE_PRODUCT_ID!,
    stripe_product_price_id: process.env.STRIPE_PRODUCT_PRICE_ID!,

    // ওঅথ (OAuth) সেটিংস
    google_client_id: process.env.GOOGLE_CLIENT_ID!,

    // সুপার এডমিন ও টেস্টার ক্রেডেনশিয়ালস
    super_admin_name: process.env.SUPER_ADMIN_NAME!,
    super_admin_email: process.env.SUPER_ADMIN_EMAIL!,
    super_admin_password: process.env.SUPER_ADMIN_PASSWORD!,
    tester_admin_name: process.env.TESTER_ADMIN_NAME!,
    tester_admin_email: process.env.TESTER_ADMIN_EMAIL!,
    tester_admin_password: process.env.TESTER_ADMIN_PASSWORD!,
};