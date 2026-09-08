
            import { createRequire } from 'module';
            const require = createRequire(import.meta.url);
        
var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/server.ts
import "dotenv/config";

// src/app.ts
import express3 from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// src/config/index.ts
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
var config_default = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT || 5e3,
  database_url: process.env.DATABASE_URL,
  bak_url: process.env.APP_URL,
  frontend_url: process.env.FRONTEND_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  // JWT সেটিংস
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  // স্ট্রাইপ (Stripe) পেমেন্ট সেটিংস
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
  stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET,
  stripe_product_id: process.env.STRIPE_PRODUCT_ID,
  stripe_product_price_id: process.env.STRIPE_PRODUCT_PRICE_ID,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  // ওঅথ (OAuth) সেটিংস
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  // সুপার এডমিন ও টেস্টার ক্রেডেনশিয়ালস
  super_admin_name: process.env.SUPER_ADMIN_NAME,
  super_admin_email: process.env.SUPER_ADMIN_EMAIL,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  tester_admin_name: process.env.TESTER_ADMIN_NAME,
  tester_admin_email: process.env.TESTER_ADMIN_EMAIL,
  tester_admin_password: process.env.TESTER_ADMIN_PASSWORD
};

// src/middlewares/not-found.ts
import httpStatus from "http-status";
var notFoundHandler = (req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: `Not Found - Cannot ${req.method} ${req.originalUrl}`
  });
};

// src/middlewares/global-error.ts
import httpStatus2 from "http-status";

// generated/prisma/client.ts
import * as path2 from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\n// ====================\n// ENUMS\n// ====================\n\nenum Role {\n  FARMER\n  BUYER\n  EXPERT\n  ADMIN\n  SUPER_ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  INACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum AuthProvider {\n  GOOGLE\n  CREDENTIAL\n}\n\nenum CropStatus {\n  PLANNED\n  GROWING\n  HARVESTED\n}\n\nenum ProductStatus {\n  ACTIVE\n  SOLD_OUT\n  INACTIVE\n}\n\nenum OrderStatus {\n  PENDING\n  PAYMENT_PENDING\n  PAID\n  PROCESSING\n  SHIPPED\n  COMPLETED\n  DELIVERED\n  CANCELLED\n  REFUNDED\n  CONFIRMED\n}\n\nenum ConsultationStatus {\n  PENDING\n  ACCEPTED\n  COMPLETED\n  CANCELLED\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  REFUNDED\n  CANCELLED\n}\n\nenum PaymentProvider {\n  STRIPE\n}\n\n// ====================\n// USER\n// ====================\n\nmodel User {\n  id                 String       @id @default(uuid())\n  name               String\n  email              String       @unique\n  password           String?\n  phone              String?\n  address            String?\n  imageUrl           String?      @default("")\n  imagePublicId      String       @default("")\n  googleId           String?      @unique\n  authProvider       AuthProvider @default(CREDENTIAL)\n  emailVerified      Boolean      @default(false)\n  role               Role         @default(BUYER)\n  status             UserStatus   @default(ACTIVE)\n  needPasswordChange Boolean      @default(false)\n  isDeleted          Boolean      @default(false)\n  deletedAt          DateTime?\n  auditLogs          AuditLog[]\n  farmer             Farmer?\n  buyer              Buyer?\n  expert             Expert?\n  createdAt          DateTime     @default(now())\n  updatedAt          DateTime     @updatedAt\n}\n\n// ====================\n// FARMER MODEL\n// ====================\n\nmodel Farmer {\n  id            String         @id @default(uuid())\n  name          String\n  email         String         @unique\n  certification String?\n  userId        String         @unique\n  user          User           @relation(fields: [userId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  farms         Farm[]\n  products      Product[]\n  consultations Consultation[]\n  isDeleted     Boolean        @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime       @default(now())\n  updatedAt     DateTime       @updatedAt\n}\n\n// ====================\n// BUYER MODEL\n// ====================\n\nmodel Buyer {\n  id        String    @id @default(uuid())\n  name      String\n  email     String    @unique\n  address   String?\n  city      String?\n  country   String?\n  userId    String    @unique\n  user      User      @relation(fields: [userId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  orders    Order[]\n  reviews   Review[]\n  payments  Payment[]\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n}\n\n// ====================\n// EXPERT MODEL\n// ====================\n\nmodel Expert {\n  id             String         @id @default(uuid())\n  name           String\n  email          String         @unique\n  city           String?\n  specialization String? // \u098F\u0995\u09CD\u09B8\u09AA\u09BE\u09B0\u09CD\u099F\u09C7\u09B0 \u09A6\u0995\u09CD\u09B7\u09A4\u09BE\u09B0 \u0995\u09CD\u09B7\u09C7\u09A4\u09CD\u09B0 (\u09AF\u09C7\u09AE\u09A8: \u09AE\u09BE\u099F\u09BF, \u09AA\u09CB\u0995\u09BE \u09A6\u09AE\u09A8)\n  qualification  String? // \u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u0997\u09A4 \u09AF\u09CB\u0997\u09CD\u09AF\u09A4\u09BE (\u09AF\u09C7\u09AE\u09A8: BSc in Agriculture)\n  experience     Float? // \u0995\u09A4 \u09AC\u099B\u09B0\u09C7\u09B0 \u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE \u0986\u099B\u09C7\n  userId         String         @unique\n  user           User           @relation(fields: [userId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  expertAdvices  ExpertAdvice[]\n  isDeleted      Boolean        @default(false)\n  deletedAt      DateTime?\n  createdAt      DateTime       @default(now())\n  updatedAt      DateTime       @updatedAt\n}\n\n// ====================\n// CONSULTATION\n// ====================\n\nmodel Consultation {\n  id        String             @id @default(uuid())\n  cropName  String?\n  problem   String\n  image     String?\n  status    ConsultationStatus @default(PENDING)\n  advice    ExpertAdvice?\n  farmerId  String\n  farmer    Farmer             @relation(fields: [farmerId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  isDeleted Boolean            @default(false)\n  deletedAt DateTime?\n  createdAt DateTime           @default(now())\n  updatedAt DateTime           @updatedAt\n\n  @@index([farmerId])\n}\n\n// ====================\n// AUDIT LOG\n// ====================\n\nmodel AuditLog {\n  id          String   @id @default(uuid())\n  action      String\n  resource    String\n  resourceId  String?\n  description String?\n  oldValue    Json?\n  newValue    Json?\n  ipAddress   String?\n  userAgent   String?\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n  user        User?    @relation(fields: [userId], references: [id])\n  userId      String?\n}\n\n// ====================\n// FARM\n// ====================\n\nmodel Farm {\n  id        String    @id @default(uuid())\n  farmName  String\n  location  String\n  landSize  Float?\n  soilType  String?\n  farmerId  String\n  farmer    Farmer    @relation(fields: [farmerId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  crops     Crop[]\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n}\n\n// ====================\n// CROP\n// ====================\n\nmodel Crop {\n  id           String     @id @default(uuid())\n  name         String\n  variety      String?\n  plantingDate DateTime?\n  harvestDate  DateTime?\n  status       CropStatus @default(PLANNED)\n  farmId       String\n  farm         Farm       @relation(fields: [farmId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  isDeleted    Boolean    @default(false)\n  deletedAt    DateTime?\n  createdAt    DateTime   @default(now())\n  updatedAt    DateTime   @updatedAt\n}\n\n// ====================\n// EXPERT ADVICE\n// ====================\n\nmodel ExpertAdvice {\n  id             String       @id @default(uuid())\n  diagnosis      String\n  recommendation String\n  fertilizer     String?\n  pesticide      String?\n  consultationId String       @unique\n  expertId       String\n  consultation   Consultation @relation(fields: [consultationId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  expert         Expert       @relation(fields: [expertId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  isDeleted      Boolean      @default(false)\n  deletedAt      DateTime?\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n}\n\n// ====================\n// CATEGORY\n// ====================\n\nmodel Category {\n  id          String    @id @default(uuid())\n  name        String    @unique\n  description String?\n  image       String?\n  products    Product[]\n  isDeleted   Boolean   @default(false)\n  deletedAt   DateTime?\n  createdAt   DateTime  @default(now())\n  updatedAt   DateTime  @updatedAt\n}\n\n// ====================\n// PRODUCT\n// ====================\n\nmodel Product {\n  id          String        @id @default(uuid())\n  name        String\n  description String?\n  price       Int\n  quantity    Float\n  unit        String        @default("KG")\n  image       String?\n  status      ProductStatus @default(ACTIVE)\n  farmerId    String\n  categoryId  String\n  category    Category      @relation(fields: [categoryId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  farmer      Farmer        @relation(fields: [farmerId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  orderItems  OrderItem[]\n  reviews     Review[]\n  isDeleted   Boolean       @default(false)\n  deletedAt   DateTime?\n  createdAt   DateTime      @default(now())\n  updatedAt   DateTime      @updatedAt\n}\n\n// ====================\n// ORDER\n// ====================\n\nmodel Order {\n  id              String      @id @default(uuid())\n  orderNumber     String      @unique\n  totalAmount     Int\n  deliveryAddress String\n  status          OrderStatus @default(PENDING)\n  buyerId         String\n  farmerId        String\n  buyer           Buyer       @relation(fields: [buyerId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  orderItems      OrderItem[]\n  reviews         Review[]\n  payment         Payment?\n  isDeleted       Boolean     @default(false)\n  deletedAt       DateTime?\n  createdAt       DateTime    @default(now())\n  updatedAt       DateTime    @updatedAt\n}\n\n// =========================\n// ORDER ITEM\n// =========================\n\nmodel OrderItem {\n  id        String    @id @default(uuid())\n  quantity  Float\n  price     Int\n  orderId   String\n  order     Order     @relation(fields: [orderId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  productId String\n  product   Product   @relation(fields: [productId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n}\n\nmodel Payment {\n  id                    String          @id @default(uuid())\n  orderId               String          @unique\n  amount                Int\n  currency              String          @default("bdt")\n  provider              PaymentProvider @default(STRIPE)\n  status                PaymentStatus   @default(PENDING)\n  stripeSessionId       String?         @unique\n  stripePaymentIntentId String?         @unique\n  paidAt                DateTime?\n  buyerId               String?\n  order                 Order           @relation(fields: [orderId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  buyer                 Buyer?          @relation(fields: [buyerId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  createdAt             DateTime        @default(now())\n  updatedAt             DateTime        @updatedAt\n}\n\n// =========================\n// REVIEW\n// =========================\n\nmodel Review {\n  id        String    @id @default(uuid())\n  rating    Float\n  comment   String?\n  buyerId   String\n  buyer     Buyer     @relation(fields: [buyerId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  productId String\n  product   Product   @relation(fields: [productId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  orderId   String\n  order     Order     @relation(fields: [orderId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"imagePublicId","kind":"scalar","type":"String"},{"name":"googleId","kind":"scalar","type":"String"},{"name":"authProvider","kind":"enum","type":"AuthProvider"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"farmer","kind":"object","type":"Farmer","relationName":"FarmerToUser"},{"name":"buyer","kind":"object","type":"Buyer","relationName":"BuyerToUser"},{"name":"expert","kind":"object","type":"Expert","relationName":"ExpertToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Farmer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"certification","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"FarmerToUser"},{"name":"farms","kind":"object","type":"Farm","relationName":"FarmToFarmer"},{"name":"products","kind":"object","type":"Product","relationName":"FarmerToProduct"},{"name":"consultations","kind":"object","type":"Consultation","relationName":"ConsultationToFarmer"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Buyer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"country","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"BuyerToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"BuyerToOrder"},{"name":"reviews","kind":"object","type":"Review","relationName":"BuyerToReview"},{"name":"payments","kind":"object","type":"Payment","relationName":"BuyerToPayment"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Expert":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"specialization","kind":"scalar","type":"String"},{"name":"qualification","kind":"scalar","type":"String"},{"name":"experience","kind":"scalar","type":"Float"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ExpertToUser"},{"name":"expertAdvices","kind":"object","type":"ExpertAdvice","relationName":"ExpertToExpertAdvice"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Consultation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cropName","kind":"scalar","type":"String"},{"name":"problem","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ConsultationStatus"},{"name":"advice","kind":"object","type":"ExpertAdvice","relationName":"ConsultationToExpertAdvice"},{"name":"farmerId","kind":"scalar","type":"String"},{"name":"farmer","kind":"object","type":"Farmer","relationName":"ConsultationToFarmer"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"resource","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"oldValue","kind":"scalar","type":"Json"},{"name":"newValue","kind":"scalar","type":"Json"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"userId","kind":"scalar","type":"String"}],"dbName":null},"Farm":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"farmName","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"landSize","kind":"scalar","type":"Float"},{"name":"soilType","kind":"scalar","type":"String"},{"name":"farmerId","kind":"scalar","type":"String"},{"name":"farmer","kind":"object","type":"Farmer","relationName":"FarmToFarmer"},{"name":"crops","kind":"object","type":"Crop","relationName":"CropToFarm"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Crop":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"variety","kind":"scalar","type":"String"},{"name":"plantingDate","kind":"scalar","type":"DateTime"},{"name":"harvestDate","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"CropStatus"},{"name":"farmId","kind":"scalar","type":"String"},{"name":"farm","kind":"object","type":"Farm","relationName":"CropToFarm"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ExpertAdvice":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"diagnosis","kind":"scalar","type":"String"},{"name":"recommendation","kind":"scalar","type":"String"},{"name":"fertilizer","kind":"scalar","type":"String"},{"name":"pesticide","kind":"scalar","type":"String"},{"name":"consultationId","kind":"scalar","type":"String"},{"name":"expertId","kind":"scalar","type":"String"},{"name":"consultation","kind":"object","type":"Consultation","relationName":"ConsultationToExpertAdvice"},{"name":"expert","kind":"object","type":"Expert","relationName":"ExpertToExpertAdvice"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"products","kind":"object","type":"Product","relationName":"CategoryToProduct"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Product":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"quantity","kind":"scalar","type":"Float"},{"name":"unit","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ProductStatus"},{"name":"farmerId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProduct"},{"name":"farmer","kind":"object","type":"Farmer","relationName":"FarmerToProduct"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToProduct"},{"name":"reviews","kind":"object","type":"Review","relationName":"ProductToReview"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderNumber","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Int"},{"name":"deliveryAddress","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"buyerId","kind":"scalar","type":"String"},{"name":"farmerId","kind":"scalar","type":"String"},{"name":"buyer","kind":"object","type":"Buyer","relationName":"BuyerToOrder"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"OrderToReview"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrderToPayment"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Float"},{"name":"price","kind":"scalar","type":"Int"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"OrderItemToProduct"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Int"},{"name":"currency","kind":"scalar","type":"String"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"stripeSessionId","kind":"scalar","type":"String"},{"name":"stripePaymentIntentId","kind":"scalar","type":"String"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"buyerId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToPayment"},{"name":"buyer","kind":"object","type":"Buyer","relationName":"BuyerToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"comment","kind":"scalar","type":"String"},{"name":"buyerId","kind":"scalar","type":"String"},{"name":"buyer","kind":"object","type":"Buyer","relationName":"BuyerToReview"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToReview"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToReview"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","auditLogs","farmer","farm","crops","_count","farms","products","category","orders","buyer","product","order","reviews","payments","orderItems","payment","consultation","expertAdvices","expert","advice","consultations","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Farmer.findUnique","Farmer.findUniqueOrThrow","Farmer.findFirst","Farmer.findFirstOrThrow","Farmer.findMany","Farmer.createOne","Farmer.createMany","Farmer.createManyAndReturn","Farmer.updateOne","Farmer.updateMany","Farmer.updateManyAndReturn","Farmer.upsertOne","Farmer.deleteOne","Farmer.deleteMany","Farmer.groupBy","Farmer.aggregate","Buyer.findUnique","Buyer.findUniqueOrThrow","Buyer.findFirst","Buyer.findFirstOrThrow","Buyer.findMany","Buyer.createOne","Buyer.createMany","Buyer.createManyAndReturn","Buyer.updateOne","Buyer.updateMany","Buyer.updateManyAndReturn","Buyer.upsertOne","Buyer.deleteOne","Buyer.deleteMany","Buyer.groupBy","Buyer.aggregate","Expert.findUnique","Expert.findUniqueOrThrow","Expert.findFirst","Expert.findFirstOrThrow","Expert.findMany","Expert.createOne","Expert.createMany","Expert.createManyAndReturn","Expert.updateOne","Expert.updateMany","Expert.updateManyAndReturn","Expert.upsertOne","Expert.deleteOne","Expert.deleteMany","_avg","_sum","Expert.groupBy","Expert.aggregate","Consultation.findUnique","Consultation.findUniqueOrThrow","Consultation.findFirst","Consultation.findFirstOrThrow","Consultation.findMany","Consultation.createOne","Consultation.createMany","Consultation.createManyAndReturn","Consultation.updateOne","Consultation.updateMany","Consultation.updateManyAndReturn","Consultation.upsertOne","Consultation.deleteOne","Consultation.deleteMany","Consultation.groupBy","Consultation.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","Farm.findUnique","Farm.findUniqueOrThrow","Farm.findFirst","Farm.findFirstOrThrow","Farm.findMany","Farm.createOne","Farm.createMany","Farm.createManyAndReturn","Farm.updateOne","Farm.updateMany","Farm.updateManyAndReturn","Farm.upsertOne","Farm.deleteOne","Farm.deleteMany","Farm.groupBy","Farm.aggregate","Crop.findUnique","Crop.findUniqueOrThrow","Crop.findFirst","Crop.findFirstOrThrow","Crop.findMany","Crop.createOne","Crop.createMany","Crop.createManyAndReturn","Crop.updateOne","Crop.updateMany","Crop.updateManyAndReturn","Crop.upsertOne","Crop.deleteOne","Crop.deleteMany","Crop.groupBy","Crop.aggregate","ExpertAdvice.findUnique","ExpertAdvice.findUniqueOrThrow","ExpertAdvice.findFirst","ExpertAdvice.findFirstOrThrow","ExpertAdvice.findMany","ExpertAdvice.createOne","ExpertAdvice.createMany","ExpertAdvice.createManyAndReturn","ExpertAdvice.updateOne","ExpertAdvice.updateMany","ExpertAdvice.updateManyAndReturn","ExpertAdvice.upsertOne","ExpertAdvice.deleteOne","ExpertAdvice.deleteMany","ExpertAdvice.groupBy","ExpertAdvice.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Product.findUnique","Product.findUniqueOrThrow","Product.findFirst","Product.findFirstOrThrow","Product.findMany","Product.createOne","Product.createMany","Product.createManyAndReturn","Product.updateOne","Product.updateMany","Product.updateManyAndReturn","Product.upsertOne","Product.deleteOne","Product.deleteMany","Product.groupBy","Product.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","rating","comment","buyerId","productId","orderId","isDeleted","deletedAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","amount","currency","PaymentProvider","provider","PaymentStatus","status","stripeSessionId","stripePaymentIntentId","paidAt","quantity","price","orderNumber","totalAmount","deliveryAddress","OrderStatus","farmerId","name","description","unit","image","ProductStatus","categoryId","every","some","none","diagnosis","recommendation","fertilizer","pesticide","consultationId","expertId","variety","plantingDate","harvestDate","CropStatus","farmId","farmName","location","landSize","soilType","action","resource","resourceId","oldValue","newValue","ipAddress","userAgent","userId","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","cropName","problem","ConsultationStatus","email","city","specialization","qualification","experience","address","country","certification","password","phone","imageUrl","imagePublicId","googleId","AuthProvider","authProvider","emailVerified","Role","role","UserStatus","needPasswordChange","is","isNot","connectOrCreate","upsert","disconnect","delete","connect","createMany","set","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "7QePAfABGQQAAJgEACAFAACZBAAgDQAAggQAIBYAAJoEACCRAgAAlAQAMJICAAAHABCTAgAAlAQAMJQCAQAAAAGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIa4CAACXBPUCIrkCAQDIAwAh4gIBAAAAAecCAQDJAwAh6gIBAMkDACHrAgEAyQMAIewCAQDJAwAh7QIBAMgDACHuAgEAAAAB8AIAAJUE8AIi8QIgAMoDACHzAgAAlgTzAiL1AiAAygMAIQEAAAABACAQAwAAnQQAIJECAACbBAAwkgIAAAMAEJMCAACbBAAwlAIBAMgDACGcAkAAzAMAIZ0CQADMAwAhugIBAMkDACHRAgEAyAMAIdICAQDIAwAh0wIBAMkDACHUAgAAnAQAINUCAACcBAAg1gIBAMkDACHXAgEAyQMAIdgCAQDJAwAhCAMAAOwFACC6AgAAngQAINMCAACeBAAg1AIAAJ4EACDVAgAAngQAINYCAACeBAAg1wIAAJ4EACDYAgAAngQAIBADAACdBAAgkQIAAJsEADCSAgAAAwAQkwIAAJsEADCUAgEAAAABnAJAAMwDACGdAkAAzAMAIboCAQDJAwAh0QIBAMgDACHSAgEAyAMAIdMCAQDJAwAh1AIAAJwEACDVAgAAnAQAINYCAQDJAwAh1wIBAMkDACHYAgEAyQMAIQMAAAADACABAAAEADACAAAFACAZBAAAmAQAIAUAAJkEACANAACCBAAgFgAAmgQAIJECAACUBAAwkgIAAAcAEJMCAACUBAAwlAIBAMgDACGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIa4CAACXBPUCIrkCAQDIAwAh4gIBAMgDACHnAgEAyQMAIeoCAQDJAwAh6wIBAMkDACHsAgEAyQMAIe0CAQDIAwAh7gIBAMkDACHwAgAAlQTwAiLxAiAAygMAIfMCAACWBPMCIvUCIADKAwAhAQAAAAcAIBADAADhAwAgCQAA6gMAIAoAAM0DACAYAADrAwAgkQIAAOkDADCSAgAACQAQkwIAAOkDADCUAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhuQIBAMgDACHYAgEAyAMAIeICAQDIAwAh6QIBAMkDACEBAAAACQAgDwUAAPwDACAHAACTBAAgkQIAAJIEADCSAgAACwAQkwIAAJIEADCUAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhuAIBAMgDACHNAgEAyAMAIc4CAQDIAwAhzwIIAOADACHQAgEAyQMAIQUFAAD1BgAgBwAAgAcAIJsCAACeBAAgzwIAAJ4EACDQAgAAngQAIA8FAAD8AwAgBwAAkwQAIJECAACSBAAwkgIAAAsAEJMCAACSBAAwlAIBAAAAAZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhuAIBAMgDACHNAgEAyAMAIc4CAQDIAwAhzwIIAOADACHQAgEAyQMAIQMAAAALACABAAAMADACAAANACAPBgAAkQQAIJECAACPBAAwkgIAAA8AEJMCAACPBAAwlAIBAMgDACGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIa4CAACQBMwCIrkCAQDIAwAhyAIBAMkDACHJAkAAywMAIcoCQADLAwAhzAIBAMgDACEFBgAA_wYAIJsCAACeBAAgyAIAAJ4EACDJAgAAngQAIMoCAACeBAAgDwYAAJEEACCRAgAAjwQAMJICAAAPABCTAgAAjwQAMJQCAQAAAAGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIa4CAACQBMwCIrkCAQDIAwAhyAIBAMkDACHJAkAAywMAIcoCQADLAwAhzAIBAMgDACEDAAAADwAgAQAAEAAwAgAAEQAgAQAAAA8AIBUFAAD8AwAgCwAAjgQAIBAAAOYDACASAACJBAAgkQIAAIwEADCSAgAAFAAQkwIAAIwEADCUAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhrgIAAI0EvgIisgIIAIQEACGzAgIA_gMAIbgCAQDIAwAhuQIBAMgDACG6AgEAyQMAIbsCAQDIAwAhvAIBAMkDACG-AgEAyAMAIQcFAAD1BgAgCwAA_gYAIBAAAJsGACASAAD8BgAgmwIAAJ4EACC6AgAAngQAILwCAACeBAAgFQUAAPwDACALAACOBAAgEAAA5gMAIBIAAIkEACCRAgAAjAQAMJICAAAUABCTAgAAjAQAMJQCAQAAAAGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIa4CAACNBL4CIrICCACEBAAhswICAP4DACG4AgEAyAMAIbkCAQDIAwAhugIBAMkDACG7AgEAyAMAIbwCAQDJAwAhvgIBAMgDACEDAAAAFAAgAQAAFQAwAgAAFgAgAwAAABQAIAEAABUAMAIAABYAIAEAAAAUACAODgAAhgQAIA8AAIEEACCRAgAAiwQAMJICAAAaABCTAgAAiwQAMJQCAQDIAwAhmAIBAMgDACGZAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhsgIIAIQEACGzAgIA_gMAIQMOAAD7BgAgDwAA-gYAIJsCAACeBAAgDg4AAIYEACAPAACBBAAgkQIAAIsEADCSAgAAGgAQkwIAAIsEADCUAgEAAAABmAIBAMgDACGZAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhsgIIAIQEACGzAgIA_gMAIQMAAAAaACABAAAbADACAAAcACASDQAAhQQAIBAAAOYDACASAACJBAAgEwAAigQAIJECAACHBAAwkgIAAB4AEJMCAACHBAAwlAIBAMgDACGXAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhrgIAAIgEuAIitAIBAMgDACG1AgIA_gMAIbYCAQDIAwAhuAIBAMgDACEFDQAA9gYAIBAAAJsGACASAAD8BgAgEwAA_QYAIJsCAACeBAAgEg0AAIUEACAQAADmAwAgEgAAiQQAIBMAAIoEACCRAgAAhwQAMJICAAAeABCTAgAAhwQAMJQCAQAAAAGXAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhrgIAAIgEuAIitAIBAAAAAbUCAgD-AwAhtgIBAMgDACG4AgEAyAMAIQMAAAAeACABAAAfADACAAAgACAQDQAAhQQAIA4AAIYEACAPAACBBAAgkQIAAIMEADCSAgAAIgAQkwIAAIMEADCUAgEAyAMAIZUCCACEBAAhlgIBAMkDACGXAgEAyAMAIZgCAQDIAwAhmQIBAMgDACGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIQUNAAD2BgAgDgAA-wYAIA8AAPoGACCWAgAAngQAIJsCAACeBAAgEA0AAIUEACAOAACGBAAgDwAAgQQAIJECAACDBAAwkgIAACIAEJMCAACDBAAwlAIBAAAAAZUCCACEBAAhlgIBAMkDACGXAgEAyAMAIZgCAQDIAwAhmQIBAMgDACGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIQMAAAAiACABAAAjADACAAAkACARDQAAggQAIA8AAIEEACCRAgAA_QMAMJICAAAmABCTAgAA_QMAMJQCAQDIAwAhlwIBAMkDACGZAgEAyAMAIZwCQADMAwAhnQJAAMwDACGpAgIA_gMAIaoCAQDIAwAhrAIAAP8DrAIirgIAAIAErgIirwIBAMkDACGwAgEAyQMAIbECQADLAwAhBg0AAPYGACAPAAD6BgAglwIAAJ4EACCvAgAAngQAILACAACeBAAgsQIAAJ4EACARDQAAggQAIA8AAIEEACCRAgAA_QMAMJICAAAmABCTAgAA_QMAMJQCAQAAAAGXAgEAyQMAIZkCAQAAAAGcAkAAzAMAIZ0CQADMAwAhqQICAP4DACGqAgEAyAMAIawCAAD_A6wCIq4CAACABK4CIq8CAQAAAAGwAgEAAAABsQJAAMsDACEDAAAAJgAgAQAAJwAwAgAAKAAgEgMAAOEDACAMAADlAwAgEAAA5gMAIBEAAOcDACCRAgAA5AMAMJICAAAqABCTAgAA5AMAMJQCAQDIAwAhmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACG5AgEAyAMAIdgCAQDIAwAh4gIBAMgDACHjAgEAyQMAIecCAQDJAwAh6AIBAMkDACEBAAAAKgAgAQAAAB4AIAEAAAAiACABAAAAJgAgAwAAABoAIAEAABsAMAIAABwAIAMAAAAiACABAAAjADACAAAkACABAAAAJgAgAQAAABoAIAEAAAAiACADAAAAIgAgAQAAIwAwAgAAJAAgAQAAABoAIAEAAAAiACAPBQAA_AMAIBcAAPsDACCRAgAA-QMAMJICAAA3ABCTAgAA-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_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_A7gCIrQCAQCgAwAhtQICALUDACG2AgEAoAMAIbgCAQCgAwAhAwAAAB4AIAEAANcCADAqAADYAgAgAwAAAB4AIAEAAB8AMAIAACAAIAEAAAAcACABAAAAHAAgAwAAABoAIAEAABsAMAIAABwAIAMAAAAaACABAAAbADACAAAcACADAAAAGgAgAQAAGwAwAgAAHAAgCw4AAMQEACAPAADDBAAglAIBAAAAAZgCAQAAAAGZAgEAAAABmgIgAAAAAZsCQAAAAAGcAkAAAAABnQJAAAAAAbICCAAAAAGzAgIAAAABAR4AAOACACAJlAIBAAAAAZgCAQAAAAGZAgEAAAABmgIgAAAAAZsCQAAAAAGcAkAAAAABnQJAAAAAAbICCAAAAAGzAgIAAAABAR4AAOICADABHgAA4gIAMAsOAADCBAAgDwAAwQQAIJQCAQCkBAAhmAIBAKQEACGZAgEApAQAIZoCIACnBAAhmwJAAKgEACGcAkAAqQQAIZ0CQACpBAAhsgIIAKUEACGzAgIAtQQAIQIAAAAcACAeAADlAgAgCZQCAQCkBAAhmAIBAKQEACGZAgEApAQAIZoCIACnBAAhmwJAAKgEACGcAkAAqQQAIZ0CQACpBAAhsgIIAKUEACGzAgIAtQQAIQIAAAAaACAeAADnAgAgAgAAABoAIB4AAOcCACADAAAAHAAgJQAA4AIAICYAAOUCACABAAAAHAAgAQAAABoAIAYIAAC8BAAgKwAAvwQAICwAAL4EACBdAAC9BAAgXgAAwAQAIJsCAACeBAAgDJECAAC9AwAwkgIAAO4CABCTAgAAvQMAMJQCAQCgAwAhmAIBAKADACGZAgEAoAMAIZoCIACjAwAhmwJAAKQDACGcAkAApQMAIZ0CQAClAwAhsgIIAKEDACGzAgIAtQMAIQMAAAAaACABAADtAgAwKgAA7gIAIAMAAAAaACABAAAbADACAAAcACABAAAAKAAgAQAAACgAIAMAAAAmACABAAAnADACAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgAwAAACYAIAEAACcAMAIAACgAIA4NAAC7BAAgDwAAugQAIJQCAQAAAAGXAgEAAAABmQIBAAAAAZwCQAAAAAGdAkAAAAABqQICAAAAAaoCAQAAAAGsAgAAAKwCAq4CAAAArgICrwIBAAAAAbACAQAAAAGxAkAAAAABAR4AAPYCACAMlAIBAAAAAZcCAQAAAAGZAgEAAAABnAJAAAAAAZ0CQAAAAAGpAgIAAAABqgIBAAAAAawCAAAArAICrgIAAACuAgKvAgEAAAABsAIBAAAAAbECQAAAAAEBHgAA-AIAMAEeAAD4AgAwAQAAACoAIA4NAAC5BAAgDwAAuAQAIJQCAQCkBAAhlwIBAKYEACGZAgEApAQAIZwCQACpBAAhnQJAAKkEACGpAgIAtQQAIaoCAQCkBAAhrAIAALYErAIirgIAALcErgIirwIBAKYEACGwAgEApgQAIbECQACoBAAhAgAAACgAIB4AAPwCACAMlAIBAKQEACGXAgEApgQAIZkCAQCkBAAhnAJAAKkEACGdAkAAqQQAIakCAgC1BAAhqgIBAKQEACGsAgAAtgSsAiKuAgAAtwSuAiKvAgEApgQAIbACAQCmBAAhsQJAAKgEACECAAAAJgAgHgAA_gIAIAIAAAAmACAeAAD-AgAgAQAAACoAIAMAAAAoACAlAAD2AgAgJgAA_AIAIAEAAAAoACABAAAAJgAgCQgAALAEACArAACzBAAgLAAAsgQAIF0AALEEACBeAAC0BAAglwIAAJ4EACCvAgAAngQAILACAACeBAAgsQIAAJ4EACAPkQIAALQDADCSAgAAhgMAEJMCAAC0AwAwlAIBAKADACGXAgEAogMAIZkCAQCgAwAhnAJAAKUDACGdAkAApQMAIakCAgC1AwAhqgIBAKADACGsAgAAtgOsAiKuAgAAtwOuAiKvAgEAogMAIbACAQCiAwAhsQJAAKQDACEDAAAAJgAgAQAAhQMAMCoAAIYDACADAAAAJgAgAQAAJwAwAgAAKAAgAQAAACQAIAEAAAAkACADAAAAIgAgAQAAIwAwAgAAJAAgAwAAACIAIAEAACMAMAIAACQAIAMAAAAiACABAAAjADACAAAkACANDQAArQQAIA4AAK4EACAPAACvBAAglAIBAAAAAZUCCAAAAAGWAgEAAAABlwIBAAAAAZgCAQAAAAGZAgEAAAABmgIgAAAAAZsCQAAAAAGcAkAAAAABnQJAAAAAAQEeAACOAwAgCpQCAQAAAAGVAggAAAABlgIBAAAAAZcCAQAAAAGYAgEAAAABmQIBAAAAAZoCIAAAAAGbAkAAAAABnAJAAAAAAZ0CQAAAAAEBHgAAkAMAMAEeAACQAwAwDQ0AAKoEACAOAACrBAAgDwAArAQAIJQCAQCkBAAhlQIIAKUEACGWAgEApgQAIZcCAQCkBAAhmAIBAKQEACGZAgEApAQAIZoCIACnBAAhmwJAAKgEACGcAkAAqQQAIZ0CQACpBAAhAgAAACQAIB4AAJMDACAKlAIBAKQEACGVAggApQQAIZYCAQCmBAAhlwIBAKQEACGYAgEApAQAIZkCAQCkBAAhmgIgAKcEACGbAkAAqAQAIZwCQACpBAAhnQJAAKkEACECAAAAIgAgHgAAlQMAIAIAAAAiACAeAACVAwAgAwAAACQAICUAAI4DACAmAACTAwAgAQAAACQAIAEAAAAiACAHCAAAnwQAICsAAKIEACAsAAChBAAgXQAAoAQAIF4AAKMEACCWAgAAngQAIJsCAACeBAAgDZECAACfAwAwkgIAAJwDABCTAgAAnwMAMJQCAQCgAwAhlQIIAKEDACGWAgEAogMAIZcCAQCgAwAhmAIBAKADACGZAgEAoAMAIZoCIACjAwAhmwJAAKQDACGcAkAApQMAIZ0CQAClAwAhAwAAACIAIAEAAJsDADAqAACcAwAgAwAAACIAIAEAACMAMAIAACQAIA2RAgAAnwMAMJICAACcAwAQkwIAAJ8DADCUAgEAoAMAIZUCCAChAwAhlgIBAKIDACGXAgEAoAMAIZgCAQCgAwAhmQIBAKADACGaAiAAowMAIZsCQACkAwAhnAJAAKUDACGdAkAApQMAIQ4IAACnAwAgKwAAswMAICwAALMDACCeAgEAAAABnwIBAAAABKACAQAAAAShAgEAAAABogIBAAAAAaMCAQAAAAGkAgEAAAABpQIBALIDACGmAgEAAAABpwIBAAAAAagCAQAAAAENCAAApwMAICsAALEDACAsAACxAwAgXQAAsQMAIF4AALEDACCeAggAAAABnwIIAAAABKACCAAAAAShAggAAAABogIIAAAAAaMCCAAAAAGkAggAAAABpQIIALADACEOCAAAqgMAICsAAK8DACAsAACvAwAgngIBAAAAAZ8CAQAAAAWgAgEAAAAFoQIBAAAAAaICAQAAAAGjAgEAAAABpAIBAAAAAaUCAQCuAwAhpgIBAAAAAacCAQAAAAGoAgEAAAABBQgAAKcDACArAACtAwAgLAAArQMAIJ4CIAAAAAGlAiAArAMAIQsIAACqAwAgKwAAqwMAICwAAKsDACCeAkAAAAABnwJAAAAABaACQAAAAAWhAkAAAAABogJAAAAAAaMCQAAAAAGkAkAAAAABpQJAAKkDACELCAAApwMAICsAAKgDACAsAACoAwAgngJAAAAAAZ8CQAAAAASgAkAAAAAEoQJAAAAAAaICQAAAAAGjAkAAAAABpAJAAAAAAaUCQACmAwAhCwgAAKcDACArAACoAwAgLAAAqAMAIJ4CQAAAAAGfAkAAAAAEoAJAAAAABKECQAAAAAGiAkAAAAABowJAAAAAAaQCQAAAAAGlAkAApgMAIQieAgIAAAABnwICAAAABKACAgAAAAShAgIAAAABogICAAAAAaMCAgAAAAGkAgIAAAABpQICAKcDACEIngJAAAAAAZ8CQAAAAASgAkAAAAAEoQJAAAAAAaICQAAAAAGjAkAAAAABpAJAAAAAAaUCQACoAwAhCwgAAKoDACArAACrAwAgLAAAqwMAIJ4CQAAAAAGfAkAAAAAFoAJAAAAABaECQAAAA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-AgilAgAAxQO-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_AgAAJgAgwAIAACYAIMECAAAmACAMkQIAAOgDADCSAgAAcwAQkwIAAOgDADCUAgEAoAMAIZoCIACjAwAhmwJAAKQDACGcAkAApQMAIZ0CQAClAwAhuQIBAKADACHYAgEAoAMAIeICAQCgAwAh6QIBAKIDACEQAwAA4QMAIAkAAOoDACAKAADNAwAgGAAA6wMAIJECAADpAwAwkgIAAAkAEJMCAADpAwAwlAIBAMgDACGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIbkCAQDIAwAh2AIBAMgDACHiAgEAyAMAIekCAQDJAwAhA78CAAALACDAAgAACwAgwQIAAAsAIAO_AgAANwAgwAIAADcAIMECAAA3ACAVkQIAAOwDADCSAgAAWwAQkwIAAOwDADCUAgEAoAMAIZoCIACjAwAhmwJAAKQDACGcAkAApQMAIZ0CQAClAwAhrgIAAO8D9QIiuQIBAKADACHiAgEAoAMAIecCAQCiAwAh6gIBAKIDACHrAgEAogMAIewCAQCiAwAh7QIBAKADACHuAgEAogMAIfACAADtA_ACIvECIACjAwAh8wIAAO4D8wIi9QIgAKMDACEHCAAApwMAICsAAPUDACAsAAD1AwAgngIAAADwAgKfAgAAAPACCKACAAAA8AIIpQIAAPQD8AIiBwgAAKcDACArAADzAwAgLAAA8wMAIJ4CAAAA8wICnwIAAADzAgigAgAAAPMCCKUCAADyA_MCIgcIAACnAwAgKwAA8QMAICwAAPEDACCeAgAAAPUCAp8CAAAA9QIIoAIAAAD1AgilAgAA8AP1AiIHCAAApwMAICsAAPEDACAsAADxAwAgngIAAAD1AgKfAgAAAPUCCKACAAAA9QIIpQIAAPAD9QIiBJ4CAAAA9QICnwIAAAD1AgigAgAAAPUCCKUCAADxA_UCIgcIAACnAwAgKwAA8wMAICwAAPMDACCeAgAAAPMCAp8CAAAA8wIIoAIAAADzAgilAgAA8gPzAiIEngIAAADzAgKfAgAAAPMCCKACAAAA8wIIpQIAAPMD8wIiBwgAAKcDACArAAD1AwAgLAAA9QMAIJ4CAAAA8AICnwIAAADwAgigAgAAAPACCKUCAAD0A_ACIgSeAgAAAPACAp8CAAAA8AIIoAIAAADwAgilAgAA9QPwAiIQFAAA9wMAIBYAAPgDACCRAgAA9gMAMJICAAA7ABCTAgAA9gMAMJQCAQDIAwAhmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACHCAgEAyAMAIcMCAQDIAwAhxAIBAMkDACHFAgEAyQMAIcYCAQDIAwAhxwIBAMgDACERBQAA_AMAIBcAAPsDACCRAgAA-QMAMJICAAA3ABCTAgAA-QMAMJQCAQDIAwAhmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACGuAgAA-gPiAiK4AgEAyAMAIbwCAQDJAwAh3wIBAMkDACHgAgEAyAMAIfYCAAA3ACD3AgAANwAgEwMAAOEDACAVAADiAwAgkQIAAN8DADCSAgAARQAQkwIAAN8DADCUAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhuQIBAMgDACHYAgEAyAMAIeICAQDIAwAh4wIBAMkDACHkAgEAyQMAIeUCAQDJAwAh5gIIAOADACH2AgAARQAg9wIAAEUAIA8FAAD8AwAgFwAA-wMAIJECAAD5AwAwkgIAADcAEJMCAAD5AwAwlAIBAMgDACGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIa4CAAD6A-ICIrgCAQDIAwAhvAIBAMkDACHfAgEAyQMAIeACAQDIAwAhBJ4CAAAA4gICnwIAAADiAgigAgAAAOICCKUCAADdA-ICIhIUAAD3AwAgFgAA-AMAIJECAAD2AwAwkgIAADsAEJMCAAD2AwAwlAIBAMgDACGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIcICAQDIAwAhwwIBAMgDACHEAgEAyQMAIcUCAQDJAwAhxgIBAMgDACHHAgEAyAMAIfYCAAA7ACD3AgAAOwAgEgMAAOEDACAJAADqAwAgCgAAzQMAIBgAAOsDACCRAgAA6QMAMJICAAAJABCTAgAA6QMAMJQCAQDIAwAhmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACG5AgEAyAMAIdgCAQDIAwAh4gIBAMgDACHpAgEAyQMAIfYCAAAJACD3AgAACQAgEQ0AAIIEACAPAACBBAAgkQIAAP0DADCSAgAAJgAQkwIAAP0DADCUAgEAyAMAIZcCAQDJAwAhmQIBAMgDACGcAkAAzAMAIZ0CQADMAwAhqQICAP4DACGqAgEAyAMAIawCAAD_A6wCIq4CAACABK4CIq8CAQDJAwAhsAIBAMkDACGxAkAAywMAIQieAgIAAAABnwICAAAABKACAgAAAAShAgIAAAABogICAAAAAaMCAgAAAAGkAgIAAAABpQICAKcDACEEngIAAACsAgKfAgAAAKwCCKACAAAArAIIpQIAALsDrAIiBJ4CAAAArgICnwIAAACuAgigAgAAAK4CCKUCAAC5A64CIhQNAACFBAAgEAAA5gMAIBIAAIkEACATAACKBAAgkQIAAIcEADCSAgAAHgAQkwIAAIcEADCUAgEAyAMAIZcCAQDIAwAhmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACGuAgAAiAS4AiK0AgEAyAMAIbUCAgD-AwAhtgIBAMgDACG4AgEAyAMAIfYCAAAeACD3AgAAHgAgFAMAAOEDACAMAADlAwAgEAAA5gMAIBEAAOcDACCRAgAA5AMAMJICAAAqABCTAgAA5AMAMJQCAQDIAwAhmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACG5AgEAyAMAIdgCAQDIAwAh4gIBAMgDACHjAgEAyQMAIecCAQDJAwAh6AIBAMkDACH2AgAAKgAg9wIAACoAIBANAACFBAAgDgAAhgQAIA8AAIEEACCRAgAAgwQAMJICAAAiABCTAgAAgwQAMJQCAQDIAwAhlQIIAIQEACGWAgEAyQMAIZcCAQDIAwAhmAIBAMgDACGZAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhCJ4CCAAAAAGfAggAAAAEoAIIAAAABKECCAAAAAGiAggAAAABowIIAAAAAaQCCAAAAAGlAggAsQMAIRQDAADhAwAgDAAA5QMAIBAAAOYDACARAADnAwAgkQIAAOQDADCSAgAAKgAQkwIAAOQDADCUAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhuQIBAMgDACHYAgEAyAMAIeICAQDIAwAh4wIBAMkDACHnAgEAyQMAIegCAQDJAwAh9gIAACoAIPcCAAAqACAXBQAA_AMAIAsAAI4EACAQAADmAwAgEgAAiQQAIJECAACMBAAwkgIAABQAEJMCAACMBAAwlAIBAMgDACGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIa4CAACNBL4CIrICCACEBAAhswICAP4DACG4AgEAyAMAIbkCAQDIAwAhugIBAMkDACG7AgEAyAMAIbwCAQDJAwAhvgIBAMgDACH2AgAAFAAg9wIAABQAIBINAACFBAAgEAAA5gMAIBIAAIkEACATAACKBAAgkQIAAIcEADCSAgAAHgAQkwIAAIcEADCUAgEAyAMAIZcCAQDIAwAhmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACGuAgAAiAS4AiK0AgEAyAMAIbUCAgD-AwAhtgIBAMgDACG4AgEAyAMAIQSeAgAAALgCAp8CAAAAuAIIoAIAAAC4AgilAgAAwQO4AiIDvwIAABoAIMACAAAaACDBAgAAGgAgEw0AAIIEACAPAACBBAAgkQIAAP0DADCSAgAAJgAQkwIAAP0DADCUAgEAyAMAIZcCAQDJAwAhmQIBAMgDACGcAkAAzAMAIZ0CQADMAwAhqQICAP4DACGqAgEAyAMAIawCAAD_A6wCIq4CAACABK4CIq8CAQDJAwAhsAIBAMkDACGxAkAAywMAIfYCAAAmACD3AgAAJgAgDg4AAIYEACAPAACBBAAgkQIAAIsEADCSAgAAGgAQkwIAAIsEADCUAgEAyAMAIZgCAQDIAwAhmQIBAMgDACGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIbICCACEBAAhswICAP4DACEVBQAA_AMAIAsAAI4EACAQAADmAwAgEgAAiQQAIJECAACMBAAwkgIAABQAEJMCAACMBAAwlAIBAMgDACGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIa4CAACNBL4CIrICCACEBAAhswICAP4DACG4AgEAyAMAIbkCAQDIAwAhugIBAMkDACG7AgEAyAMAIbwCAQDJAwAhvgIBAMgDACEEngIAAAC-AgKfAgAAAL4CCKACAAAAvgIIpQIAAMUDvgIiDgoAAM0DACCRAgAAxwMAMJICAACZAgAQkwIAAMcDADCUAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhuQIBAMgDACG6AgEAyQMAIbwCAQDJAwAh9gIAAJkCACD3AgAAmQIAIA8GAACRBAAgkQIAAI8EADCSAgAADwAQkwIAAI8EADCUAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhrgIAAJAEzAIiuQIBAMgDACHIAgEAyQMAIckCQADLAwAhygJAAMsDACHMAgEAyAMAIQSeAgAAAMwCAp8CAAAAzAIIoAIAAADMAgilAgAA0gPMAiIRBQAA_AMAIAcAAJMEACCRAgAAkgQAMJICAAALABCTAgAAkgQAMJQCAQDIAwAhmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACG4AgEAyAMAIc0CAQDIAwAhzgIBAMgDACHPAggA4AMAIdACAQDJAwAh9gIAAAsAIPcCAAALACAPBQAA_AMAIAcAAJMEACCRAgAAkgQAMJICAAALABCTAgAAkgQAMJQCAQDIAwAhmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACG4AgEAyAMAIc0CAQDIAwAhzgIBAMgDACHPAggA4AMAIdACAQDJAwAhA78CAAAPACDAAgAADwAgwQIAAA8AIBkEAACYBAAgBQAAmQQAIA0AAIIEACAWAACaBAAgkQIAAJQEADCSAgAABwAQkwIAAJQEADCUAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhrgIAAJcE9QIiuQIBAMgDACHiAgEAyAMAIecCAQDJAwAh6gIBAMkDACHrAgEAyQMAIewCAQDJAwAh7QIBAMgDACHuAgEAyQMAIfACAACVBPACIvECIADKAwAh8wIAAJYE8wIi9QIgAMoDACEEngIAAADwAgKfAgAAAPACCKACAAAA8AIIpQIAAPUD8AIiBJ4CAAAA8wICnwIAAADzAgigAgAAAPMCCKUCAADzA_MCIgSeAgAAAPUCAp8CAAAA9QIIoAIAAAD1AgilAgAA8QP1AiIDvwIAAAMAIMACAAADACDBAgAAAwAgEgMAAOEDACAJAADqAwAgCgAAzQMAIBgAAOsDACCRAgAA6QMAMJICAAAJABCTAgAA6QMAMJQCAQDIAwAhmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACG5AgEAyAMAIdgCAQDIAwAh4gIBAMgDACHpAgEAyQMAIfYCAAAJACD3AgAACQAgEwMAAOEDACAVAADiAwAgkQIAAN8DADCSAgAARQAQkwIAAN8DADCUAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhuQIBAMgDACHYAgEAyAMAIeICAQDIAwAh4wIBAMkDACHkAgEAyQMAIeUCAQDJAwAh5gIIAOADACH2AgAARQAg9wIAAEUAIBADAACdBAAgkQIAAJsEADCSAgAAAwAQkwIAAJsEADCUAgEAyAMAIZwCQADMAwAhnQJAAMwDACG6AgEAyQMAIdECAQDIAwAh0gIBAMgDACHTAgEAyQMAIdQCAACcBAAg1QIAAJwEACDWAgEAyQMAIdcCAQDJAwAh2AIBAMkDACEMngKAAAAAAaECgAAAAAGiAoAAAAABowKAAAAAAaQCgAAAAAGlAoAAAAAB2QIBAAAAAdoCAQAAAAHbAgEAAAAB3AKAAAAAAd0CgAAAAAHeAoAAAAABGwQAAJgEACAFAACZBAAgDQAAggQAIBYAAJoEACCRAgAAlAQAMJICAAAHABCTAgAAlAQAMJQCAQDIAwAhmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACGuAgAAlwT1AiK5AgEAyAMAIeICAQDIAwAh5wIBAMkDACHqAgEAyQMAIesCAQDJAwAh7AIBAMkDACHtAgEAyAMAIe4CAQDJAwAh8AIAAJUE8AIi8QIgAMoDACHzAgAAlgTzAiL1AiAAygMAIfYCAAAHACD3AgAABwAgAAAAAAAAAf4CAQAAAAEF_gIIAAAAAYEDCAAAAAGCAwgAAAABgwMIAAAAAYQDCAAAAAEB_gIBAAAAAQH-AiAAAAABAf4CQAAAAAEB_gJAAAAAAQUlAADjBwAgJgAA7AcAIPgCAADkBwAg-QIAAOsHACD8AgAAdgAgBSUAAOEHACAmAADpBwAg-AIAAOIHACD5AgAA6AcAIPwCAAAWACAFJQAA3wcAICYAAOYHACD4AgAA4AcAIPkCAADlBwAg_AIAACAAIAMlAADjBwAg-AIAAOQHACD8AgAAdgAgAyUAAOEHACD4AgAA4gcAIPwCAAAWACADJQAA3wcAIPgCAADgBwAg_AIAACAAIAAAAAAABf4CAgAAAAGBAwIAAAABggMCAAAAAYMDAgAAAAGEAwIAAAABAf4CAAAArAICAf4CAAAArgICBSUAANcHACAmAADdBwAg-AIAANgHACD5AgAA3AcAIPwCAAAgACAHJQAA1QcAICYAANoHACD4AgAA1gcAIPkCAADZBwAg-gIAACoAIPsCAAAqACD8AgAAdgAgAyUAANcHACD4AgAA2AcAIPwCAAAgACADJQAA1QcAIPgCAADWBwAg_AIAAHYAIAAAAAAABSUAAM0HACAmAADTBwAg-AIAAM4HACD5AgAA0gcAIPwCAAAgACAFJQAAywcAICYAANAHACD4AgAAzAcAIPkCAADPBwAg_AIAABYAIAMlAADNBwAg-AIAAM4HACD8AgAAIAAgAyUAAMsHACD4AgAAzAcAIPwCAAAWACAAAAAAAAH-AgAAALgCAgUlAADEBwAgJgAAyQcAIPgCAADFBwAg-QIAAMgHACD8AgAAdgAgCyUAAOAEADAmAADlBAAw-AIAAOEEADD5AgAA4gQAMPoCAADkBAAw-wIAAOQEADD8AgAA5AQAMP0CAADjBAAg_gIAAOQEADD_AgAA5gQAMIADAADnBAAwCyUAANQEADAmAADZBAAw-AIAANUEADD5AgAA1gQAMPoCAADYBAAw-wIAANgEADD8AgAA2AQAMP0CAADXBAAg_gIAANgEADD_AgAA2gQAMIADAADbBAAwByUAAM8EACAmAADSBAAg-AIAANAEACD5AgAA0QQAIPoCAAAmACD7AgAAJgAg_AIAACgAIAwNAAC7BAAglAIBAAAAAZcCAQAAAAGcAkAAAAABnQJAAAAAAakCAgAAAAGqAgEAAAABrAIAAACsAgKuAgAAAK4CAq8CAQAAAAGwAgEAAAABsQJAAAAAAQIAAAAoACAlAADPBAAgAwAAACYAICUAAM8EACAmAADTBAAgDgAAACYAIA0AALkEACAeAADTBAAglAIBAKQEACGXAgEApgQAIZwCQACpBAAhnQJAAKkEACGpAgIAtQQAIaoCAQCkBAAhrAIAALYErAIirgIAALcErgIirwIBAKYEACGwAgEApgQAIbECQACoBAAhDA0AALkEACCUAgEApAQAIZcCAQCmBAAhnAJAAKkEACGdAkAAqQQAIakCAgC1BAAhqgIBAKQEACGsAgAAtgSsAiKuAgAAtwSuAiKvAgEApgQAIbACAQCmBAAhsQJAAKgEACELDQAArQQAIA4AAK4EACCUAgEAAAABlQIIAAAAAZYCAQAAAAGXAgEAAAABmAIBAAAAAZoCIAAAAAGbAkAAAAABnAJAAAAAAZ0CQAAAAAECAAAAJAAgJQAA3wQAIAMAAAAkACAlAADfBAAgJgAA3gQAIAEeAADHBwAwEA0AAIUEACAOAACGBAAgDwAAgQQAIJECAACDBAAwkgIAACIAEJMCAACDBAAwlAIBAAAAAZUCCACEBAAhlgIBAMkDACGXAgEAyAMAIZgCAQDIAwAhmQIBAMgDACGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIQIAAAAkACAeAADeBAAgAgAAANwEACAeAADdBAAgDZECAADbBAAwkgIAANwEABCTAgAA2wQAMJQCAQDIAwAhlQIIAIQEACGWAgEAyQMAIZcCAQDIAwAhmAIBAMgDACGZAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhDZECAADbBAAwkgIAANwEABCTAgAA2wQAMJQCAQDIAwAhlQIIAIQEACGWAgEAyQMAIZcCAQDIAwAhmAIBAMgDACGZAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhCZQCAQCkBAAhlQIIAKUEACGWAgEApgQAIZcCAQCkBAAhmAIBAKQEACGaAiAApwQAIZsCQACoBAAhnAJAAKkEACGdAkAAqQQAIQsNAACqBAAgDgAAqwQAIJQCAQCkBAAhlQIIAKUEACGWAgEApgQAIZcCAQCkBAAhmAIBAKQEACGaAiAApwQAIZsCQACoBAAhnAJAAKkEACGdAkAAqQQAIQsNAACtBAAgDgAArgQAIJQCAQAAAAGVAggAAAABlgIBAAAAAZcCAQAAAAGYAgEAAAABmgIgAAAAAZsCQAAAAAGcAkAAAAABnQJAAAAAAQkOAADEBAAglAIBAAAAAZgCAQAAAAGaAiAAAAABmwJAAAAAAZwCQAAAAAGdAkAAAAABsgIIAAAAAbMCAgAAAAECAAAAHAAgJQAA6wQAIAMAAAAcACAlAADrBAAgJgAA6gQAIAEeAADGBwAwDg4AAIYEACAPAACBBAAgkQIAAIsEADCSAgAAGgAQkwIAAIsEADCUAgEAAAABmAIBAMgDACGZAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhsgIIAIQEACGzAgIA_gMAIQIAAAAcACAeAADqBAAgAgAAAOgEACAeAADpBAAgDJECAADnBAAwkgIAAOgEABCTAgAA5wQAMJQCAQDIAwAhmAIBAMgDACGZAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhsgIIAIQEACGzAgIA_gMAIQyRAgAA5wQAMJICAADoBAAQkwIAAOcEADCUAgEAyAMAIZgCAQDIAwAhmQIBAMgDACGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIbICCACEBAAhswICAP4DACEIlAIBAKQEACGYAgEApAQAIZoCIACnBAAhmwJAAKgEACGcAkAAqQQAIZ0CQACpBAAhsgIIAKUEACGzAgIAtQQAIQkOAADCBAAglAIBAKQEACGYAgEApAQAIZoCIACnBAAhmwJAAKgEACGcAkAAqQQAIZ0CQACpBAAhsgIIAKUEACGzAgIAtQQAIQkOAADEBAAglAIBAAAAAZgCAQAAAAGaAiAAAAABmwJAAAAAAZwCQAAAAAGdAkAAAAABsgIIAAAAAbMCAgAAAAEDJQAAxAcAIPgCAADFBwAg_AIAAHYAIAQlAADgBAAw-AIAAOEEADD8AgAA5AQAMP0CAADjBAAgBCUAANQEADD4AgAA1QQAMPwCAADYBAAw_QIAANcEACADJQAAzwQAIPgCAADQBAAg_AIAACgAIAAAAAAAAf4CAAAAvgICBSUAALoHACAmAADCBwAg-AIAALsHACD5AgAAwQcAIPwCAACWAgAgBSUAALgHACAmAAC_BwAg-AIAALkHACD5AgAAvgcAIPwCAABeACALJQAAgwUAMCYAAIcFADD4AgAAhAUAMPkCAACFBQAw-gIAAOQEADD7AgAA5AQAMPwCAADkBAAw_QIAAIYFACD-AgAA5AQAMP8CAACIBQAwgAMAAOcEADALJQAA-gQAMCYAAP4EADD4AgAA-wQAMPkCAAD8BAAw-gIAANgEADD7AgAA2AQAMPwCAADYBAAw_QIAAP0EACD-AgAA2AQAMP8CAAD_BAAwgAMAANsEADALDQAArQQAIA8AAK8EACCUAgEAAAABlQIIAAAAAZYCAQAAAAGXAgEAAAABmQIBAAAAAZoCIAAAAAGbAkAAAAABnAJAAAAAAZ0CQAAAAAECAAAAJAAgJQAAggUAIAMAAAAkACAlAACCBQAgJgAAgQUAIAEeAAC9BwAwAgAAACQAIB4AAIEFACACAAAA3AQAIB4AAIAFACAJlAIBAKQEACGVAggApQQAIZYCAQCmBAAhlwIBAKQEACGZAgEApAQAIZoCIACnBAAhmwJAAKgEACGcAkAAqQQAIZ0CQACpBAAhCw0AAKoEACAPAACsBAAglAIBAKQEACGVAggApQQAIZYCAQCmBAAhlwIBAKQEACGZAgEApAQAIZoCIACnBAAhmwJAAKgEACGcAkAAqQQAIZ0CQACpBAAhCw0AAK0EACAPAACvBAAglAIBAAAAAZUCCAAAAAGWAgEAAAABlwIBAAAAAZkCAQAAAAGaAiAAAAABmwJAAAAAAZwCQAAAAAGdAkAAAAABCQ8AAMMEACCUAgEAAAABmQIBAAAAAZoCIAAAAAGbAkAAAAABnAJAAAAAAZ0CQAAAAAGyAggAAAABswICAAAAAQIAAAAcACAlAACLBQAgAwAAABwAICUAAIsFACAmAACKBQAgAR4AALwHADACAAAAHAAgHgAAigUAIAIAAADoBAAgHgAAiQUAIAiUAgEApAQAIZkCAQCkBAAhmgIgAKcEACGbAkAAqAQAIZwCQACpBAAhnQJAAKkEACGyAggApQQAIbMCAgC1BAAhCQ8AAMEEACCUAgEApAQAIZkCAQCkBAAhmgIgAKcEACGbAkAAqAQAIZwCQACpBAAhnQJAAKkEACGyAggApQQAIbMCAgC1BAAhCQ8AAMMEACCUAgEAAAABmQIBAAAAAZoCIAAAAAGbAkAAAAABnAJAAAAAAZ0CQAAAAAGyAggAAAABswICAAAAAQMlAAC6BwAg-AIAALsHACD8AgAAlgIAIAMlAAC4BwAg-AIAALkHACD8AgAAXgAgBCUAAIMFADD4AgAAhAUAMPwCAADkBAAw_QIAAIYFACAEJQAA-gQAMPgCAAD7BAAw_AIAANgEADD9AgAA_QQAIAAAAAslAACUBQAwJgAAmQUAMPgCAACVBQAw-QIAAJYFADD6AgAAmAUAMPsCAACYBQAw_AIAAJgFADD9AgAAlwUAIP4CAACYBQAw_wIAAJoFADCAAwAAmwUAMBAFAACNBQAgEAAAjwUAIBIAAI4FACCUAgEAAAABmgIgAAAAAZsCQAAAAAGcAkAAAAABnQJAAAAAAa4CAAAAvgICsgIIAAAAAbMCAgAAAAG4AgEAAAABuQIBAAAAAboCAQAAAAG7AgEAAAABvAIBAAAAAQIAAAAWACAlAACfBQAgAwAAABYAICUAAJ8FACAmAACeBQAgAR4AALcHADAVBQAA_AMAIAsAAI4EACAQAADmAwAgEgAAiQQAIJECAACMBAAwkgIAABQAEJMCAACMBAAwlAIBAAAAAZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhrgIAAI0EvgIisgIIAIQEACGzAgIA_gMAIbgCAQDIAwAhuQIBAMgDACG6AgEAyQMAIbsCAQDIAwAhvAIBAMkDACG-AgEAyAMAIQIAAAAWACAeAACeBQAgAgAAAJwFACAeAACdBQAgEZECAACbBQAwkgIAAJwFABCTAgAAmwUAMJQCAQDIAwAhmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACGuAgAAjQS-AiKyAggAhAQAIbMCAgD-AwAhuAIBAMgDACG5AgEAyAMAIboCAQDJAwAhuwIBAMgDACG8AgEAyQMAIb4CAQDIAwAhEZECAACbBQAwkgIAAJwFABCTAgAAmwUAMJQCAQDIAwAhmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACGuAgAAjQS-AiKyAggAhAQAIbMCAgD-AwAhuAIBAMgDACG5AgEAyAMAIboCAQDJAwAhuwIBAMgDACG8AgEAyQMAIb4CAQDIAwAhDZQCAQCkBAAhmgIgAKcEACGbAkAAqAQAIZwCQACpBAAhnQJAAKkEACGuAgAA9QS-AiKyAggApQQAIbMCAgC1BAAhuAIBAKQEACG5AgEApAQAIboCAQCmBAAhuwIBAKQEACG8AgEApgQAIRAFAAD3BAAgEAAA-QQAIBIAAPgEACCUAgEApAQAIZoCIACnBAAhmwJAAKgEACGcAkAAqQQAIZ0CQACpBAAhrgIAAPUEvgIisgIIAKUEACGzAgIAtQQAIbgCAQCkBAAhuQIBAKQEACG6AgEApgQAIbsCAQCkBAAhvAIBAKYEACEQBQAAjQUAIBAAAI8FACASAACOBQAglAIBAAAAAZoCIAAAAAGbAkAAAAABnAJAAAAAAZ0CQAAAAAGuAgAAAL4CArICCAAAAAGzAgIAAAABuAIBAAAAAbkCAQAAAAG6AgEAAAABuwIBAAAAAbwCAQAAAAEEJQAAlAUAMPgCAACVBQAw_AIAAJgFADD9AgAAlwUAIAAAAAAFJQAArwcAICYAALUHACD4AgAAsAcAIPkCAAC0BwAg_AIAADkAIAUlAACtBwAgJgAAsgcAIPgCAACuBwAg-QIAALEHACD8AgAAjgEAIAMlAACvBwAg-AIAALAHACD8AgAAOQAgAyUAAK0HACD4AgAArgcAIPwCAACOAQAgAAAAAf4CAAAAzAICBSUAAKgHACAmAACrBwAg-AIAAKkHACD5AgAAqgcAIPwCAAANACADJQAAqAcAIPgCAACpBwAg_AIAAA0AIAAAAAAABf4CCAAAAAGBAwgAAAABggMIAAAAAYMDCAAAAAGEAwgAAAABBSUAAKIHACAmAACmBwAg-AIAAKMHACD5AgAApQcAIPwCAABeACALJQAAtwUAMCYAALwFADD4AgAAuAUAMPkCAAC5BQAw-gIAALsFADD7AgAAuwUAMPwCAAC7BQAw_QIAALoFACD-AgAAuwUAMP8CAAC9BQAwgAMAAL4FADAKlAIBAAAAAZoCIAAAAAGbAkAAAAABnAJAAAAAAZ0CQAAAAAGuAgAAAMwCArkCAQAAAAHIAgEAAAAByQJAAAAAAcoCQAAAAAECAAAAEQAgJQAAwgUAIAMAAAARACAlAADCBQAgJgAAwQUAIAEeAACkBwAwDwYAAJEEACCRAgAAjwQAMJICAAAPABCTAgAAjwQAMJQCAQAAAAGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIa4CAACQBMwCIrkCAQDIAwAhyAIBAMkDACHJAkAAywMAIcoCQADLAwAhzAIBAMgDACECAAAAEQAgHgAAwQUAIAIAAAC_BQAgHgAAwAUAIA6RAgAAvgUAMJICAAC_BQAQkwIAAL4FADCUAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhrgIAAJAEzAIiuQIBAMgDACHIAgEAyQMAIckCQADLAwAhygJAAMsDACHMAgEAyAMAIQ6RAgAAvgUAMJICAAC_BQAQkwIAAL4FADCUAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhrgIAAJAEzAIiuQIBAMgDACHIAgEAyQMAIckCQADLAwAhygJAAMsDACHMAgEAyAMAIQqUAgEApAQAIZoCIACnBAAhmwJAAKgEACGcAkAAqQQAIZ0CQACpBAAhrgIAAKwFzAIiuQIBAKQEACHIAgEApgQAIckCQACoBAAhygJAAKgEACEKlAIBAKQEACGaAiAApwQAIZsCQACoBAAhnAJAAKkEACGdAkAAqQQAIa4CAACsBcwCIrkCAQCkBAAhyAIBAKYEACHJAkAAqAQAIcoCQACoBAAhCpQCAQAAAAGaAiAAAAABmwJAAAAAAZwCQAAAAAGdAkAAAAABrgIAAADMAgK5AgEAAAAByAIBAAAAAckCQAAAAAHKAkAAAAABAyUAAKIHACD4AgAAowcAIPwCAABeACAEJQAAtwUAMPgCAAC4BQAw_AIAALsFADD9AgAAugUAIAAAAAclAACdBwAgJgAAoAcAIPgCAACeBwAg-QIAAJ8HACD6AgAABwAg-wIAAAcAIPwCAAABACADJQAAnQcAIPgCAACeBwAg_AIAAAEAIAAAAAH-AgAAAOICAgclAADQBQAgJgAA0wUAIPgCAADRBQAg-QIAANIFACD6AgAAOwAg-wIAADsAIPwCAAA-ACAFJQAAmAcAICYAAJsHACD4AgAAmQcAIPkCAACaBwAg_AIAAF4AIAsWAACoBQAglAIBAAAAAZoCIAAAAAGbAkAAAAABnAJAAAAAAZ0CQAAAAAHCAgEAAAABwwIBAAAAAcQCAQAAAAHFAgEAAAABxwIBAAAAAQIAAAA-ACAlAADQBQAgAwAAADsAICUAANAFACAmAADUBQAgDQAAADsAIBYAAKYFACAeAADUBQAglAIBAKQEACGaAiAApwQAIZsCQACoBAAhnAJAAKkEACGdAkAAqQQAIcICAQCkBAAhwwIBAKQEACHEAgEApgQAIcUCAQCmBAAhxwIBAKQEACELFgAApgUAIJQCAQCkBAAhmgIgAKcEACGbAkAAqAQAIZwCQACpBAAhnQJAAKkEACHCAgEApAQAIcMCAQCkBAAhxAIBAKYEACHFAgEApgQAIccCAQCkBAAhAyUAANAFACD4AgAA0QUAIPwCAAA-ACADJQAAmAcAIPgCAACZBwAg_AIAAF4AIAAAAAAABSUAAJIHACAmAACWBwAg-AIAAJMHACD5AgAAlQcAIPwCAAABACALJQAA3gUAMCYAAOMFADD4AgAA3wUAMPkCAADgBQAw-gIAAOIFADD7AgAA4gUAMPwCAADiBQAw_QIAAOEFACD-AgAA4gUAMP8CAADkBQAwgAMAAOUFADALFAAApwUAIJQCAQAAAAGaAiAAAAABmwJAAAAAAZwCQAAAAAGdAkAAAAABwgIBAAAAAcMCAQAAAAHEAgEAAAABxQIBAAAAAcYCAQAAAAECAAAAPgAgJQAA6QUAIAMAAAA-ACAlAADpBQAgJgAA6AUAIAEeAACUBwAwEBQAAPcDACAWAAD4AwAgkQIAAPYDADCSAgAAOwAQkwIAAPYDADCUAgEAAAABmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACHCAgEAyAMAIcMCAQDIAwAhxAIBAMkDACHFAgEAyQMAIcYCAQAAAAHHAgEAyAMAIQIAAAA-ACAeAADoBQAgAgAAAOYFACAeAADnBQAgDpECAADlBQAwkgIAAOYFABCTAgAA5QUAMJQCAQDIAwAhmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACHCAgEAyAMAIcMCAQDIAwAhxAIBAMkDACHFAgEAyQMAIcYCAQDIAwAhxwIBAMgDACEOkQIAAOUFADCSAgAA5gUAEJMCAADlBQAwlAIBAMgDACGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIcICAQDIAwAhwwIBAMgDACHEAgEAyQMAIcUCAQDJAwAhxgIBAMgDACHHAgEAyAMAIQqUAgEApAQAIZoCIACnBAAhmwJAAKgEACGcAkAAqQQAIZ0CQACpBAAhwgIBAKQEACHDAgEApAQAIcQCAQCmBAAhxQIBAKYEACHGAgEApAQAIQsUAAClBQAglAIBAKQEACGaAiAApwQAIZsCQACoBAAhnAJAAKkEACGdAkAAqQQAIcICAQCkBAAhwwIBAKQEACHEAgEApgQAIcUCAQCmBAAhxgIBAKQEACELFAAApwUAIJQCAQAAAAGaAiAAAAABmwJAAAAAAZwCQAAAAAGdAkAAAAABwgIBAAAAAcMCAQAAAAHEAgEAAAABxQIBAAAAAcYCAQAAAAEDJQAAkgcAIPgCAACTBwAg_AIAAAEAIAQlAADeBQAw-AIAAN8FADD8AgAA4gUAMP0CAADhBQAgCgQAAPQGACAFAAD1BgAgDQAA9gYAIBYAAPcGACCbAgAAngQAIOcCAACeBAAg6gIAAJ4EACDrAgAAngQAIOwCAACeBAAg7gIAAJ4EACAAAAAABSUAAIoHACAmAACQBwAg-AIAAIsHACD5AgAAjwcAIPwCAAABACALJQAAigYAMCYAAI8GADD4AgAAiwYAMPkCAACMBgAw-gIAAI4GADD7AgAAjgYAMPwCAACOBgAw_QIAAI0GACD-AgAAjgYAMP8CAACQBgAwgAMAAJEGADALJQAAgQYAMCYAAIUGADD4AgAAggYAMPkCAACDBgAw-gIAANgEADD7AgAA2AQAMPwCAADYBAAw_QIAAIQGACD-AgAA2AQAMP8CAACGBgAwgAMAANsEADALJQAA9QUAMCYAAPoFADD4AgAA9gUAMPkCAAD3BQAw-gIAAPkFADD7AgAA-QUAMPwCAAD5BQAw_QIAAPgFACD-AgAA-QUAMP8CAAD7BQAwgAMAAPwFADAMDwAAugQAIJQCAQAAAAGZAgEAAAABnAJAAAAAAZ0CQAAAAAGpAgIAAAABqgIBAAAAAawCAAAArAICrgIAAACuAgKvAgEAAAABsAIBAAAAAbECQAAAAAECAAAAKAAgJQAAgAYAIAMAAAAoACAlAACABgAgJgAA_wUAIAEeAACOBwAwEQ0AAIIEACAPAACBBAAgkQIAAP0DADCSAgAAJgAQkwIAAP0DADCUAgEAAAABlwIBAMkDACGZAgEAAAABnAJAAMwDACGdAkAAzAMAIakCAgD-AwAhqgIBAMgDACGsAgAA_wOsAiKuAgAAgASuAiKvAgEAAAABsAIBAAAAAbECQADLAwAhAgAAACgAIB4AAP8FACACAAAA_QUAIB4AAP4FACAPkQIAAPwFADCSAgAA_QUAEJMCAAD8BQAwlAIBAMgDACGXAgEAyQMAIZkCAQDIAwAhnAJAAMwDACGdAkAAzAMAIakCAgD-AwAhqgIBAMgDACGsAgAA_wOsAiKuAgAAgASuAiKvAgEAyQMAIbACAQDJAwAhsQJAAMsDACEPkQIAAPwFADCSAgAA_QUAEJMCAAD8BQAwlAIBAMgDACGXAgEAyQMAIZkCAQDIAwAhnAJAAMwDACGdAkAAzAMAIakCAgD-AwAhqgIBAMgDACGsAgAA_wOsAiKuAgAAgASuAiKvAgEAyQMAIbACAQDJAwAhsQJAAMsDACELlAIBAKQEACGZAgEApAQAIZwCQACpBAAhnQJAAKkEACGpAgIAtQQAIaoCAQCkBAAhrAIAALYErAIirgIAALcErgIirwIBAKYEACGwAgEApgQAIbECQACoBAAhDA8AALgEACCUAgEApAQAIZkCAQCkBAAhnAJAAKkEACGdAkAAqQQAIakCAgC1BAAhqgIBAKQEACGsAgAAtgSsAiKuAgAAtwSuAiKvAgEApgQAIbACAQCmBAAhsQJAAKgEACEMDwAAugQAIJQCAQAAAAGZAgEAAAABnAJAAAAAAZ0CQAAAAAGpAgIAAAABqgIBAAAAAawCAAAArAICrgIAAACuAgKvAgEAAAABsAIBAAAAAbECQAAAAAELDgAArgQAIA8AAK8EACCUAgEAAAABlQIIAAAAAZYCAQAAAAGYAgEAAAABmQIBAAAAAZoCIAAAAAGbAkAAAAABnAJAAAAAAZ0CQAAAAAECAAAAJAAgJQAAiQYAIAMAAAAkACAlAACJBgAgJgAAiAYAIAEeAACNBwAwAgAAACQAIB4AAIgGACACAAAA3AQAIB4AAIcGACAJlAIBAKQEACGVAggApQQAIZYCAQCmBAAhmAIBAKQEACGZAgEApAQAIZoCIACnBAAhmwJAAKgEACGcAkAAqQQAIZ0CQACpBAAhCw4AAKsEACAPAACsBAAglAIBAKQEACGVAggApQQAIZYCAQCmBAAhmAIBAKQEACGZAgEApAQAIZoCIACnBAAhmwJAAKgEACGcAkAAqQQAIZ0CQACpBAAhCw4AAK4EACAPAACvBAAglAIBAAAAAZUCCAAAAAGWAgEAAAABmAIBAAAAAZkCAQAAAAGaAiAAAAABmwJAAAAAAZwCQAAAAAGdAkAAAAABDRAAAO4EACASAADtBAAgEwAA7wQAIJQCAQAAAAGaAiAAAAABmwJAAAAAAZwCQAAAAAGdAkAAAAABrgIAAAC4AgK0AgEAAAABtQICAAAAAbYCAQAAAAG4AgEAAAABAgAAACAAICUAAJUGACADAAAAIAAgJQAAlQYAICYAAJQGACABHgAAjAcAMBINAACFBAAgEAAA5gMAIBIAAIkEACATAACKBAAgkQIAAIcEADCSAgAAHgAQkwIAAIcEADCUAgEAAAABlwIBAMgDACGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIa4CAACIBLgCIrQCAQAAAAG1AgIA_gMAIbYCAQDIAwAhuAIBAMgDACECAAAAIAAgHgAAlAYAIAIAAACSBgAgHgAAkwYAIA6RAgAAkQYAMJICAACSBgAQkwIAAJEGADCUAgEAyAMAIZcCAQDIAwAhmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACGuAgAAiAS4AiK0AgEAyAMAIbUCAgD-AwAhtgIBAMgDACG4AgEAyAMAIQ6RAgAAkQYAMJICAACSBgAQkwIAAJEGADCUAgEAyAMAIZcCAQDIAwAhmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACGuAgAAiAS4AiK0AgEAyAMAIbUCAgD-AwAhtgIBAMgDACG4AgEAyAMAIQqUAgEApAQAIZoCIACnBAAhmwJAAKgEACGcAkAAqQQAIZ0CQACpBAAhrgIAAMoEuAIitAIBAKQEACG1AgIAtQQAIbYCAQCkBAAhuAIBAKQEACENEAAAzQQAIBIAAMwEACATAADOBAAglAIBAKQEACGaAiAApwQAIZsCQACoBAAhnAJAAKkEACGdAkAAqQQAIa4CAADKBLgCIrQCAQCkBAAhtQICALUEACG2AgEApAQAIbgCAQCkBAAhDRAAAO4EACASAADtBAAgEwAA7wQAIJQCAQAAAAGaAiAAAAABmwJAAAAAAZwCQAAAAAGdAkAAAAABrgIAAAC4AgK0AgEAAAABtQICAAAAAbYCAQAAAAG4AgEAAAABAyUAAIoHACD4AgAAiwcAIPwCAAABACAEJQAAigYAMPgCAACLBgAw_AIAAI4GADD9AgAAjQYAIAQlAACBBgAw-AIAAIIGADD8AgAA2AQAMP0CAACEBgAgBCUAAPUFADD4AgAA9gUAMPwCAAD5BQAw_QIAAPgFACAAAAAAAAAFJQAAggcAICYAAIgHACD4AgAAgwcAIPkCAACHBwAg_AIAAAEAIAslAAC5BgAwJgAAvgYAMPgCAAC6BgAw-QIAALsGADD6AgAAvQYAMPsCAAC9BgAw_AIAAL0GADD9AgAAvAYAIP4CAAC9BgAw_wIAAL8GADCAAwAAwAYAMAslAACwBgAwJgAAtAYAMPgCAACxBgAw-QIAALIGADD6AgAAmAUAMPsCAACYBQAw_AIAAJgFADD9AgAAswYAIP4CAACYBQAw_wIAALUGADCAAwAAmwUAMAslAACkBgAwJgAAqQYAMPgCAAClBgAw-QIAAKYGADD6AgAAqAYAMPsCAACoBgAw_AIAAKgGADD9AgAApwYAIP4CAACoBgAw_wIAAKoGADCAAwAAqwYAMAoXAADVBQAglAIBAAAAAZoCIAAAAAGbAkAAAAABnAJAAAAAAZ0CQAAAAAGuAgAAAOICArwCAQAAAAHfAgEAAAAB4AIBAAAAAQIAAAA5ACAlAACvBgAgAwAAADkAICUAAK8GACAmAACuBgAgAR4AAIYHADAPBQAA_AMAIBcAAPsDACCRAgAA-QMAMJICAAA3ABCTAgAA-QMAMJQCAQAAAAGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIa4CAAD6A-ICIrgCAQDIAwAhvAIBAMkDACHfAgEAyQMAIeACAQDIAwAhAgAAADkAIB4AAK4GACACAAAArAYAIB4AAK0GACANkQIAAKsGADCSAgAArAYAEJMCAACrBgAwlAIBAMgDACGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIa4CAAD6A-ICIrgCAQDIAwAhvAIBAMkDACHfAgEAyQMAIeACAQDIAwAhDZECAACrBgAwkgIAAKwGABCTAgAAqwYAMJQCAQDIAwAhmgIgAMoDACGbAkAAywMAIZwCQADMAwAhnQJAAMwDACGuAgAA-gPiAiK4AgEAyAMAIbwCAQDJAwAh3wIBAMkDACHgAgEAyAMAIQmUAgEApAQAIZoCIACnBAAhmwJAAKgEACGcAkAAqQQAIZ0CQACpBAAhrgIAAM0F4gIivAIBAKYEACHfAgEApgQAIeACAQCkBAAhChcAAM4FACCUAgEApAQAIZoCIACnBAAhmwJAAKgEACGcAkAAqQQAIZ0CQACpBAAhrgIAAM0F4gIivAIBAKYEACHfAgEApgQAIeACAQCkBAAhChcAANUFACCUAgEAAAABmgIgAAAAAZsCQAAAAAGcAkAAAAABnQJAAAAAAa4CAAAA4gICvAIBAAAAAd8CAQAAAAHgAgEAAAABEAsAAIwFACAQAACPBQAgEgAAjgUAIJQCAQAAAAGaAiAAAAABmwJAAAAAAZwCQAAAAAGdAkAAAAABrgIAAAC-AgKyAggAAAABswICAAAAAbkCAQAAAAG6AgEAAAABuwIBAAAAAbwCAQAAAAG-AgEAAAABAgAAABYAICUAALgGACADAAAAFgAgJQAAuAYAICYAALcGACABHgAAhQcAMAIAAAAWACAeAAC3BgAgAgAAAJwFACAeAAC2BgAgDZQCAQCkBAAhmgIgAKcEACGbAkAAqAQAIZwCQACpBAAhnQJAAKkEACGuAgAA9QS-AiKyAggApQQAIbMCAgC1BAAhuQIBAKQEACG6AgEApgQAIbsCAQCkBAAhvAIBAKYEACG-AgEApAQAIRALAAD2BAAgEAAA-QQAIBIAAPgEACCUAgEApAQAIZoCIACnBAAhmwJAAKgEACGcAkAAqQQAIZ0CQACpBAAhrgIAAPUEvgIisgIIAKUEACGzAgIAtQQAIbkCAQCkBAAhugIBAKYEACG7AgEApAQAIbwCAQCmBAAhvgIBAKQEACEQCwAAjAUAIBAAAI8FACASAACOBQAglAIBAAAAAZoCIAAAAAGbAkAAAAABnAJAAAAAAZ0CQAAAAAGuAgAAAL4CArICCAAAAAGzAgIAAAABuQIBAAAAAboCAQAAAAG7AgEAAAABvAIBAAAAAb4CAQAAAAEKBwAAxAUAIJQCAQAAAAGaAiAAAAABmwJAAAAAAZwCQAAAAAGdAkAAAAABzQIBAAAAAc4CAQAAAAHPAggAAAAB0AIBAAAAAQIAAAANACAlAADEBgAgAwAAAA0AICUAAMQGACAmAADDBgAgAR4AAIQHADAPBQAA_AMAIAcAAJMEACCRAgAAkgQAMJICAAALABCTAgAAkgQAMJQCAQAAAAGaAiAAygMAIZsCQADLAwAhnAJAAMwDACGdAkAAzAMAIbgCAQDIAwAhzQIBAMgDACHOAgEAyAMAIc8CCADgAwAh0AIBAMkDACECAAAADQAgHgAAwwYAIAIAAADBBgAgHgAAwgYAIA2RAgAAwAYAMJICAADBBgAQkwIAAMAGADCUAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhuAIBAMgDACHNAgEAyAMAIc4CAQDIAwAhzwIIAOADACHQAgEAyQMAIQ2RAgAAwAYAMJICAADBBgAQkwIAAMAGADCUAgEAyAMAIZoCIADKAwAhmwJAAMsDACGcAkAAzAMAIZ0CQADMAwAhuAIBAMgDACHNAgEAyAMAIc4CAQDIAwAhzwIIAOADACHQAgEAyQMAIQmUAgEApAQAIZoCIACnBAAhmwJAAKgEACGcAkAAqQQAIZ0CQACpBAAhzQIBAKQEACHOAgEApAQAIc8CCAC0BQAh0AIBAKYEACEKBwAAtgUAIJQCAQCkBAAhmgIgAKcEACGbAkAAqAQAIZwCQACpBAAhnQJAAKkEACHNAgEApAQAIc4CAQCkBAAhzwIIALQFACHQAgEApgQAIQoHAADEBQAglAIBAAAAAZoCIAAAAAGbAkAAAAABnAJAAAAAAZ0CQAAAAAHNAgEAAAABzgIBAAAAAc8CCAAAAAHQAgEAAAABAyUAAIIHACD4AgAAgwcAIPwCAAABACAEJQAAuQYAMPgCAAC6BgAw_AIAAL0GADD9AgAAvAYAIAQlAACwBgAw-AIAALEGADD8AgAAmAUAMP0CAACzBgAgBCUAAKQGADD4AgAApQYAMPwCAACoBgAw_QIAAKcGACAAAAAAAAH-AgAAAPACAgH-AgAAAPMCAgH-AgAAAPUCAgslAADkBgAwJgAA6QYAMPgCAADlBgAw-QIAAOYGADD6AgAA6AYAMPsCAADoBgAw_AIAAOgGADD9AgAA5wYAIP4CAADoBgAw_wIAAOoGADCAAwAA6wYAMAclAADfBgAgJgAA4gYAIPgCAADgBgAg-QIAAOEGACD6AgAACQAg-wIAAAkAIPwCAABeACAHJQAA2gYAICYAAN0GACD4AgAA2wYAIPkCAADcBgAg-gIAACoAIPsCAAAqACD8AgAAdgAgByUAANUGACAmAADYBgAg-AIAANYGACD5AgAA1wYAIPoCAABFACD7AgAARQAg_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_QIAAOcGACADJQAA3wYAIPgCAADgBgAg_AIAAF4AIAMlAADaBgAg-AIAANsGACD8AgAAdgAgAyUAANUGACD4AgAA1gYAIPwCAACOAQAgAAYDAADsBQAgCQAAyQYAIAoAAKEFACAYAADKBgAgmwIAAJ4EACDpAgAAngQAIAgDAADsBQAgDAAAmgYAIBAAAJsGACARAACcBgAgmwIAAJ4EACDjAgAAngQAIOcCAACeBAAg6AIAAJ4EACAHAwAA7AUAIBUAAO0FACCbAgAAngQAIOMCAACeBAAg5AIAAJ4EACDlAgAAngQAIOYCAACeBAAgBQUAAPUGACAXAAD5BgAgmwIAAJ4EACC8AgAAngQAIN8CAACeBAAgBRQAAPgGACAWAAD3BgAgmwIAAJ4EACDEAgAAngQAIMUCAACeBAAgBQ0AAPYGACAQAACbBgAgEgAA_AYAIBMAAP0GACCbAgAAngQAIAcFAAD1BgAgCwAA_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-dSY_dwxAeAxBegxCewxDfAxEfgxFgAEYRoEBJ0eDAQxIhQEYSYYBKEqHAQxLiAEMTIkBGE2MASlOjQEtT48BFFCQARRRkgEUUpMBFFOUARRUlgEUVZgBGFaZAS5XmwEUWJ0BGFmeAS9anwEUW6ABFFyhARhfpAEwYKUBNmGmARJipwESY6gBEmSpARJlqgESZqwBEmeuARhorwE3abEBEmqzARhrtAE4bLUBEm22ARJutwEYb7oBOXC7AT1xvAECcr0BAnO-AQJ0vwECdcABAnbCAQJ3xAEYeMUBPnnIAQJ6ygEYe8sBP3zNAQJ9zgECfs8BGH_SAUCAAdMBRIEB1AEEggHVAQSDAdYBBIQB1wEEhQHYAQSGAdoBBIcB3AEYiAHdAUWJAd8BBIoB4QEYiwHiAUaMAeMBBI0B5AEEjgHlARiPAegBR5AB6QFNkQHqAQWSAesBBZMB7AEFlAHtAQWVAe4BBZYB8AEFlwHyARiYAfMBTpkB9QEFmgH3ARibAfgBT5wB-QEFnQH6AQWeAfsBGJ8B_gFQoAH_AVShAYACE6IBgQITowGCAhOkAYMCE6UBhAITpgGGAhOnAYgCGKgBiQJVqQGLAhOqAY0CGKsBjgJWrAGPAhOtAZACE64BkQIYrwGUAlewAZUCW7EBlwIIsgGYAgizAZsCCLQBnAIItQGdAgi2AZ8CCLcBoQIYuAGiAly5AaQCCLoBpgIYuwGnAl28AagCCL0BqQIIvgGqAhi_Aa0CXsABrgJiwQGvAgfCAbACB8MBsQIHxAGyAgfFAbMCB8YBtQIHxwG3AhjIAbgCY8kBugIHygG8AhjLAb0CZMwBvgIHzQG_AgfOAcACGM8BwwJl0AHEAmvRAcUCC9IBxgIL0wHHAgvUAcgCC9UByQIL1gHLAgvXAc0CGNgBzgJs2QHQAgvaAdICGNsB0wJt3AHUAgvdAdUCC94B1gIY3wHZAm7gAdoCdOEB2wIK4gHcAgrjAd0CCuQB3gIK5QHfAgrmAeECCucB4wIY6AHkAnXpAeYCCuoB6AIY6wHpAnbsAeoCCu0B6wIK7gHsAhjvAe8Cd_AB8AJ98QHxAg7yAfICDvMB8wIO9AH0Ag71AfUCDvYB9wIO9wH5Ahj4AfoCfvkB_QIO-gH_Ahj7AYADf_wBggMO_QGDAw7-AYQDGP8BhwOAAYACiAOGAYECiQMNggKKAw2DAosDDYQCjAMNhQKNAw2GAo8DDYcCkQMYiAKSA4cBiQKUAw2KApYDGIsClwOIAYwCmAMNjQKZAw2OApoDGI8CnQOJAZACngOPAQ"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  AuditLogScalarFieldEnum: () => AuditLogScalarFieldEnum,
  BuyerScalarFieldEnum: () => BuyerScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  ConsultationScalarFieldEnum: () => ConsultationScalarFieldEnum,
  CropScalarFieldEnum: () => CropScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  ExpertAdviceScalarFieldEnum: () => ExpertAdviceScalarFieldEnum,
  ExpertScalarFieldEnum: () => ExpertScalarFieldEnum,
  FarmScalarFieldEnum: () => FarmScalarFieldEnum,
  FarmerScalarFieldEnum: () => FarmerScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PaymentScalarFieldEnum: () => PaymentScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProductScalarFieldEnum: () => ProductScalarFieldEnum,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.8.0",
  engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Farmer: "Farmer",
  Buyer: "Buyer",
  Expert: "Expert",
  Consultation: "Consultation",
  AuditLog: "AuditLog",
  Farm: "Farm",
  Crop: "Crop",
  ExpertAdvice: "ExpertAdvice",
  Category: "Category",
  Product: "Product",
  Order: "Order",
  OrderItem: "OrderItem",
  Payment: "Payment",
  Review: "Review"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  phone: "phone",
  address: "address",
  imageUrl: "imageUrl",
  imagePublicId: "imagePublicId",
  googleId: "googleId",
  authProvider: "authProvider",
  emailVerified: "emailVerified",
  role: "role",
  status: "status",
  needPasswordChange: "needPasswordChange",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var FarmerScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  certification: "certification",
  userId: "userId",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BuyerScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  address: "address",
  city: "city",
  country: "country",
  userId: "userId",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ExpertScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  city: "city",
  specialization: "specialization",
  qualification: "qualification",
  experience: "experience",
  userId: "userId",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ConsultationScalarFieldEnum = {
  id: "id",
  cropName: "cropName",
  problem: "problem",
  image: "image",
  status: "status",
  farmerId: "farmerId",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AuditLogScalarFieldEnum = {
  id: "id",
  action: "action",
  resource: "resource",
  resourceId: "resourceId",
  description: "description",
  oldValue: "oldValue",
  newValue: "newValue",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  userId: "userId"
};
var FarmScalarFieldEnum = {
  id: "id",
  farmName: "farmName",
  location: "location",
  landSize: "landSize",
  soilType: "soilType",
  farmerId: "farmerId",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CropScalarFieldEnum = {
  id: "id",
  name: "name",
  variety: "variety",
  plantingDate: "plantingDate",
  harvestDate: "harvestDate",
  status: "status",
  farmId: "farmId",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ExpertAdviceScalarFieldEnum = {
  id: "id",
  diagnosis: "diagnosis",
  recommendation: "recommendation",
  fertilizer: "fertilizer",
  pesticide: "pesticide",
  consultationId: "consultationId",
  expertId: "expertId",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  image: "image",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProductScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  price: "price",
  quantity: "quantity",
  unit: "unit",
  image: "image",
  status: "status",
  farmerId: "farmerId",
  categoryId: "categoryId",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderScalarFieldEnum = {
  id: "id",
  orderNumber: "orderNumber",
  totalAmount: "totalAmount",
  deliveryAddress: "deliveryAddress",
  status: "status",
  buyerId: "buyerId",
  farmerId: "farmerId",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  quantity: "quantity",
  price: "price",
  orderId: "orderId",
  productId: "productId",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var PaymentScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  amount: "amount",
  currency: "currency",
  provider: "provider",
  status: "status",
  stripeSessionId: "stripeSessionId",
  stripePaymentIntentId: "stripePaymentIntentId",
  paidAt: "paidAt",
  buyerId: "buyerId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  rating: "rating",
  comment: "comment",
  buyerId: "buyerId",
  productId: "productId",
  orderId: "orderId",
  isDeleted: "isDeleted",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/enums.ts
var Role = {
  FARMER: "FARMER",
  BUYER: "BUYER",
  EXPERT: "EXPERT",
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var AuthProvider = {
  GOOGLE: "GOOGLE",
  CREDENTIAL: "CREDENTIAL"
};
var CropStatus = {
  PLANNED: "PLANNED",
  GROWING: "GROWING",
  HARVESTED: "HARVESTED"
};
var ProductStatus = {
  ACTIVE: "ACTIVE",
  SOLD_OUT: "SOLD_OUT",
  INACTIVE: "INACTIVE"
};
var OrderStatus = {
  PENDING: "PENDING",
  PAYMENT_PENDING: "PAYMENT_PENDING",
  PAID: "PAID",
  PROCESSING: "PROCESSING",
  SHIPPED: "SHIPPED",
  COMPLETED: "COMPLETED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
  CONFIRMED: "CONFIRMED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  CANCELLED: "CANCELLED"
};

// generated/prisma/client.ts
globalThis["__dirname"] = path2.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/middlewares/global-error.ts
var globalErrorHandler = (err, req, res, next) => {
  console.log("Error : ", err);
  let statusCode;
  let errorMessage = err.message || "Internal Server Error";
  let errorName = err.name || "Internal Server Error";
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = httpStatus2.BAD_REQUEST;
    errorMessage = "You have provided incorrect field type or missing fields";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = httpStatus2.BAD_REQUEST, errorMessage = "Duplicate Key Error";
    } else if (err.code === "P2003") {
      statusCode = httpStatus2.BAD_REQUEST, errorMessage = "Foreign key constraint failed";
    } else if (err.code === "P2025") {
      statusCode = httpStatus2.BAD_REQUEST, errorMessage = "An operation failed because it depends on one or more records that were required but not found.";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = httpStatus2.UNAUTHORIZED;
      errorMessage = "Authentication failed against database server. Please Check Your Credentials";
    } else if (err.errorCode === "P1001") {
      statusCode = httpStatus2.BAD_REQUEST;
      errorMessage = "Can't reach database server";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = httpStatus2.INTERNAL_SERVER_ERROR;
    errorMessage = "Error occurred during query execution";
  }
  res.status(httpStatus2.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: statusCode || httpStatus2.INTERNAL_SERVER_ERROR,
    name: errorName,
    message: errorMessage,
    error: err.stack
  });
};

// src/module/auth/auth.route.ts
import { Router } from "express";

// src/lib/prisma.ts
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/utils/catch-async.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, expiresIn) => {
  const token = jwt.sign(
    payload,
    secret,
    {
      expiresIn
    }
  );
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken
    };
  } catch (error) {
    console.log("Token verification failed:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
var jwtUtils = {
  createToken,
  verifyToken
};

// src/middlewares/checkAuth.ts
var auth = (...requiredRoles) => {
  return catchAsync(
    async (req, res, next) => {
      const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization;
      if (!token) {
        throw new Error("You are not logged in. Please log in to access this resource.");
      }
      const verifiedToken = jwtUtils.verifyToken(token, config_default.jwt_access_secret);
      if (!verifiedToken.success) {
        throw new Error(verifiedToken.error);
      }
      const { email, name, userId, role } = verifiedToken.data;
      if (requiredRoles.length && !requiredRoles.includes(role)) {
        throw new Error("Forbidden. You don't have permission to access this resource.");
      }
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
          email,
          name,
          role
        }
      });
      if (!user) {
        throw new Error("User not found. Please log in again.");
      }
      if (user.status === "BLOCKED") {
        throw new Error("Your account has been blocked. Please contact support.");
      }
      req.user = {
        email,
        name,
        userId,
        role
      };
      next();
    }
  );
};

// src/module/auth/auth.controller.ts
import httpStatus3 from "http-status";

// src/utils/send-response.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    meta: data.meta,
    data: data.data
  });
};

// src/module/auth/auth.service.ts
import bcrypt from "bcryptjs";

// src/lib/googleAuth.ts
import { OAuth2Client } from "google-auth-library";
var googleClient = new OAuth2Client({
  client_id: config_default.google_client_id
});

// src/module/auth/auth.service.ts
var registerUser = async (payload) => {
  if (payload.role !== Role.FARMER && payload.role !== Role.BUYER) {
    throw new Error("Invalid Role. Only FARMER or BUYER can register.");
  }
  const email = payload.email.trim().toLowerCase();
  const isEmailExists = await prisma.user.findUnique({
    where: { email }
  });
  if (isEmailExists) {
    throw new Error("Email is already registered. Please login.");
  }
  if (!payload.password) {
    throw new Error("Password is required for manual registration");
  }
  const hashedPassword = await bcrypt.hash(payload.password, 8);
  const newUser = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      phone: payload.phone,
      address: payload.address,
      role: payload.role,
      authProvider: AuthProvider.CREDENTIAL,
      emailVerified: false,
      ...payload.role === Role.FARMER ? {
        farmer: {
          create: {
            name: payload.name,
            email
          }
        }
      } : {
        buyer: {
          create: {
            name: payload.name,
            email,
            address: payload.address,
            city: payload.city,
            country: payload.country
          }
        }
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true
    }
  });
  if (!newUser) {
    throw new Error("Failed to create user");
  }
  const jwtPayload = {
    userId: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    user: newUser,
    accessToken,
    refreshToken: refreshToken3
  };
};
var loginUser = async (payload) => {
  const { password } = payload;
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new Error("User is blocked");
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new Error("User is deleted");
  }
  if (user.password === null && user.googleId !== null) {
    throw new Error(
      "User Already Has Account Registered With Google. Try To Login With Google."
    );
  }
  const isPasswordMatched = await bcrypt.compare(
    password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new Error("Invalid credentials");
  }
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var getMe = async (user) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.userId
    },
    include: {
      farmer: true,
      buyer: true
    },
    omit: {
      password: true
    }
  });
  if (!isUserExists) {
    throw new Error("User not found");
  }
  return isUserExists;
};
var refreshToken = async (token) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(token, config_default.jwt_refresh_secret);
  if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
    throw new Error(config_default.node_env === "development" ? verifiedRefreshToken.error : "Invalid refresh token");
  }
  const data = verifiedRefreshToken.data;
  const user = await prisma.user.findUnique({
    where: { id: data.userId }
  });
  if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
    throw new Error("User is inactive or not found");
  }
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var googleLogin = async (payload) => {
  if (payload.role !== Role.FARMER && payload.role !== Role.BUYER) {
    throw new Error("Invalid Role for Google Authentication");
  }
  let googleIdTokenPayload = null;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: payload.idToken,
      audience: config_default.google_client_id
    });
    googleIdTokenPayload = ticket.getPayload();
  } catch (error) {
    console.log("Google ID Token Verification Failed", error);
    throw new Error("Invalid Or Expired Google ID Token");
  }
  if (!googleIdTokenPayload) {
    throw new Error("Invalid Or Expired Google ID Token");
  }
  if (!googleIdTokenPayload.email) {
    throw new Error("Google Email Not Found");
  }
  if (!googleIdTokenPayload.name) {
    throw new Error("Google User Name Not Found");
  }
  if (!googleIdTokenPayload.sub) {
    throw new Error("Google User ID Not Found");
  }
  const existingGoogleUser = await prisma.user.findFirst({
    where: {
      email: googleIdTokenPayload.email,
      role: payload.role,
      googleId: googleIdTokenPayload.sub
    }
  });
  let user = existingGoogleUser;
  if (!existingGoogleUser) {
    const existingCredentialUser = await prisma.user.findFirst({
      where: {
        email: googleIdTokenPayload.email,
        role: payload.role,
        authProvider: AuthProvider.CREDENTIAL
      }
    });
    if (existingCredentialUser) {
      if (!existingCredentialUser.emailVerified) {
        throw new Error("Email Not Verified");
      }
      if (existingCredentialUser.status === UserStatus.BLOCKED) {
        throw new Error("User Is Blocked");
      }
      if (existingCredentialUser.isDeleted || existingCredentialUser.status === UserStatus.DELETED) {
        throw new Error("User Is Deleted");
      }
      user = await prisma.user.update({
        where: {
          id: existingCredentialUser.id
        },
        data: {
          googleId: googleIdTokenPayload.sub
        }
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: googleIdTokenPayload.name,
          email: googleIdTokenPayload.email,
          role: payload.role,
          googleId: googleIdTokenPayload.sub,
          authProvider: AuthProvider.GOOGLE,
          emailVerified: true,
          ...payload.role === Role.FARMER ? {
            farmer: {
              create: {
                name: googleIdTokenPayload.name,
                email: googleIdTokenPayload.email
              }
            }
          } : {
            buyer: {
              create: {
                name: googleIdTokenPayload.name,
                email: googleIdTokenPayload.email
              }
            }
          }
        }
      });
    }
  }
  if (!user) {
    throw new Error("User Not Found");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new Error("User Is Blocked");
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new Error("User Is Deleted");
  }
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken3
  };
};
var AuthService = {
  registerUser,
  loginUser,
  getMe,
  refreshToken,
  googleLogin
};

// src/module/auth/auth.controller.ts
var registerUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.registerUser(payload);
  const { accessToken, refreshToken: refreshToken3, user } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 5
    //  3 day
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus3.CREATED,
    success: true,
    message: "User registered successfully",
    data: {
      user,
      accessToken,
      refreshToken: refreshToken3
    }
  });
});
var loginUser2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.loginUser(payload);
  const { accessToken, refreshToken: refreshToken3 } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 5
    //  5 day
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      refreshToken: refreshToken3
    }
  });
});
var getMe2 = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new Error("User information is missing in the request");
  }
  const result = await AuthService.getMe(user);
  sendResponse(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "User profile fetched successfully",
    data: result
  });
});
var refreshToken2 = catchAsync(async (req, res) => {
  if (!req.cookies.refreshToken) {
    throw new Error("Refresh token is missing");
  }
  const result = await AuthService.refreshToken(req.cookies.refreshToken);
  const { accessToken, refreshToken: newRefreshToken } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 5
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken
    }
  });
});
var googleLogin2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.googleLogin(payload);
  const { accessToken, refreshToken: refreshToken3 } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 5
    //  5 day
  });
  res.cookie("refreshToken", refreshToken3, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: httpStatus3.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: refreshToken3
    }
  });
});
var AuthController = {
  registerUser: registerUser2,
  loginUser: loginUser2,
  getMe: getMe2,
  refreshToken: refreshToken2,
  googleLogin: googleLogin2
};

// src/middlewares/validateRequest.ts
var validateRequest = (zodSchema) => {
  return catchAsync(
    async (req, res, next) => {
      const payload = {
        body: req.body,
        params: req.params,
        query: req.query
      };
      const result = zodSchema.safeParse(payload);
      if (!result.success) {
        throw new Error(
          result.error.issues[0]?.message || "Validation failed"
        );
      }
      req.body = result.data.body;
      next();
    }
  );
};

// src/module/auth/auth.validation.ts
import { z } from "zod";
var ManualRegistrationZodSchema = z.object({
  body: z.object({
    name: z.string().trim().min(4, "Name must be at least 4 characters long").max(30, "Name cannot exceed 30 characters"),
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters long").regex(
      /[a-z]/,
      "Password must contain at least 1 lowercase letter"
    ).regex(
      /[A-Z]/,
      "Password must contain at least 1 uppercase letter"
    ).regex(
      /[0-9]/,
      "Password must contain at least 1 number"
    ).regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least 1 special character"
    ),
    phone: z.string().trim().optional(),
    address: z.string().trim().optional(),
    city: z.string().trim().optional(),
    country: z.string().trim().optional(),
    role: z.enum(
      [Role.FARMER, Role.BUYER],
      {
        message: "Role must be either FARMER or BUYER"
      }
    )
  })
});
var LoginZodSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email("Invalid email format"),
    password: z.string().min(1, "Password is required")
  })
});
var GoogleLoginZodSchema = z.object({
  body: z.object({
    idToken: z.string().min(1, "Google ID Token is required"),
    role: z.enum(
      [Role.FARMER, Role.BUYER],
      {
        message: "Role must be either FARMER or BUYER"
      }
    )
  })
});
var UserValidation = {
  ManualRegistrationZodSchema,
  LoginZodSchema,
  GoogleLoginZodSchema
};

// src/module/auth/auth.route.ts
var router = Router();
router.post(
  "/register",
  validateRequest(UserValidation.ManualRegistrationZodSchema),
  AuthController.registerUser
);
router.post(
  "/login",
  validateRequest(UserValidation.LoginZodSchema),
  AuthController.loginUser
);
router.get(
  "/me",
  auth(Role.ADMIN, Role.FARMER, Role.BUYER, Role.EXPERT, Role.SUPER_ADMIN),
  AuthController.getMe
);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/google", AuthController.googleLogin);
var AuthRoutes = router;

// src/module/category/category.route.ts
import { Router as Router2 } from "express";

// src/module/category/category.controller.ts
import httpStatus4 from "http-status";

// src/module/category/category.service.ts
var createCategory = async (payload) => {
  return prisma.category.create({
    data: payload
  });
};
var getAllCategories = async () => {
  const result = await prisma.category.findMany({
    where: {
      isDeleted: false
    },
    include: {
      _count: {
        select: {
          products: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var getSingleCategory = async (id) => {
  const result = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false
    }
  });
  return result;
};
var updateCategory = async (id, payload) => {
  const category = await prisma.category.findFirst({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!category) {
    throw new Error("Category not found");
  }
  const result = await prisma.category.update({
    where: {
      id
    },
    data: {
      name: payload.name,
      description: payload.description,
      image: payload.image
    }
  });
  return result;
};
var deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!category) {
    throw new Error("Category not found");
  }
  const result = await prisma.category.update({
    where: {
      id
    },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return result;
};
var categoryServices = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory
};

// src/module/category/category.controller.ts
var createCategory2 = catchAsync(async (req, res) => {
  const result = await categoryServices.createCategory(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.CREATED,
    message: "Category created successfully",
    data: result
  });
});
var getAllCategories2 = catchAsync(
  async (req, res) => {
    const result = await categoryServices.getAllCategories();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus4.CREATED,
      message: "Categories retrieved successfully",
      data: result
    });
  }
);
var getSingleCategory2 = catchAsync(async (req, res) => {
  const result = await categoryServices.getSingleCategory(
    req.params.id
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus4.OK,
    message: "Category Single successfully",
    data: result
  });
});
var updateCategory2 = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await categoryServices.updateCategory(
      id,
      payload
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Category updated successfully",
      data: result
    });
  }
);
var deleteCategory2 = catchAsync(async (req, res) => {
  const result = await categoryServices.deleteCategory(
    req.params.id
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category deleted successfully",
    data: result
  });
});
var categoryController = {
  createCategory: createCategory2,
  getAllCategories: getAllCategories2,
  getSingleCategory: getSingleCategory2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/module/category/category.validation.ts
import { z as z2 } from "zod";
var createCategoryValidation = z2.object({
  body: z2.object({
    name: z2.string().min(2, "Category name must be at least 2 characters").max(100, "Category name cannot exceed 100 characters"),
    description: z2.string().max(500, "Description cannot exceed 500 characters").optional(),
    image: z2.string().url("Image must be a valid URL").optional()
  })
});
var updateCategoryValidation = z2.object({
  params: z2.object({
    id: z2.string().uuid("Invalid category ID")
  }),
  body: z2.object({
    name: z2.string().min(2, "Category name must be at least 2 characters").max(100, "Category name cannot exceed 100 characters").optional(),
    description: z2.string().max(500, "Description cannot exceed 500 characters").optional(),
    image: z2.string().url("Image must be a valid URL").optional()
  })
});
var categoryIdValidation = z2.object({
  body: z2.object({}).optional(),
  params: z2.object({
    id: z2.string().uuid("Invalid category ID")
  })
});
var categoryValidation = {
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdValidation
};

// src/module/category/category.route.ts
var router2 = Router2();
router2.get(
  "/",
  categoryController.getAllCategories
);
router2.get(
  "/:id",
  categoryController.getSingleCategory
);
router2.post(
  "/",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(
    categoryValidation.createCategoryValidation
  ),
  categoryController.createCategory
);
router2.patch(
  "/:id",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(
    categoryValidation.updateCategoryValidation
  ),
  categoryController.updateCategory
);
router2.delete(
  "/:id",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  categoryController.deleteCategory
);
var CategoryRoutes = router2;

// src/module/product/product.route.ts
import { Router as Router3 } from "express";

// src/module/product/product.controller.ts
import httpStatus5 from "http-status";

// src/module/product/product.service.ts
var createProduct = async (payload) => {
  const { categoryId, farmerId } = payload;
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
      isDeleted: false
    }
  });
  if (!category) {
    throw new Error("Category not found");
  }
  const farmer = await prisma.farmer.findUnique({
    where: {
      id: farmerId
    }
  });
  if (!farmer) {
    throw new Error("Farmer not found");
  }
  const result = await prisma.product.create({
    data: payload,
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      },
      farmer: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  return result;
};
var getAllProducts = async (query) => {
  const {
    searchTerm,
    categoryId,
    farmerId,
    status,
    minPrice,
    maxPrice,
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const where = {
    isDeleted: false
  };
  if (searchTerm) {
    where.OR = [
      {
        name: {
          contains: searchTerm,
          mode: "insensitive"
        }
      },
      {
        description: {
          contains: searchTerm,
          mode: "insensitive"
        }
      }
    ];
  }
  if (categoryId) {
    where.categoryId = categoryId;
  }
  if (farmerId) {
    where.farmerId = farmerId;
  }
  if (status) {
    where.status = status;
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) {
      where.price.gte = Number(minPrice);
    }
    if (maxPrice) {
      where.price.lte = Number(maxPrice);
    }
  }
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        category: true,
        farmer: true,
        _count: {
          select: {
            reviews: true,
            orderItems: true
          }
        }
      }
    }),
    prisma.product.count({
      where
    })
  ]);
  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber)
    },
    data: products
  };
};
var getSingleProduct = async (id) => {
  const result = await prisma.product.findUnique({
    where: {
      id,
      isDeleted: false
    },
    include: {
      category: true,
      farmer: true,
      reviews: {
        include: {
          buyer: true
        }
      },
      _count: {
        select: {
          reviews: true,
          orderItems: true
        }
      }
    }
  });
  if (!result) {
    throw new Error("Product not found");
  }
  return result;
};
var updateProduct = async (id, payload) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!product) {
    throw new Error("Product not found");
  }
  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
        isDeleted: false
      }
    });
    if (!category) {
      throw new Error("Category not found");
    }
  }
  const result = await prisma.product.update({
    where: {
      id
    },
    data: {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      quantity: payload.quantity,
      unit: payload.unit,
      image: payload.image,
      categoryId: payload.categoryId,
      status: payload.status
    },
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      },
      farmer: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
  return result;
};
var deleteProduct = async (id) => {
  const product = await prisma.product.findFirst({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!product) {
    throw new Error("Product not found");
  }
  const result = await prisma.product.update({
    where: {
      id
    },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date(),
      status: ProductStatus.INACTIVE
    }
  });
  return result;
};
var getMyProducts = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const products = await prisma.product.findMany({
    where: {
      isDeleted: false,
      farmer: {
        userId
      }
    },
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      },
      _count: {
        select: {
          reviews: true,
          orderItems: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return products;
};
var getProductsByCategory = async (categoryId) => {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
      isDeleted: false
    }
  });
  if (!category) {
    throw new Error("Category not found");
  }
  const products = await prisma.product.findMany({
    where: {
      categoryId,
      status: "ACTIVE",
      isDeleted: false
    },
    include: {
      category: {
        select: {
          id: true,
          name: true
        }
      },
      farmer: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return products;
};
var updateProductStatus = async (id, status) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!product) {
    throw new Error("Product not found");
  }
  const result = await prisma.product.update({
    where: {
      id
    },
    data: {
      status
    }
  });
  return result;
};
var productService = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  getProductsByCategory,
  updateProductStatus
};

// src/module/product/product.controller.ts
var createProduct2 = catchAsync(
  async (req, res) => {
    const result = await productService.createProduct(
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.OK,
      message: "Product created successfully",
      data: result
    });
  }
);
var getAllProducts2 = catchAsync(
  async (req, res) => {
    const result = await productService.getAllProducts(req.query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.OK,
      message: "Products retrieved successfully",
      meta: result.meta,
      data: result.data
    });
  }
);
var getSingleProduct2 = catchAsync(
  async (req, res) => {
    const result = await productService.getSingleProduct(
      req.params.id
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.OK,
      message: "Product retrieved successfully",
      data: result
    });
  }
);
var updateProduct2 = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const result = await productService.updateProduct(
      id,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.OK,
      message: "Product updated successfully",
      data: result
    });
  }
);
var deleteProduct2 = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const result = await productService.deleteProduct(
      id
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.OK,
      message: "Product deleted successfully",
      data: result
    });
  }
);
var getMyProducts2 = catchAsync(
  async (req, res) => {
    const farmerId = req.user?.userId;
    const result = await productService.getMyProducts(
      farmerId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.OK,
      message: "Your products retrieved successfully",
      data: result
    });
  }
);
var getProductsByCategory2 = catchAsync(
  async (req, res) => {
    const categoryId = req.params.categoryId;
    const result = await productService.getProductsByCategory(
      categoryId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus5.OK,
      message: "Category products retrieved successfully",
      data: result
    });
  }
);
var updateProductStatus2 = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const result = await productService.updateProductStatus(
      id,
      status
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Product status updated successfully",
      data: result
    });
  }
);
var productController = {
  createProduct: createProduct2,
  getAllProducts: getAllProducts2,
  getSingleProduct: getSingleProduct2,
  updateProduct: updateProduct2,
  deleteProduct: deleteProduct2,
  getMyProducts: getMyProducts2,
  getProductsByCategory: getProductsByCategory2,
  updateProductStatus: updateProductStatus2
};

// src/module/product/product.validation.ts
import { z as z3 } from "zod";
var createProductValidation = z3.object({
  body: z3.object({
    name: z3.string().min(2, "Product name must be at least 2 characters").max(100, "Product name cannot exceed 100 characters"),
    description: z3.string().max(1e3, "Description cannot exceed 1000 characters").optional(),
    price: z3.number().int("Price must be an integer").positive("Price must be greater than 0"),
    quantity: z3.number().positive("Quantity must be greater than 0"),
    unit: z3.string().min(1, "Unit cannot be empty").default("KG"),
    image: z3.string().url("Image must be a valid URL").optional(),
    categoryId: z3.string().uuid("Invalid category ID"),
    farmerId: z3.string().uuid("Invalid farmer ID")
  })
});
var updateProductValidation = z3.object({
  body: z3.object({
    name: z3.string().min(2, "Product name must be at least 2 characters").max(100, "Product name cannot exceed 100 characters").optional(),
    description: z3.string().max(1e3, "Description cannot exceed 1000 characters").optional(),
    price: z3.number().int("Price must be an integer").positive("Price must be greater than 0").optional(),
    quantity: z3.number().positive("Quantity must be greater than 0").optional(),
    unit: z3.string().min(1, "Unit cannot be empty").optional(),
    image: z3.string().url("Image must be a valid URL").optional(),
    categoryId: z3.string().uuid("Invalid category ID").optional(),
    status: z3.nativeEnum(ProductStatus).optional()
  }),
  params: z3.object({
    id: z3.string().uuid("Invalid product ID")
  })
});
var updateProductStatusValidation = z3.object({
  body: z3.object({
    status: z3.enum(ProductStatus, {
      message: "Product status is required"
    })
  }),
  params: z3.object({
    id: z3.string().uuid("Invalid product ID")
  })
});
var productValidation = {
  createProductValidation,
  updateProductValidation,
  updateProductStatusValidation
};

// src/module/product/product.route.ts
var router3 = Router3();
router3.get("/", productController.getAllProducts);
router3.get(
  "/category/:categoryId",
  productController.getProductsByCategory
);
router3.get(
  "/:id",
  productController.getSingleProduct
);
router3.post(
  "/",
  auth(Role.FARMER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(productValidation.createProductValidation),
  productController.createProduct
);
router3.get(
  "/farmer/my-products",
  auth(Role.FARMER),
  productController.getMyProducts
);
router3.patch(
  "/:id",
  auth(Role.FARMER, Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(productValidation.updateProductValidation),
  productController.updateProduct
);
router3.delete(
  "/:id",
  auth(Role.FARMER, Role.ADMIN, Role.SUPER_ADMIN),
  productController.deleteProduct
);
router3.patch(
  "/:id/status",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(productValidation.updateProductStatusValidation),
  productController.updateProductStatus
);
var ProductRoutes = router3;

// src/module/admin/admin.route.ts
import { Router as Router4 } from "express";

// src/module/admin/ admin.controller.ts
import httpStatus6 from "http-status";

// src/module/admin/ admin.service.ts
var getDashboardStats = async () => {
  const [
    totalUsers,
    totalFarmers,
    totalBuyers,
    totalExperts,
    totalProducts,
    totalCategories,
    totalOrders
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        role: "FARMER"
      }
    }),
    prisma.user.count({
      where: {
        role: "BUYER"
      }
    }),
    prisma.user.count({
      where: {
        role: "EXPERT"
      }
    }),
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count()
  ]);
  return {
    totalUsers,
    totalFarmers,
    totalBuyers,
    totalExperts,
    totalProducts,
    totalCategories,
    totalOrders
  };
};
var getAllUsers = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      farmer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      buyer: {
        select: {
          id: true,
          name: true,
          email: true,
          city: true,
          address: true,
          country: true
        }
      }
    }
  });
  return users;
};
var getSingleUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      farmer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      buyer: {
        select: {
          id: true,
          name: true,
          email: true,
          city: true,
          address: true,
          country: true
        }
      }
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
var updateUserStatus = async (id, payload) => {
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  const result = await prisma.user.update({
    where: {
      id
    },
    data: {
      status: payload.status
      //isBanned: payload.status === "BLOCKED",
    },
    omit: {
      password: true
    }
  });
  return result;
};
var updateUserRole = async (id, payload) => {
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  const result = await prisma.user.update({
    where: {
      id
    },
    data: {
      role: payload.role
    },
    omit: {
      password: true
    }
  });
  return result;
};
var deleteUser = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  const result = await prisma.user.delete({
    where: {
      id
    },
    omit: {
      password: true
    }
  });
  return result;
};
var adminService = {
  getDashboardStats,
  getAllUsers,
  getSingleUser,
  updateUserStatus,
  updateUserRole,
  deleteUser
};

// src/module/admin/ admin.controller.ts
var getDashboardStats2 = catchAsync(
  async (req, res) => {
    const result = await adminService.getDashboardStats();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.CREATED,
      message: "Dashboard stats retrieved successfully",
      data: result
    });
  }
);
var getAllUsers2 = catchAsync(
  async (req, res) => {
    const result = await adminService.getAllUsers();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.CREATED,
      message: "Users retrieved successfully",
      data: result
    });
  }
);
var getSingleUser2 = catchAsync(
  async (req, res) => {
    const result = await adminService.getSingleUser(
      req.params.id
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.CREATED,
      message: "User retrieved successfully",
      data: result
    });
  }
);
var updateUserStatus2 = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await adminService.updateUserStatus(
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.CREATED,
      message: "User status updated successfully",
      data: result
    });
  }
);
var updateUserRole2 = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const payload = req.body.role;
    const result = await adminService.updateUserRole(
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.CREATED,
      message: "User role updated successfully",
      data: result
    });
  }
);
var deleteUser2 = catchAsync(
  async (req, res) => {
    const result = await adminService.deleteUser(
      req.params.id
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus6.CREATED,
      message: "User deleted successfully",
      data: result
    });
  }
);
var adminController = {
  getDashboardStats: getDashboardStats2,
  getAllUsers: getAllUsers2,
  getSingleUser: getSingleUser2,
  updateUserStatus: updateUserStatus2,
  updateUserRole: updateUserRole2,
  deleteUser: deleteUser2
};

// src/module/admin/admin.validation.ts
import { z as z4 } from "zod";
var updateUserStatusValidation = z4.object({
  params: z4.object({
    id: z4.string().uuid("Invalid user ID")
  }),
  body: z4.object({
    status: z4.enum(UserStatus)
  })
});
var updateUserRoleValidation = z4.object({
  params: z4.object({
    id: z4.string().uuid("Invalid user ID")
  }),
  body: z4.object({
    role: z4.enum(Role)
  })
});
var updateUserBanValidation = z4.object({
  params: z4.object({
    id: z4.string().uuid("Invalid user ID")
  }),
  body: z4.object({
    isBanned: z4.boolean()
  })
});
var updateProductStatusValidation3 = z4.object({
  params: z4.object({
    id: z4.string().uuid("Invalid product ID")
  }),
  body: z4.object({
    status: z4.enum(ProductStatus)
  })
});
var adminIdValidation = z4.object({
  params: z4.object({
    id: z4.string().uuid("Invalid ID")
  })
});
var adminValidation = {
  updateUserStatusValidation,
  updateUserRoleValidation,
  updateUserBanValidation,
  updateProductStatusValidation: updateProductStatusValidation3,
  adminIdValidation
};

// src/module/admin/admin.route.ts
var router4 = Router4();
router4.get(
  "/dashboard-stats",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.getDashboardStats
);
router4.get(
  "/users",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.getAllUsers
);
router4.get(
  "/users/:id",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  // validateRequest(
  //     adminValidation.adminIdValidation
  // ),
  adminController.getSingleUser
);
router4.patch(
  "/users/:id/status",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  validateRequest(
    adminValidation.updateUserStatusValidation
  ),
  adminController.updateUserStatus
);
router4.patch(
  "/users/:id/role",
  auth(Role.SUPER_ADMIN),
  validateRequest(
    adminValidation.updateUserRoleValidation
  ),
  adminController.updateUserRole
);
router4.delete(
  "/users/:id",
  auth(Role.SUPER_ADMIN),
  // validateRequest(
  //     adminValidation.adminIdValidation
  // ),
  adminController.deleteUser
);
var AdminRoutes = router4;

// src/module/farm/farm.route.ts
import { Router as Router5 } from "express";

// src/module/farm/farm.service.ts
var createFarm = async (userId, payload) => {
  const farmer = await prisma.farmer.findUnique({
    where: {
      userId
    }
  });
  if (!farmer) {
    throw new Error("Farmer not found");
  }
  const farm = await prisma.farm.create({
    data: {
      farmName: payload.farmName,
      location: payload.location,
      landSize: payload.landSize,
      soilType: payload.soilType,
      farmerId: farmer.id
    }
  });
  return farm;
};
var getAllFarms = async () => {
  const farms = await prisma.farm.findMany({
    where: {
      isDeleted: false
    },
    include: {
      farmer: true,
      crops: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return farms;
};
var getFarmById = async (id) => {
  const farm = await prisma.farm.findFirst({
    where: {
      id,
      isDeleted: false
    },
    include: {
      farmer: true,
      crops: true
    }
  });
  if (!farm) {
    throw new Error("Farm not found");
  }
  return farm;
};
var getFarmsByFarmer = async (farmerId) => {
  const farmer = await prisma.farmer.findUnique({
    where: {
      id: farmerId
    }
  });
  if (!farmer) {
    throw new Error("Farmer not found");
  }
  const farms = await prisma.farm.findMany({
    where: {
      farmerId,
      isDeleted: false
    },
    include: {
      crops: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return farms;
};
var updateFarm = async (id, farmerId, payload) => {
  const farm = await prisma.farm.findFirst({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!farm) {
    throw new Error("Farm not found");
  }
  if (farm.farmerId !== farmerId) {
    throw new Error(
      "You are not authorized to update this farm"
    );
  }
  const updatedFarm = await prisma.farm.update({
    where: {
      id
    },
    data: payload
  });
  return updatedFarm;
};
var deleteFarm = async (id, farmerId) => {
  const farm = await prisma.farm.findFirst({
    where: {
      id
    }
  });
  if (!farm) {
    throw new Error("Farm not found");
  }
  if (farm.farmerId !== farmerId) {
    throw new Error(
      "You are not authorized to delete this farm"
    );
  }
  const deletedFarm = await prisma.farm.delete({
    where: {
      id
    }
  });
  return deletedFarm;
};
var FarmService = {
  createFarm,
  getAllFarms,
  getFarmById,
  getFarmsByFarmer,
  updateFarm,
  deleteFarm
};

// src/module/farm/farm.controller.ts
var createFarm2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await FarmService.createFarm(
      user.userId,
      req.body
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Farm created successfully",
      data: result
    });
  }
);
var getAllFarms2 = catchAsync(
  async (req, res) => {
    const result = await FarmService.getAllFarms();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Farms retrieved successfully",
      data: result
    });
  }
);
var getFarmById2 = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const result = await FarmService.getFarmById(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Farm retrieved successfully",
      data: result
    });
  }
);
var getFarmsByFarmer2 = catchAsync(
  async (req, res) => {
    const { farmerId } = req.params;
    const result = await FarmService.getFarmsByFarmer(farmerId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Farmer farms retrieved successfully",
      data: result
    });
  }
);
var updateFarm2 = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    const result = await FarmService.updateFarm(
      id,
      user.userId,
      req.body
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Farm updated successfully",
      data: result
    });
  }
);
var deleteFarm2 = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const user = req.user;
    const result = await FarmService.deleteFarm(
      id,
      user.userId
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Farm deleted successfully",
      data: result
    });
  }
);
var FarmController = {
  createFarm: createFarm2,
  getAllFarms: getAllFarms2,
  getFarmById: getFarmById2,
  getFarmsByFarmer: getFarmsByFarmer2,
  updateFarm: updateFarm2,
  deleteFarm: deleteFarm2
};

// src/module/farm/farm.validation.ts
import { z as z5 } from "zod";
var createFarmValidation = z5.object({
  body: z5.object({
    farmName: z5.string().min(2, "Farm name must be at least 2 characters").max(100, "Farm name cannot exceed 100 characters"),
    location: z5.string().min(2, "Location is required").max(255, "Location cannot exceed 255 characters"),
    landSize: z5.number().positive("Land size must be greater than 0").optional(),
    soilType: z5.string().max(100, "Soil type cannot exceed 100 characters").optional()
  })
});
var updateFarmValidation = z5.object({
  body: z5.object({
    farmName: z5.string().min(2, "Farm name must be at least 2 characters").max(100, "Farm name cannot exceed 100 characters").optional(),
    location: z5.string().min(2, "Location must be at least 2 characters").max(255, "Location cannot exceed 255 characters").optional(),
    landSize: z5.number().positive("Land size must be greater than 0").optional(),
    soilType: z5.string().max(100, "Soil type cannot exceed 100 characters").optional()
  }),
  params: z5.object({
    id: z5.string().uuid("Invalid farm ID")
  })
});
var farmIdValidation = z5.object({
  params: z5.object({
    id: z5.string().uuid("Invalid farm ID")
  })
});
var farmerIdValidation = z5.object({
  params: z5.object({
    farmerId: z5.string().uuid("Invalid farmer ID")
  })
});

// src/module/farm/farm.route.ts
var router5 = Router5();
router5.get(
  "/",
  FarmController.getAllFarms
);
router5.get(
  "/farmer/:farmerId",
  FarmController.getFarmsByFarmer
);
router5.get(
  "/:id",
  FarmController.getFarmById
);
router5.post(
  "/",
  auth("FARMER"),
  validateRequest(createFarmValidation),
  FarmController.createFarm
);
router5.patch(
  "/:id",
  auth("FARMER"),
  validateRequest(updateFarmValidation),
  FarmController.updateFarm
);
router5.delete(
  "/:id",
  auth("FARMER"),
  FarmController.deleteFarm
);
var FarmRoutes = router5;

// src/module/crop/crop.route.ts
import { Router as Router6 } from "express";

// src/module/crop/crop.service.ts
var createCrop = async (userId, payload) => {
  const farm = await prisma.farm.findUnique({
    where: {
      id: payload.farmId,
      isDeleted: false
    }
  });
  if (!farm) {
    throw new Error("Farm not found");
  }
  const farmer = await prisma.farmer.findUnique({
    where: {
      userId
    }
  });
  if (!farmer) {
    throw new Error("Farmer profile not found");
  }
  if (farm.farmerId !== farmer.id) {
    throw new Error("You are not authorized to create crop for this farm");
  }
  const crop = await prisma.crop.create({
    data: {
      name: payload.name,
      variety: payload.variety,
      plantingDate: payload.plantingDate ? new Date(payload.plantingDate) : void 0,
      harvestDate: payload.harvestDate ? new Date(payload.harvestDate) : void 0,
      status: payload.status,
      farmId: payload.farmId
    },
    include: {
      farm: true
    }
  });
  return crop;
};
var getAllCrops = async () => {
  return prisma.crop.findMany({
    where: {
      isDeleted: false
    },
    include: {
      farm: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getCropsByFarm = async (farmId) => {
  const farm = await prisma.farm.findFirst({
    where: {
      id: farmId,
      isDeleted: false
    }
  });
  if (!farm) {
    throw new Error("Farm not found");
  }
  return prisma.crop.findMany({
    where: {
      farmId,
      isDeleted: false
    },
    include: {
      farm: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getCropById = async (id) => {
  const crop = await prisma.crop.findFirst({
    where: {
      id,
      isDeleted: false
    },
    include: {
      farm: true
    }
  });
  if (!crop) {
    throw new Error("Crop not found");
  }
  return crop;
};
var updateCrop = async (userId, id, payload) => {
  const crop = await prisma.crop.findFirst({
    where: {
      id,
      isDeleted: false
    },
    include: {
      farm: true
    }
  });
  if (!crop) {
    throw new Error("Crop not found");
  }
  const farmer = await prisma.farmer.findUnique({
    where: {
      userId
    }
  });
  if (!farmer) {
    throw new Error("Farmer profile not found");
  }
  if (crop.farm.farmerId !== farmer.id) {
    throw new Error("You are not authorized to update this crop");
  }
  if (payload.farmId) {
    const newFarm = await prisma.farm.findFirst({
      where: {
        id: payload.farmId,
        isDeleted: false
      }
    });
    if (!newFarm) {
      throw new Error("New farm not found");
    }
    if (newFarm.farmerId !== farmer.id) {
      throw new Error("You are not authorized to move crop to this farm");
    }
  }
  const updatedCrop = await prisma.crop.update({
    where: {
      id
    },
    data: {
      name: payload.name,
      variety: payload.variety,
      plantingDate: payload.plantingDate !== void 0 ? payload.plantingDate ? new Date(payload.plantingDate) : null : void 0,
      harvestDate: payload.harvestDate !== void 0 ? payload.harvestDate ? new Date(payload.harvestDate) : null : void 0,
      status: payload.status,
      farmId: payload.farmId
    },
    include: {
      farm: true
    }
  });
  return updatedCrop;
};
var updateCropStatus = async (userId, id, status) => {
  const crop = await prisma.crop.findFirst({
    where: {
      id,
      isDeleted: false
    },
    include: {
      farm: true
    }
  });
  if (!crop) {
    throw new Error("Crop not found");
  }
  const farmer = await prisma.farmer.findUnique({
    where: {
      userId
    }
  });
  if (!farmer) {
    throw new Error("Farmer profile not found");
  }
  if (crop.farm.farmerId !== farmer.id) {
    throw new Error("You are not authorized to update this crop");
  }
  return prisma.crop.update({
    where: {
      id
    },
    data: {
      status
    },
    include: {
      farm: true
    }
  });
};
var deleteCrop = async (userId, id) => {
  const crop = await prisma.crop.findFirst({
    where: {
      id,
      isDeleted: false
    },
    include: {
      farm: true
    }
  });
  if (!crop) {
    throw new Error("Crop not found");
  }
  const farmer = await prisma.farmer.findUnique({
    where: {
      userId
    }
  });
  if (!farmer) {
    throw new Error("Farmer profile not found");
  }
  if (crop.farm.farmerId !== farmer.id) {
    throw new Error("You are not authorized to delete this crop");
  }
  await prisma.crop.update({
    where: {
      id
    },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return null;
};
var CropService = {
  createCrop,
  getAllCrops,
  getCropsByFarm,
  getCropById,
  updateCrop,
  updateCropStatus,
  deleteCrop
};

// src/module/crop/crop.controller.ts
var createCrop2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await CropService.createCrop(
      user.userId,
      req.body
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Crop created successfully",
      data: result
    });
  }
);
var getAllCrops2 = catchAsync(
  async (req, res) => {
    const result = await CropService.getAllCrops();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Crops retrieved successfully",
      data: result
    });
  }
);
var getCropsByFarm2 = catchAsync(
  async (req, res) => {
    const result = await CropService.getCropsByFarm(
      req.params.farmId
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Farm crops retrieved successfully",
      data: result
    });
  }
);
var getCropById2 = catchAsync(
  async (req, res) => {
    const result = await CropService.getCropById(
      req.params.id
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Crop retrieved successfully",
      data: result
    });
  }
);
var updateCrop2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await CropService.updateCrop(
      user.userId,
      req.params.id,
      req.body
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Crop updated successfully",
      data: result
    });
  }
);
var updateCropStatus2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await CropService.updateCropStatus(
      user.userId,
      req.params.id,
      req.body.status
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Crop status updated successfully",
      data: result
    });
  }
);
var deleteCrop2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    await CropService.deleteCrop(
      user.userId,
      req.params.id
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Crop deleted successfully",
      data: null
    });
  }
);
var CropController = {
  createCrop: createCrop2,
  getAllCrops: getAllCrops2,
  getCropsByFarm: getCropsByFarm2,
  getCropById: getCropById2,
  updateCrop: updateCrop2,
  updateCropStatus: updateCropStatus2,
  deleteCrop: deleteCrop2
};

// src/module/crop/crop.validation.ts
import { z as z6 } from "zod";
var createCropValidation = z6.object({
  body: z6.object({
    name: z6.string().min(2, "Crop name must be at least 2 characters").max(100, "Crop name cannot exceed 100 characters"),
    variety: z6.string().max(100, "Variety cannot exceed 100 characters").optional(),
    plantingDate: z6.string().datetime("Invalid planting date").optional(),
    harvestDate: z6.string().datetime("Invalid harvest date").optional(),
    status: z6.nativeEnum(CropStatus).optional(),
    farmId: z6.string().uuid("Invalid farm ID")
  })
});
var updateCropValidation = z6.object({
  params: z6.object({
    id: z6.string().uuid("Invalid crop ID")
  }),
  body: z6.object({
    name: z6.string().min(2, "Crop name must be at least 2 characters").max(100, "Crop name cannot exceed 100 characters").optional(),
    variety: z6.string().max(100, "Variety cannot exceed 100 characters").nullable().optional(),
    plantingDate: z6.string().datetime("Invalid planting date").nullable().optional(),
    harvestDate: z6.string().datetime("Invalid harvest date").nullable().optional(),
    status: z6.nativeEnum(CropStatus).optional(),
    farmId: z6.string().uuid("Invalid farm ID").optional()
  })
});
var updateCropStatusValidation = z6.object({
  params: z6.object({
    id: z6.string().uuid("Invalid crop ID")
  }),
  body: z6.object({
    status: z6.nativeEnum(CropStatus)
  })
});
var cropIdValidation = z6.object({
  params: z6.object({
    id: z6.string().uuid("Invalid crop ID")
  })
});
var cropsByFarmValidation = z6.object({
  params: z6.object({
    farmId: z6.string().uuid("Invalid farm ID")
  })
});

// src/module/crop/crop.route.ts
var router6 = Router6();
router6.get(
  "/",
  CropController.getAllCrops
);
router6.get(
  "/farm/:farmId",
  //validateRequest(cropsByFarmValidation),
  CropController.getCropsByFarm
);
router6.get(
  "/:id",
  // validateRequest(cropIdValidation),
  CropController.getCropById
);
router6.post(
  "/",
  auth("FARMER"),
  validateRequest(createCropValidation),
  CropController.createCrop
);
router6.patch(
  "/:id",
  auth("FARMER"),
  validateRequest(updateCropValidation),
  CropController.updateCrop
);
router6.patch(
  "/:id/status",
  auth("FARMER"),
  validateRequest(updateCropStatusValidation),
  CropController.updateCropStatus
);
router6.delete(
  "/:id",
  auth("FARMER"),
  // validateRequest(cropIdValidation),
  CropController.deleteCrop
);
var CropRoutes = router6;

// src/module/order/order.route.ts
import { Router as Router7 } from "express";

// src/module/order/order.controller.ts
import httpStatus7 from "http-status";

// src/module/order/order.service.ts
var createOrder = async (userId, payload) => {
  const buyer = await prisma.buyer.findUnique({
    where: { userId }
  });
  if (!buyer) {
    throw new Error("Buyer profile not found");
  }
  const result = await prisma.$transaction(async (tx) => {
    let totalAmount = 0;
    const orderItemsData = [];
    let farmerIdForOrder = "";
    for (const item of payload.items) {
      const product = await tx.product.findFirst({
        where: { id: item.productId, isDeleted: false }
      });
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      if (product.quantity < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}. Available: ${product.quantity}`);
      }
      if (!farmerIdForOrder) {
        farmerIdForOrder = product.farmerId;
      }
      const itemTotalPrice = product.price * item.quantity;
      totalAmount += itemTotalPrice;
      await tx.product.update({
        where: { id: product.id },
        data: {
          quantity: product.quantity - item.quantity,
          // যদি স্টক ০ হয়ে যায় তবে প্রোডাক্ট SOLD_OUT মার্ক করা
          status: product.quantity - item.quantity === 0 ? "SOLD_OUT" : product.status
        }
      });
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price
      });
    }
    const orderNumber = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        totalAmount,
        deliveryAddress: payload.deliveryAddress,
        status: OrderStatus.PENDING,
        buyerId: buyer.id,
        farmerId: farmerIdForOrder,
        orderItems: {
          create: orderItemsData
        }
      },
      include: {
        orderItems: true
      }
    });
    return newOrder;
  });
  return result;
};
var getMyOrders = async (userId) => {
  const buyer = await prisma.buyer.findUnique({ where: { userId } });
  if (!buyer) throw new Error("Buyer profile not found");
  return prisma.order.findMany({
    where: { buyerId: buyer.id },
    include: {
      orderItems: { include: { product: true } }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getOrderById = async (id, userId, role) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      buyer: true,
      orderItems: { include: { product: true } }
    }
  });
  if (!order) throw new Error("Order not found");
  if (role === Role.BUYER && order.buyer.userId !== userId) {
    throw new Error("Unauthorized to view this order");
  }
  if (role === Role.FARMER) {
    const farmer = await prisma.farmer.findUnique({ where: { userId } });
    if (!farmer || order.farmerId !== farmer.id) {
      throw new Error("Unauthorized to view this order");
    }
  }
  return order;
};
var updateOrderStatus = async (id, status, queryUser) => {
  const { userId, role } = queryUser;
  const whereCondition = { id };
  if (role === "FARMER") {
    const farmer = await prisma.farmer.findUnique({ where: { userId } });
    if (!farmer) {
      throw new Error("Farmer profile not found");
    }
    whereCondition.farmerId = farmer.id;
  }
  const orderExists = await prisma.order.findFirst({
    where: whereCondition
  });
  if (!orderExists) {
    throw new Error("Order not found or you are not authorized to update this order");
  }
  const updatedOrder = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      orderItems: { include: { product: true } }
    }
  });
  return updatedOrder;
};
var orderService = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus
};

// src/module/order/order.controller.ts
var createOrder2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await orderService.createOrder(
    user.userId,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus7.CREATED,
    success: true,
    message: "Order placed successfully",
    data: result
  });
});
var getMyOrders2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await orderService.getMyOrders(
    user.userId
  );
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "Your orders retrieved successfully",
    data: result
  });
});
var getOrderById2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await orderService.getOrderById(
    req.params.id,
    user.userId,
    user.role
  );
  sendResponse(res, {
    statusCode: httpStatus7.OK,
    success: true,
    message: "Order details retrieved successfully",
    data: result
  });
});
var updateOrderStatus2 = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const user = req.user;
  const result = await orderService.updateOrderStatus(id, status, {
    userId: user.userId,
    role: user.role
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Order status updated successfully",
    data: result
  });
});
var orderController = {
  createOrder: createOrder2,
  getMyOrders: getMyOrders2,
  getOrderById: getOrderById2,
  updateOrderStatus: updateOrderStatus2
};

// src/module/order/order.validation.ts
import { z as z7 } from "zod";
var createOrderValidation = z7.object({
  body: z7.object({
    deliveryAddress: z7.string().min(5, "Delivery address is required"),
    items: z7.array(
      z7.object({
        productId: z7.string().uuid("Invalid product ID"),
        quantity: z7.number().positive("Quantity must be greater than 0")
      })
    ).min(1, "At least one product is required")
  })
});
var orderIdValidation = z7.object({
  params: z7.object({
    id: z7.string().uuid("Invalid order ID")
  })
});
var updateOrderStatusValidation = z7.object({
  params: z7.object({
    id: z7.string().uuid("Invalid order ID")
  }),
  body: z7.object({
    status: z7.enum(OrderStatus)
  })
});
var OrderValidation = {
  createOrderValidation,
  orderIdValidation,
  updateOrderStatusValidation
};

// src/module/order/order.route.ts
var router7 = Router7();
router7.post(
  "/",
  auth(Role.BUYER),
  validateRequest(OrderValidation.createOrderValidation),
  orderController.createOrder
);
router7.get(
  "/my-orders",
  auth(Role.BUYER),
  orderController.getMyOrders
);
router7.get(
  "/:id",
  auth(Role.BUYER, Role.FARMER, Role.ADMIN, Role.SUPER_ADMIN),
  // validateRequest(OrderValidation.orderIdValidation),
  orderController.getOrderById
);
router7.patch(
  "/:id/status",
  auth(Role.FARMER, Role.ADMIN),
  // validateRequest(OrderValidation.updateOrderStatusValidation),
  orderController.updateOrderStatus
);
var OrderRoutes = router7;

// src/module/payment/payment.route.ts
import express, { Router as Router8 } from "express";

// src/lib/stripe.ts
import Stripe from "stripe";
var stripe = new Stripe(config_default.stripe_secret_key);

// src/module/payment/payment.service.ts
var createPaymentSession = async (payload, userId) => {
  const { orderId } = payload;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { buyer: true, orderItems: { include: { product: true } } }
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.status !== OrderStatus.PAYMENT_PENDING && order.status !== OrderStatus.PENDING) {
    throw new Error(`Payment is allowed only for pending orders. Current status: ${order.status}`);
  }
  const lineItems = order.orderItems.map((item) => ({
    price_data: {
      currency: "bdt",
      product_data: {
        name: item.product.name
      },
      unit_amount: item.price * 100
      // স্ট্রাইপ পয়সা/সেন্টে হিসাব করে (১ টাকা = ১০০ পয়সা)
    },
    quantity: item.quantity
  }));
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${config_default.frontend_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config_default.frontend_url}/payment/cancel`,
    client_reference_id: orderId,
    customer_email: order.buyer.email || void 0
    // আপনার বায়ার মডেলে ইমেইল থাকলে
  });
  const payment = await prisma.payment.upsert({
    where: { orderId: order.id },
    update: {
      stripeSessionId: session.id,
      amount: order.totalAmount,
      status: PaymentStatus.PENDING
    },
    create: {
      orderId: order.id,
      amount: order.totalAmount,
      stripeSessionId: session.id,
      status: PaymentStatus.PENDING
    }
  });
  return {
    paymentUrl: session.url,
    sessionId: session.id,
    payment
  };
};
var handleWebhook = async (signature, rawBody) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config_default.stripe_webhook_secret
    );
  } catch (err) {
    throw new Error(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.client_reference_id;
    const stripePaymentIntentId = session.payment_intent;
    if (orderId) {
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { orderId },
          data: {
            status: PaymentStatus.PAID,
            stripePaymentIntentId,
            paidAt: /* @__PURE__ */ new Date()
          }
        });
        await tx.order.update({
          where: { id: orderId },
          data: {
            status: OrderStatus.COMPLETED
            // অথবা আপনার এনাম অনুযায়ী PAID / PREPARING
          }
        });
      });
    }
  }
  return { received: true };
};
var getPaymentById = async (paymentId, userId, role) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId
    },
    include: {
      order: {
        select: {
          id: true,
          orderNumber: true,
          totalAmount: true,
          deliveryAddress: true,
          status: true,
          buyerId: true,
          farmerId: true,
          createdAt: true
        }
      }
    }
  });
  if (!payment) {
    throw new Error("Payment not found");
  }
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return payment;
  }
  if (role === "BUYER") {
    const buyer = await prisma.buyer.findUnique({
      where: { userId }
    });
    if (!buyer || payment.order.buyerId !== buyer.id) {
      throw new Error("You are not allowed to view this payment");
    }
    return payment;
  }
  if (role === "FARMER") {
    const farmer = await prisma.farmer.findUnique({
      where: { userId }
      // আপনার farmer মডেলে userId ইউনিক ইনডেক্স থাকতে হবে
    });
    if (!farmer || payment.order.farmerId !== farmer.id) {
      throw new Error("You are not allowed to view this payment");
    }
    return payment;
  }
  throw new Error("You are not allowed to view this payment");
};
var paymentService = {
  createPaymentSession,
  handleWebhook,
  getPaymentById
};

// src/module/payment/payment.controller.ts
var createPaymentSession2 = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await paymentService.createPaymentSession(req.body, user.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment checkout session created successfully",
    data: result
  });
});
var handleWebhook2 = catchAsync(async (req, res) => {
  const signature = req.headers["stripe-signature"];
  if (!signature || typeof signature !== "string") {
    throw new Error("Missing Stripe-Signature header");
  }
  const result = await paymentService.handleWebhook(
    signature,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Webhook processed successfully",
    data: result
  });
});
var getPaymentById2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await paymentService.getPaymentById(
      req.params.id,
      user.userId,
      user.role
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Payment retrieved successfully",
      data: result
    });
  }
);
var paymentController = {
  createPaymentSession: createPaymentSession2,
  handleWebhook: handleWebhook2,
  getPaymentById: getPaymentById2
};

// src/module/payment/payment.route.ts
var router8 = Router8();
router8.post(
  "/create",
  auth(Role.BUYER),
  paymentController.createPaymentSession
);
router8.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);
router8.get(
  "/:id",
  auth(Role.BUYER, Role.FARMER, Role.ADMIN, Role.SUPER_ADMIN),
  paymentController.getPaymentById
);
var PaymentRoutes = router8;

// src/module/user/user.route.ts
import { Router as Router9 } from "express";

// src/lib/multer.ts
import multer from "multer";
var storage = multer.memoryStorage();
var upload = multer({ storage });

// src/module/user/user.controller.ts
import httpStatus8 from "http-status";

// src/utils/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

// src/lib/cloudinary.ts
import { v2 as Cloudinary } from "cloudinary";
Cloudinary.config({
  cloud_name: config_default.cloudinary_cloud_name,
  api_key: config_default.cloudinary_api_key,
  api_secret: config_default.cloudinary_api_secret
});
var cloudinary = Cloudinary;

// src/module/user/user.service.ts
var uploadProfileImage = async (buffer, userId) => {
  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      imagePublicId: true,
      imageUrl: true
    }
  });
  const cloudinaryResult = await new Promise(
    (resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "auto"
        },
        async (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(new Error("No result returned from Cloudinary"));
          }
          resolve(result);
        }
      ).end(buffer);
    }
  );
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      imageUrl: cloudinaryResult.secure_url,
      imagePublicId: cloudinaryResult.public_id
    },
    omit: {
      password: true
    }
  });
  if (currentUser?.imagePublicId && currentUser.imageUrl) {
    await cloudinary.uploader.destroy(currentUser.imagePublicId);
  }
  return updatedUser;
};
var UserServices = {
  uploadProfileImage
  //uploadProfile
};

// src/module/user/user.controller.ts
var uploadProfileImage2 = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError(httpStatus8.BAD_REQUEST, "No File Provided.");
  }
  const userId = req.user?.userId;
  const result = await UserServices.uploadProfileImage(
    req.file?.buffer,
    userId
  );
  sendResponse(res, {
    statusCode: httpStatus8.OK,
    success: true,
    message: "New tokens generated successfully",
    data: result
  });
});
var UserController = {
  uploadProfileImage: uploadProfileImage2
};

// src/module/user/user.route.ts
var router9 = Router9();
router9.patch(
  "/profile-image",
  auth(Role.SUPER_ADMIN, Role.ADMIN, Role.FARMER, Role.BUYER),
  upload.single("profileImage"),
  UserController.uploadProfileImage
);
var UserRoutes = router9;

// src/module/auditLog/ auditLog.route.ts
import { Router as Router10 } from "express";

// src/module/auditLog/auditLog.service.ts
var createAuditLog = async (data) => {
  const result = await prisma.auditLog.create({
    data: {
      userId: data.userId,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      description: data.description,
      oldValue: data.oldValue,
      newValue: data.newValue,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent
    }
  });
  return result;
};
var getAllAuditLogs = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;
  const where = {
    ...query.action && {
      action: query.action
    },
    ...query.resource && {
      resource: query.resource
    },
    ...query.userId && {
      userId: query.userId
    }
  };
  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.auditLog.count({
      where
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data
  };
};
var getAuditLogById = async (id) => {
  const result = await prisma.auditLog.findUnique({
    where: {
      id
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  });
  if (!result) {
    throw new Error("Audit log not found");
  }
  return result;
};
var AuditLogService = {
  createAuditLog,
  getAllAuditLogs,
  getAuditLogById
};

// src/module/auditLog/ auditLog.controller.ts
var getAllAuditLogs2 = async (req, res) => {
  const result = await AuditLogService.getAllAuditLogs(
    req.query
  );
  res.status(200).json({
    success: true,
    message: "Audit logs retrieved successfully",
    meta: result.meta,
    data: result.data
  });
};
var getAuditLogById2 = async (req, res) => {
  const result = await AuditLogService.getAuditLogById(
    req.params.id
  );
  res.status(200).json({
    success: true,
    message: "Audit log retrieved successfully",
    data: result
  });
};
var AuditLogController = {
  getAllAuditLogs: getAllAuditLogs2,
  getAuditLogById: getAuditLogById2
};

// src/module/auditLog/ auditLog.route.ts
var router10 = Router10();
router10.get(
  "/",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  AuditLogController.getAllAuditLogs
);
router10.get(
  "/:id",
  auth(Role.ADMIN, Role.SUPER_ADMIN),
  AuditLogController.getAuditLogById
);
var AuditLogRoutes = router10;

// src/module/review/review.route.ts
import express2 from "express";

// src/module/review/review.controller.ts
import httpStatus9 from "http-status";

// src/module/review/ review.service.ts
var createReview = async (userId, data) => {
  const { productId, orderId, rating, comment } = data;
  const buyer = await prisma.buyer.findUnique({
    where: {
      userId
    }
  });
  if (!buyer) {
    throw new Error("Buyer not found");
  }
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      buyerId: buyer.id,
      isDeleted: false
    },
    include: {
      orderItems: true
    }
  });
  if (!order) {
    throw new Error("Order not found or does not belong to this buyer");
  }
  if (order.status !== "COMPLETED") {
    throw new Error("You can review only completed orders");
  }
  const orderItem = order.orderItems.find(
    (item) => item.productId === productId
  );
  if (!orderItem) {
    throw new Error("This product does not belong to the specified order");
  }
  const existingReview = await prisma.review.findFirst({
    where: {
      buyerId: buyer.id,
      productId,
      orderId,
      isDeleted: false
    }
  });
  if (existingReview) {
    throw new Error("You have already reviewed this product");
  }
  const result = await prisma.review.create({
    data: {
      rating,
      comment,
      buyerId: buyer.id,
      productId,
      orderId
    },
    include: {
      product: true,
      buyer: true,
      order: true
    }
  });
  return result;
};
var getAllReviews = async (query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";
  const andConditions = [];
  if (query.searchTerm) {
    andConditions.push({
      comment: {
        contains: query.searchTerm,
        mode: "insensitive"
      }
    });
  }
  if (query.productId) {
    andConditions.push({
      productId: { equals: String(query.productId) }
    });
  }
  if (query.buyerId) {
    andConditions.push({
      buyerId: { equals: String(query.buyerId) }
    });
  }
  if (query.orderId) {
    andConditions.push({
      orderId: { equals: String(query.orderId) }
    });
  }
  if (query.rating) {
    andConditions.push({
      rating: { equals: Number(query.rating) }
    });
  }
  andConditions.push({ isDeleted: false });
  const allReviews = await prisma.review.findMany({
    where: {
      AND: andConditions.length > 0 ? andConditions : void 0
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      product: true,
      buyer: {
        include: {
          user: {
            omit: {
              password: true
              // 👈 আপনার প্যাটার্ন অনুযায়ী পাসওয়ার্ড রিমুভ করা হয়েছে
            }
          }
        }
      },
      order: true
    }
  });
  const totalReviewCount = await prisma.review.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: allReviews,
    meta: {
      page,
      limit,
      total: totalReviewCount,
      totalPages: Math.ceil(totalReviewCount / limit)
    }
  };
};
var getSingleReview = async (id) => {
  const result = await prisma.review.findFirst({
    where: {
      id,
      isDeleted: false
    },
    include: {
      buyer: true,
      product: true,
      order: true
    }
  });
  if (!result) {
    throw new Error("Review not found");
  }
  return result;
};
var getMyReviews = async (userId) => {
  const buyer = await prisma.buyer.findUnique({
    where: {
      userId
    }
  });
  if (!buyer) {
    throw new Error("Buyer not found");
  }
  const result = await prisma.review.findMany({
    where: {
      buyerId: buyer.id,
      isDeleted: false
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      product: true,
      order: true
    }
  });
  return result;
};
var getProductReviews = async (productId) => {
  const result = await prisma.review.findMany({
    where: {
      productId,
      isDeleted: false
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      buyer: true
    }
  });
  return result;
};
var updateReview = async (id, userId, data) => {
  const buyer = await prisma.buyer.findUnique({
    where: {
      userId
    }
  });
  if (!buyer) {
    throw new Error("Buyer not found");
  }
  const review = await prisma.review.findFirst({
    where: {
      id,
      buyerId: buyer.id,
      isDeleted: false
    }
  });
  if (!review) {
    throw new Error("Review not found or you are not authorized");
  }
  const result = await prisma.review.update({
    where: {
      id
    },
    data: {
      ...data.rating !== void 0 && {
        rating: data.rating
      },
      ...data.comment !== void 0 && {
        comment: data.comment
      }
    },
    include: {
      product: true,
      buyer: true
    }
  });
  return result;
};
var deleteReview = async (id, userId) => {
  const buyer = await prisma.buyer.findUnique({
    where: {
      userId
    }
  });
  if (!buyer) {
    throw new Error("Buyer not found");
  }
  const review = await prisma.review.findFirst({
    where: {
      id,
      buyerId: buyer.id,
      isDeleted: false
    }
  });
  if (!review) {
    throw new Error("Review not found or you are not authorized");
  }
  const result = await prisma.review.update({
    where: {
      id
    },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return result;
};
var adminDeleteReview = async (id) => {
  const review = await prisma.review.findFirst({
    where: {
      id,
      isDeleted: false
    }
  });
  if (!review) {
    throw new Error("Review not found");
  }
  const result = await prisma.review.update({
    where: {
      id
    },
    data: {
      isDeleted: true,
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return result;
};
var superAdminDeleteReview = async (id) => {
  const review = await prisma.review.findUnique({
    where: {
      id
    }
  });
  if (!review) {
    throw new Error("Review not found");
  }
  const result = await prisma.review.delete({
    where: {
      id
    }
  });
  return result;
};
var ReviewService = {
  createReview,
  getAllReviews,
  getSingleReview,
  getMyReviews,
  getProductReviews,
  updateReview,
  deleteReview,
  adminDeleteReview,
  superAdminDeleteReview
};

// src/module/review/review.controller.ts
var createReview2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await ReviewService.createReview(
      user.userId,
      // এখানে userId পাঠানো হচ্ছে
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus9.OK,
      message: "Review created successfully",
      // মেসেজ ঠিক করা হয়েছে
      data: result
    });
  }
);
var getAllReviews2 = catchAsync(
  async (req, res) => {
    const result = await ReviewService.getAllReviews(req.query);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus9.OK,
      message: "Reviews retrieved successfully",
      meta: result.meta,
      data: result.data
    });
  }
);
var getSingleReview2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await ReviewService.getSingleReview(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus9.OK,
      // অথবা সরাসরি 200 দিতে পারেন
      message: "Review retrieved successfully",
      data: result
    });
  }
);
var getMyReviews2 = catchAsync(
  async (req, res) => {
    const user = req.user;
    const result = await ReviewService.getMyReviews(user.userId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus9.OK,
      message: "My reviews retrieved successfully",
      data: result
    });
  }
);
var getProductReviews2 = catchAsync(
  async (req, res) => {
    const { productId } = req.params;
    const result = await ReviewService.getProductReviews(productId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus9.OK,
      message: "Product reviews retrieved successfully",
      data: result
    });
  }
);
var updateReview2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await ReviewService.updateReview(
      id,
      user.userId,
      req.body
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus9.OK,
      message: "Review updated successfully",
      data: result
    });
  }
);
var deleteReview2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await ReviewService.deleteReview(
      id,
      user.userId
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus9.OK,
      message: "Review deleted successfully",
      data: result
    });
  }
);
var adminDeleteReview2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await ReviewService.adminDeleteReview(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus9.OK,
      message: "Review deleted successfully by admin",
      data: result
    });
  }
);
var superAdminDeleteReview2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await ReviewService.superAdminDeleteReview(id);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus9.OK,
      message: "Review deleted successfully by admin",
      data: result
    });
  }
);
var ReviewController = {
  createReview: createReview2,
  getAllReviews: getAllReviews2,
  getSingleReview: getSingleReview2,
  getMyReviews: getMyReviews2,
  getProductReviews: getProductReviews2,
  updateReview: updateReview2,
  deleteReview: deleteReview2,
  adminDeleteReview: adminDeleteReview2,
  superAdminDeleteReview: superAdminDeleteReview2
};

// src/module/review/ review.validation.ts
import { z as z8 } from "zod";
var createReviewValidationSchema = z8.object({
  body: z8.object({
    rating: z8.number({
      message: "Rating must be a number"
    }).min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5"),
    comment: z8.string().trim().max(1e3, "Comment cannot exceed 1000 characters").optional(),
    buyerId: z8.string({
      message: "Buyer ID must be a string"
    }).uuid("Invalid buyer ID").optional(),
    productId: z8.string({
      message: "Product ID is required"
    }).uuid("Invalid product ID"),
    orderId: z8.string({
      message: "Order ID is required"
    }).uuid("Invalid order ID")
  })
});
var updateReviewValidationSchema = z8.object({
  body: z8.object({
    rating: z8.number().int("Rating must be an integer").min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5").optional(),
    comment: z8.string().trim().max(1e3, "Comment cannot exceed 1000 characters").optional()
  }).refine(
    (data) => data.rating !== void 0 || data.comment !== void 0,
    {
      message: "At least one field is required to update review"
    }
  )
});
var ReviewValidation = {
  createReviewValidationSchema,
  updateReviewValidationSchema
};

// src/module/review/review.route.ts
var router11 = express2.Router();
router11.post(
  "/",
  auth(Role.BUYER),
  validateRequest(
    ReviewValidation.createReviewValidationSchema
  ),
  ReviewController.createReview
);
router11.get(
  "/my-reviews",
  auth(Role.BUYER),
  ReviewController.getMyReviews
);
router11.patch(
  "/:id",
  auth(Role.BUYER),
  validateRequest(
    ReviewValidation.updateReviewValidationSchema
  ),
  ReviewController.updateReview
);
router11.delete(
  "/:id",
  auth(Role.BUYER),
  ReviewController.deleteReview
);
router11.get(
  "/",
  ReviewController.getAllReviews
);
router11.get(
  "/product/:productId",
  ReviewController.getProductReviews
);
router11.get(
  "/:id",
  ReviewController.getSingleReview
);
router11.delete(
  "/admin/:id",
  auth(Role.ADMIN),
  ReviewController.adminDeleteReview
);
router11.delete(
  "/super-admin/:id",
  auth(Role.SUPER_ADMIN),
  ReviewController.superAdminDeleteReview
);
var ReviewRoutes = router11;

// src/module/expert/expert.route.ts
import { Router as Router11 } from "express";

// src/module/expert/expert.controller.ts
import httpStatus10 from "http-status";

// src/module/expert/expert.service.ts
import bcrypt2 from "bcryptjs";
var registerExpert = async (payload) => {
  const email = payload.email.trim().toLowerCase();
  const isEmailExists = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (isEmailExists) {
    throw new Error(
      "Email is already registered. Please login."
    );
  }
  if (!payload.password) {
    throw new Error(
      "Password is required for expert registration"
    );
  }
  const hashedPassword = await bcrypt2.hash(
    payload.password,
    8
  );
  const newUser = await prisma.user.create({
    data: {
      name: payload.name,
      email,
      password: hashedPassword,
      phone: payload.phone,
      address: payload.address,
      // Expert role is fixed
      role: Role.EXPERT,
      authProvider: AuthProvider.CREDENTIAL,
      emailVerified: false,
      expert: {
        create: {
          name: payload.name,
          email,
          city: payload.city,
          specialization: payload.specialization,
          qualification: payload.qualification,
          experience: payload.experience
        }
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      status: true,
      createdAt: true,
      expert: {
        select: {
          id: true,
          name: true,
          email: true,
          city: true,
          specialization: true,
          qualification: true,
          experience: true
        }
      }
    }
  });
  if (!newUser) {
    throw new Error("Failed to create expert");
  }
  const jwtPayload = {
    userId: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken3 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    user: newUser,
    accessToken,
    refreshToken: refreshToken3
  };
};
var getAllExperts = async (query) => {
  const {
    searchTerm,
    specialization,
    page = "1",
    limit = "10",
    sortBy = "createdAt",
    sortOrder = "desc"
  } = query;
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const andConditions = [
    {
      isDeleted: false
    }
  ];
  if (searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          email: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          specialization: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          qualification: {
            contains: searchTerm,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (specialization) {
    andConditions.push({
      specialization: {
        contains: specialization,
        mode: "insensitive"
      }
    });
  }
  const whereConditions = {
    AND: andConditions
  };
  const [result, total] = await Promise.all([
    prisma.expert.findMany({
      where: whereConditions,
      skip,
      take: limitNumber,
      orderBy: {
        [sortBy]: sortOrder === "asc" ? "asc" : "desc"
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            imageUrl: true,
            role: true,
            status: true
          }
        }
      }
    }),
    prisma.expert.count({
      where: whereConditions
    })
  ]);
  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber)
    },
    data: result
  };
};
var getSingleExpert = async (id) => {
  const result = await prisma.expert.findFirst({
    where: {
      id,
      isDeleted: false
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
          imageUrl: true,
          role: true,
          status: true
        }
      }
    }
  });
  if (!result) {
    throw new Error("Expert not found");
  }
  return result;
};
var deleteExpert = async (id, userId, role) => {
  const expert = await prisma.expert.findUnique({
    where: { id }
  });
  if (!expert) {
    throw new Error("Expert profile not found");
  }
  if (role === Role.SUPER_ADMIN) {
    return await prisma.$transaction(async (tx) => {
      const deletedExpert = await tx.expert.delete({
        where: { id }
      });
      await tx.user.delete({
        where: { id: expert.userId }
      });
      return deletedExpert;
    });
  }
  const isOwnProfile = expert.userId === userId;
  if (role === Role.ADMIN || isOwnProfile) {
    if (expert.isDeleted) {
      throw new Error("Expert profile is already deleted");
    }
    return await prisma.$transaction(async (tx) => {
      const updatedExpert = await tx.expert.update({
        where: { id },
        data: {
          isDeleted: true,
          deletedAt: /* @__PURE__ */ new Date()
        }
      });
      await tx.user.update({
        where: { id: expert.userId },
        data: {
          isDeleted: true,
          deletedAt: /* @__PURE__ */ new Date(),
          status: "DELETED"
          // UserStatus enum অনুযায়ী
        }
      });
      return updatedExpert;
    });
  }
  throw new Error("You do not have permission to delete this expert");
};
var ExpertService = {
  registerExpert,
  getAllExperts,
  getSingleExpert,
  deleteExpert
};

// src/module/expert/expert.controller.ts
var registerExpert2 = catchAsync(
  async (req, res) => {
    const result = await ExpertService.registerExpert(
      req.body
    );
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Expert registered successfully",
      data: result
    });
  }
);
var getAllExperts2 = catchAsync(
  async (req, res) => {
    const result = await ExpertService.getAllExperts(
      req.query
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Experts retrieved successfully",
      meta: result.meta,
      data: result.data
    });
  }
);
var getSingleExpert2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result = await ExpertService.getSingleExpert(
      id
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Expert retrieved successfully",
      data: result
    });
  }
);
var deleteExpert2 = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await ExpertService.deleteExpert(
      id,
      user.userId,
      user.role
    );
    sendResponse(res, {
      statusCode: httpStatus10.OK,
      success: true,
      message: "Expert deleted successfully",
      data: result
    });
  }
);
var ExpertController = {
  registerExpert: registerExpert2,
  getAllExperts: getAllExperts2,
  getSingleExpert: getSingleExpert2,
  deleteExpert: deleteExpert2
};

// src/module/expert/expert.validation.ts
import { z as z9 } from "zod";
var registerExpertValidationSchema = z9.object({
  body: z9.object({
    name: z9.string().min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters"),
    email: z9.string().email("Invalid email address").trim().toLowerCase(),
    password: z9.string().min(6, "Password must be at least 6 characters"),
    phone: z9.string().optional(),
    address: z9.string().optional(),
    city: z9.string().optional(),
    specialization: z9.string().optional(),
    qualification: z9.string().optional(),
    experience: z9.number().min(0, "Experience cannot be negative").optional()
  })
});
var updateExpertValidationSchema = z9.object({
  body: z9.object({
    name: z9.string().min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters").optional(),
    email: z9.string().email("Invalid email address").trim().toLowerCase().optional(),
    city: z9.string().optional(),
    specialization: z9.string().optional(),
    qualification: z9.string().optional(),
    experience: z9.number().min(0, "Experience cannot be negative").optional()
  })
});
var ExpertValidation = {
  registerExpertValidationSchema,
  updateExpertValidationSchema
};

// src/module/expert/expert.route.ts
var router12 = Router11();
router12.post(
  "/register",
  validateRequest(ExpertValidation.registerExpertValidationSchema),
  ExpertController.registerExpert
);
router12.get(
  "/",
  auth(Role.SUPER_ADMIN, Role.ADMIN),
  ExpertController.getAllExperts
);
router12.get(
  "/:id",
  auth(Role.SUPER_ADMIN, Role.ADMIN),
  ExpertController.getSingleExpert
);
router12.delete(
  "/:id",
  auth(Role.SUPER_ADMIN, Role.ADMIN),
  ExpertController.deleteExpert
);
var ExpertRoutes = router12;

// src/app.ts
var app = express3();
app.use(
  cors({
    origin: config_default.frontend_url,
    credentials: true
  })
);
app.use(
  "/api/v1/payments/webhook",
  express3.raw({ type: "application/json" })
);
app.use(express3.json());
app.use(express3.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/experts", ExpertRoutes);
app.use("/api/v1/admin", AdminRoutes);
app.use("/api/v1/audit-logs", AuditLogRoutes);
app.use("/api/v1/farms", FarmRoutes);
app.use("/api/v1/crops", CropRoutes);
app.use("/api/v1/orders", OrderRoutes);
app.use("/api/v1/payments", PaymentRoutes);
app.use("/api/v1/categories", CategoryRoutes);
app.use("/api/v1/products", ProductRoutes);
app.use("/api/v1/reviews", ReviewRoutes);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use(notFoundHandler);
app.use(globalErrorHandler);
var app_default = app;

// src/utils/seed.ts
import bcrypt3 from "bcryptjs";
import httpStatus11 from "http-status";
var seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await prisma.user.findFirst({
      where: {
        role: Role.SUPER_ADMIN
      }
    });
    if (isSuperAdminExist) {
      console.log("Super Admin Already Exists!");
      return;
    }
    const name = config_default.super_admin_name;
    const email = config_default.super_admin_email;
    const password = config_default.super_admin_password;
    if (!name || !email || !password) {
      throw new AppError(
        httpStatus11.INTERNAL_SERVER_ERROR,
        "Super Admin Name , Email, Password Missing In Env File!!!"
      );
    }
    const hashedPassword = await bcrypt3.hash(
      password,
      Number(config_default.bcrypt_salt_rounds)
    );
    const superAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
        needPasswordChange: false,
        emailVerified: true
      }
    });
    console.log("Super Admin Created : ", superAdmin);
  } catch (error) {
    console.log("Error Seeding Super Admin : ", error);
    await prisma.user.delete({
      where: {
        email: config_default.super_admin_email
      }
    });
  }
};
var seedTesterAdmin = async () => {
  try {
    const isTesterAdminExist = await prisma.user.findUnique({
      where: {
        email: config_default.tester_admin_email
      }
    });
    if (isTesterAdminExist) {
      console.log("Tester Admin Already Exists!");
      return;
    }
    const name = config_default.tester_admin_name;
    const email = config_default.tester_admin_email;
    const password = config_default.tester_admin_password;
    if (!name || !email || !password) {
      throw new AppError(
        httpStatus11.INTERNAL_SERVER_ERROR,
        "Tester Admin Name , Email, Password Missing In Env File!!!"
      );
    }
    const hashedPassword = await bcrypt3.hash(
      password,
      Number(config_default.bcrypt_salt_rounds)
    );
    const testerAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.ADMIN,
        needPasswordChange: false,
        emailVerified: true
      },
      omit: {
        password: true
      }
    });
    console.log("Tester Admin Created : ", testerAdmin);
  } catch (error) {
    console.log("Error Seeding Tester Admin : ", error);
    await prisma.user.delete({
      where: {
        email: config_default.tester_admin_email
      }
    });
  }
};

// src/server.ts
var PORT = config_default.port;
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    await seedSuperAdmin();
    await seedTesterAdmin();
    app_default.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
//# sourceMappingURL=server.js.map