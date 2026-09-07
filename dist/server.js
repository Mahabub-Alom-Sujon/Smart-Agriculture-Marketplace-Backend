
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
import express2 from "express";
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
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Get a free hosted Postgres database in seconds: `npx create-db`\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\n// ====================\n// ENUMS\n// ====================\n\nenum Role {\n  FARMER\n  BUYER\n  EXPERT\n  ADMIN\n  SUPER_ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  INACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum AuthProvider {\n  GOOGLE\n  CREDENTIAL\n}\n\nenum CropStatus {\n  PLANNED\n  GROWING\n  HARVESTED\n}\n\nenum ProductStatus {\n  ACTIVE\n  SOLD_OUT\n  INACTIVE\n}\n\nenum OrderStatus {\n  PENDING\n  PAYMENT_PENDING\n  PAID\n  PROCESSING\n  SHIPPED\n  COMPLETED\n  DELIVERED\n  CANCELLED\n  REFUNDED\n  CONFIRMED\n}\n\nenum ConsultationStatus {\n  PENDING\n  ACCEPTED\n  COMPLETED\n  CANCELLED\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  REFUNDED\n  CANCELLED\n}\n\nenum PaymentProvider {\n  STRIPE\n}\n\n// ====================\n// USER\n// ====================\n\nmodel User {\n  id                 String         @id @default(uuid())\n  name               String\n  email              String         @unique\n  password           String?\n  phone              String?\n  address            String?\n  imageUrl           String?        @default("")\n  imagePublicId      String         @default("")\n  googleId           String?        @unique\n  authProvider       AuthProvider   @default(CREDENTIAL)\n  emailVerified      Boolean        @default(false)\n  role               Role           @default(BUYER)\n  status             UserStatus     @default(ACTIVE)\n  needPasswordChange Boolean        @default(false)\n  isDeleted          Boolean        @default(false)\n  deletedAt          DateTime?\n  expertAdvices      ExpertAdvice[]\n  auditLogs          AuditLog[]\n  farmer             Farmer?\n  buyer              Buyer?\n  createdAt          DateTime       @default(now())\n  updatedAt          DateTime       @updatedAt\n}\n\n// ====================\n// FARMER MODEL\n// ====================\n\nmodel Farmer {\n  id            String         @id @default(uuid())\n  name          String\n  email         String         @unique\n  certification String?\n  userId        String         @unique\n  user          User           @relation(fields: [userId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  farms         Farm[]\n  products      Product[]\n  consultations Consultation[]\n  isDeleted     Boolean        @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime       @default(now())\n  updatedAt     DateTime       @updatedAt\n}\n\n// ====================\n// BUYER MODEL\n// ====================\n\nmodel Buyer {\n  id        String    @id @default(uuid())\n  name      String\n  email     String    @unique\n  address   String?\n  city      String?\n  country   String?\n  userId    String    @unique\n  user      User      @relation(fields: [userId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  orders    Order[]\n  reviews   Review[]\n  payments  Payment[]\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n}\n\n// ====================\n// AUDIT LOG\n// ====================\n\nmodel AuditLog {\n  id          String   @id @default(uuid())\n  action      String\n  resource    String\n  resourceId  String?\n  description String?\n  oldValue    Json?\n  newValue    Json?\n  ipAddress   String?\n  userAgent   String?\n  createdAt   DateTime @default(now())\n  updatedAt   DateTime @updatedAt\n  user        User?    @relation(fields: [userId], references: [id])\n  userId      String?\n}\n\n// ====================\n// FARM\n// ====================\n\nmodel Farm {\n  id        String    @id @default(uuid())\n  farmName  String\n  location  String\n  landSize  Float?\n  soilType  String?\n  farmerId  String\n  farmer    Farmer    @relation(fields: [farmerId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  crops     Crop[]\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n}\n\n// ====================\n// CROP\n// ====================\n\nmodel Crop {\n  id           String     @id @default(uuid())\n  name         String\n  variety      String?\n  plantingDate DateTime?\n  harvestDate  DateTime?\n  status       CropStatus @default(PLANNED)\n  farmId       String\n  farm         Farm       @relation(fields: [farmId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  isDeleted    Boolean    @default(false)\n  deletedAt    DateTime?\n  createdAt    DateTime   @default(now())\n  updatedAt    DateTime   @updatedAt\n}\n\n// ====================\n// CATEGORY\n// ====================\n\nmodel Category {\n  id          String    @id @default(uuid())\n  name        String    @unique\n  description String?\n  image       String?\n  products    Product[]\n  isDeleted   Boolean   @default(false)\n  deletedAt   DateTime?\n  createdAt   DateTime  @default(now())\n  updatedAt   DateTime  @updatedAt\n}\n\n// ====================\n// PRODUCT\n// ====================\n\nmodel Product {\n  id          String        @id @default(uuid())\n  name        String\n  description String?\n  price       Int\n  quantity    Float\n  unit        String        @default("KG")\n  image       String?\n  status      ProductStatus @default(ACTIVE)\n  farmerId    String\n  categoryId  String\n  category    Category      @relation(fields: [categoryId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  farmer      Farmer        @relation(fields: [farmerId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  orderItems  OrderItem[]\n  reviews     Review[]\n  isDeleted   Boolean       @default(false)\n  deletedAt   DateTime?\n  createdAt   DateTime      @default(now())\n  updatedAt   DateTime      @updatedAt\n}\n\n// ====================\n// EXPERT ADVICE\n// ====================\n\nmodel ExpertAdvice {\n  id             String       @id @default(uuid())\n  diagnosis      String\n  recommendation String\n  fertilizer     String?\n  pesticide      String?\n  consultationId String       @unique\n  expertId       String\n  consultation   Consultation @relation(fields: [consultationId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  expert         User         @relation(fields: [expertId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  isDeleted      Boolean      @default(false)\n  deletedAt      DateTime?\n  createdAt      DateTime     @default(now())\n  updatedAt      DateTime     @updatedAt\n}\n\n// ====================\n// CONSULTATION\n// ====================\n\nmodel Consultation {\n  id        String             @id @default(uuid())\n  cropName  String?\n  problem   String\n  image     String?\n  status    ConsultationStatus @default(PENDING)\n  advice    ExpertAdvice?\n  farmerId  String\n  farmer    Farmer             @relation(fields: [farmerId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  isDeleted Boolean            @default(false)\n  deletedAt DateTime?\n  createdAt DateTime           @default(now())\n  updatedAt DateTime           @updatedAt\n}\n\n// ====================\n// ORDER\n// ====================\n\nmodel Order {\n  id              String      @id @default(uuid())\n  orderNumber     String      @unique\n  totalAmount     Int\n  deliveryAddress String\n  status          OrderStatus @default(PENDING)\n  buyerId         String\n  farmerId        String\n  buyer           Buyer       @relation(fields: [buyerId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  orderItems      OrderItem[]\n  reviews         Review[]\n  payment         Payment?\n  isDeleted       Boolean     @default(false)\n  deletedAt       DateTime?\n  createdAt       DateTime    @default(now())\n  updatedAt       DateTime    @updatedAt\n}\n\n// =========================\n// ORDER ITEM\n// =========================\n\nmodel OrderItem {\n  id        String    @id @default(uuid())\n  quantity  Float\n  price     Int\n  orderId   String\n  order     Order     @relation(fields: [orderId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  productId String\n  product   Product   @relation(fields: [productId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n}\n\nmodel Payment {\n  id                    String          @id @default(uuid())\n  orderId               String          @unique\n  amount                Int\n  currency              String          @default("bdt")\n  provider              PaymentProvider @default(STRIPE)\n  status                PaymentStatus   @default(PENDING)\n  stripeSessionId       String?         @unique\n  stripePaymentIntentId String?         @unique\n  paidAt                DateTime?\n  buyerId               String?\n  order                 Order           @relation(fields: [orderId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  buyer                 Buyer?          @relation(fields: [buyerId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  createdAt             DateTime        @default(now())\n  updatedAt             DateTime        @updatedAt\n}\n\n// =========================\n// REVIEW\n// =========================\n\nmodel Review {\n  id        String    @id @default(uuid())\n  rating    Int\n  comment   String?\n  buyerId   String\n  buyer     Buyer     @relation(fields: [buyerId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  productId String\n  product   Product   @relation(fields: [productId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  orderId   String\n  order     Order     @relation(fields: [orderId], references: [id], onDelete: Restrict, onUpdate: Cascade)\n  isDeleted Boolean   @default(false)\n  deletedAt DateTime?\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n}\n',
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
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"imagePublicId","kind":"scalar","type":"String"},{"name":"googleId","kind":"scalar","type":"String"},{"name":"authProvider","kind":"enum","type":"AuthProvider"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"expertAdvices","kind":"object","type":"ExpertAdvice","relationName":"ExpertAdviceToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"farmer","kind":"object","type":"Farmer","relationName":"FarmerToUser"},{"name":"buyer","kind":"object","type":"Buyer","relationName":"BuyerToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Farmer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"certification","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"FarmerToUser"},{"name":"farms","kind":"object","type":"Farm","relationName":"FarmToFarmer"},{"name":"products","kind":"object","type":"Product","relationName":"FarmerToProduct"},{"name":"consultations","kind":"object","type":"Consultation","relationName":"ConsultationToFarmer"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Buyer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"country","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"BuyerToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"BuyerToOrder"},{"name":"reviews","kind":"object","type":"Review","relationName":"BuyerToReview"},{"name":"payments","kind":"object","type":"Payment","relationName":"BuyerToPayment"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"resource","kind":"scalar","type":"String"},{"name":"resourceId","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"oldValue","kind":"scalar","type":"Json"},{"name":"newValue","kind":"scalar","type":"Json"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AuditLogToUser"},{"name":"userId","kind":"scalar","type":"String"}],"dbName":null},"Farm":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"farmName","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"landSize","kind":"scalar","type":"Float"},{"name":"soilType","kind":"scalar","type":"String"},{"name":"farmerId","kind":"scalar","type":"String"},{"name":"farmer","kind":"object","type":"Farmer","relationName":"FarmToFarmer"},{"name":"crops","kind":"object","type":"Crop","relationName":"CropToFarm"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Crop":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"variety","kind":"scalar","type":"String"},{"name":"plantingDate","kind":"scalar","type":"DateTime"},{"name":"harvestDate","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"CropStatus"},{"name":"farmId","kind":"scalar","type":"String"},{"name":"farm","kind":"object","type":"Farm","relationName":"CropToFarm"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"products","kind":"object","type":"Product","relationName":"CategoryToProduct"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Product":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"quantity","kind":"scalar","type":"Float"},{"name":"unit","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ProductStatus"},{"name":"farmerId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToProduct"},{"name":"farmer","kind":"object","type":"Farmer","relationName":"FarmerToProduct"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderItemToProduct"},{"name":"reviews","kind":"object","type":"Review","relationName":"ProductToReview"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"ExpertAdvice":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"diagnosis","kind":"scalar","type":"String"},{"name":"recommendation","kind":"scalar","type":"String"},{"name":"fertilizer","kind":"scalar","type":"String"},{"name":"pesticide","kind":"scalar","type":"String"},{"name":"consultationId","kind":"scalar","type":"String"},{"name":"expertId","kind":"scalar","type":"String"},{"name":"consultation","kind":"object","type":"Consultation","relationName":"ConsultationToExpertAdvice"},{"name":"expert","kind":"object","type":"User","relationName":"ExpertAdviceToUser"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Consultation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cropName","kind":"scalar","type":"String"},{"name":"problem","kind":"scalar","type":"String"},{"name":"image","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"ConsultationStatus"},{"name":"advice","kind":"object","type":"ExpertAdvice","relationName":"ConsultationToExpertAdvice"},{"name":"farmerId","kind":"scalar","type":"String"},{"name":"farmer","kind":"object","type":"Farmer","relationName":"ConsultationToFarmer"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderNumber","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Int"},{"name":"deliveryAddress","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"buyerId","kind":"scalar","type":"String"},{"name":"farmerId","kind":"scalar","type":"String"},{"name":"buyer","kind":"object","type":"Buyer","relationName":"BuyerToOrder"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"reviews","kind":"object","type":"Review","relationName":"OrderToReview"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrderToPayment"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Float"},{"name":"price","kind":"scalar","type":"Int"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"OrderItemToProduct"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Int"},{"name":"currency","kind":"scalar","type":"String"},{"name":"provider","kind":"enum","type":"PaymentProvider"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"stripeSessionId","kind":"scalar","type":"String"},{"name":"stripePaymentIntentId","kind":"scalar","type":"String"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"buyerId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToPayment"},{"name":"buyer","kind":"object","type":"Buyer","relationName":"BuyerToPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"buyerId","kind":"scalar","type":"String"},{"name":"buyer","kind":"object","type":"Buyer","relationName":"BuyerToReview"},{"name":"productId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Product","relationName":"ProductToReview"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToReview"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","advice","user","farmer","farm","crops","_count","farms","products","category","orders","buyer","product","order","reviews","payments","orderItems","payment","consultations","consultation","expert","expertAdvices","auditLogs","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","data","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","create","update","User.upsertOne","User.deleteOne","User.deleteMany","having","_min","_max","User.groupBy","User.aggregate","Farmer.findUnique","Farmer.findUniqueOrThrow","Farmer.findFirst","Farmer.findFirstOrThrow","Farmer.findMany","Farmer.createOne","Farmer.createMany","Farmer.createManyAndReturn","Farmer.updateOne","Farmer.updateMany","Farmer.updateManyAndReturn","Farmer.upsertOne","Farmer.deleteOne","Farmer.deleteMany","Farmer.groupBy","Farmer.aggregate","Buyer.findUnique","Buyer.findUniqueOrThrow","Buyer.findFirst","Buyer.findFirstOrThrow","Buyer.findMany","Buyer.createOne","Buyer.createMany","Buyer.createManyAndReturn","Buyer.updateOne","Buyer.updateMany","Buyer.updateManyAndReturn","Buyer.upsertOne","Buyer.deleteOne","Buyer.deleteMany","Buyer.groupBy","Buyer.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","Farm.findUnique","Farm.findUniqueOrThrow","Farm.findFirst","Farm.findFirstOrThrow","Farm.findMany","Farm.createOne","Farm.createMany","Farm.createManyAndReturn","Farm.updateOne","Farm.updateMany","Farm.updateManyAndReturn","Farm.upsertOne","Farm.deleteOne","Farm.deleteMany","_avg","_sum","Farm.groupBy","Farm.aggregate","Crop.findUnique","Crop.findUniqueOrThrow","Crop.findFirst","Crop.findFirstOrThrow","Crop.findMany","Crop.createOne","Crop.createMany","Crop.createManyAndReturn","Crop.updateOne","Crop.updateMany","Crop.updateManyAndReturn","Crop.upsertOne","Crop.deleteOne","Crop.deleteMany","Crop.groupBy","Crop.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Product.findUnique","Product.findUniqueOrThrow","Product.findFirst","Product.findFirstOrThrow","Product.findMany","Product.createOne","Product.createMany","Product.createManyAndReturn","Product.updateOne","Product.updateMany","Product.updateManyAndReturn","Product.upsertOne","Product.deleteOne","Product.deleteMany","Product.groupBy","Product.aggregate","ExpertAdvice.findUnique","ExpertAdvice.findUniqueOrThrow","ExpertAdvice.findFirst","ExpertAdvice.findFirstOrThrow","ExpertAdvice.findMany","ExpertAdvice.createOne","ExpertAdvice.createMany","ExpertAdvice.createManyAndReturn","ExpertAdvice.updateOne","ExpertAdvice.updateMany","ExpertAdvice.updateManyAndReturn","ExpertAdvice.upsertOne","ExpertAdvice.deleteOne","ExpertAdvice.deleteMany","ExpertAdvice.groupBy","ExpertAdvice.aggregate","Consultation.findUnique","Consultation.findUniqueOrThrow","Consultation.findFirst","Consultation.findFirstOrThrow","Consultation.findMany","Consultation.createOne","Consultation.createMany","Consultation.createManyAndReturn","Consultation.updateOne","Consultation.updateMany","Consultation.updateManyAndReturn","Consultation.upsertOne","Consultation.deleteOne","Consultation.deleteMany","Consultation.groupBy","Consultation.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","OrderItem.findUnique","OrderItem.findUniqueOrThrow","OrderItem.findFirst","OrderItem.findFirstOrThrow","OrderItem.findMany","OrderItem.createOne","OrderItem.createMany","OrderItem.createManyAndReturn","OrderItem.updateOne","OrderItem.updateMany","OrderItem.updateManyAndReturn","OrderItem.upsertOne","OrderItem.deleteOne","OrderItem.deleteMany","OrderItem.groupBy","OrderItem.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","AND","OR","NOT","id","rating","comment","buyerId","productId","orderId","isDeleted","deletedAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","amount","currency","PaymentProvider","provider","PaymentStatus","status","stripeSessionId","stripePaymentIntentId","paidAt","quantity","price","orderNumber","totalAmount","deliveryAddress","OrderStatus","farmerId","cropName","problem","image","ConsultationStatus","diagnosis","recommendation","fertilizer","pesticide","consultationId","expertId","name","description","unit","ProductStatus","categoryId","every","some","none","variety","plantingDate","harvestDate","CropStatus","farmId","farmName","location","landSize","soilType","action","resource","resourceId","oldValue","newValue","ipAddress","userAgent","userId","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","email","address","city","country","certification","password","phone","imageUrl","imagePublicId","googleId","AuthProvider","authProvider","emailVerified","Role","role","UserStatus","needPasswordChange","is","isNot","connectOrCreate","upsert","disconnect","delete","connect","createMany","set","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "uweEAeABGQUAAN4DACANAADfAwAgFwAA3AMAIBgAAN0DACCBAgAA2AMAMIICAAA_ABCDAgAA2AMAMIQCAQAAAAGKAiAAtQMAIYsCQAC2AwAhjAJAALcDACGNAkAAtwMAIZ4CAADbA-ICIrMCAQCzAwAh0gIBAAAAAdMCAQC0AwAh1wIBALQDACHYAgEAtAMAIdkCAQC0AwAh2gIBALMDACHbAgEAAAAB3QIAANkD3QIi3gIgALUDACHgAgAA2gPgAiLiAiAAtQMAIQEAAAABACAQFQAA_wMAIBYAAMYDACCBAgAA_gMAMIICAAADABCDAgAA_gMAMIQCAQCzAwAhigIgALUDACGLAkAAtgMAIYwCQAC3AwAhjQJAALcDACGtAgEAswMAIa4CAQCzAwAhrwIBALQDACGwAgEAtAMAIbECAQCzAwAhsgIBALMDACEFFQAA0wYAIBYAAOUFACCLAgAAgAQAIK8CAACABAAgsAIAAIAEACAQFQAA_wMAIBYAAMYDACCBAgAA_gMAMIICAAADABCDAgAA_gMAMIQCAQAAAAGKAiAAtQMAIYsCQAC2AwAhjAJAALcDACGNAkAAtwMAIa0CAQCzAwAhrgIBALMDACGvAgEAtAMAIbACAQC0AwAhsQIBAAAAAbICAQCzAwAhAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAADACAPBQAA5gMAIAcAAP0DACCBAgAA-wMAMIICAAAIABCDAgAA-wMAMIQCAQCzAwAhigIgALUDACGLAkAAtgMAIYwCQAC3AwAhjQJAALcDACGoAgEAswMAIcACAQCzAwAhwQIBALMDACHCAggA_AMAIcMCAQC0AwAhBQUAAMkGACAHAADSBgAgiwIAAIAEACDCAgAAgAQAIMMCAACABAAgDwUAAOYDACAHAAD9AwAggQIAAPsDADCCAgAACAAQgwIAAPsDADCEAgEAAAABigIgALUDACGLAkAAtgMAIYwCQAC3AwAhjQJAALcDACGoAgEAswMAIcACAQCzAwAhwQIBALMDACHCAggA_AMAIcMCAQC0AwAhAwAAAAgAIAEAAAkAMAIAAAoAIA8GAAD6AwAggQIAAPgDADCCAgAADAAQgwIAAPgDADCEAgEAswMAIYoCIAC1AwAhiwJAALYDACGMAkAAtwMAIY0CQAC3AwAhngIAAPkDvwIiswIBALMDACG7AgEAtAMAIbwCQAC2AwAhvQJAALYDACG_AgEAswMAIQUGAADRBgAgiwIAAIAEACC7AgAAgAQAILwCAACABAAgvQIAAIAEACAPBgAA-gMAIIECAAD4AwAwggIAAAwAEIMCAAD4AwAwhAIBAAAAAYoCIAC1AwAhiwJAALYDACGMAkAAtwMAIY0CQAC3AwAhngIAAPkDvwIiswIBALMDACG7AgEAtAMAIbwCQAC2AwAhvQJAALYDACG_AgEAswMAIQMAAAAMACABAAANADACAAAOACABAAAADAAgFQUAAOYDACALAAD3AwAgEAAAyAMAIBIAAPEDACCBAgAA9QMAMIICAAARABCDAgAA9QMAMIQCAQCzAwAhigIgALUDACGLAkAAtgMAIYwCQAC3AwAhjQJAALcDACGeAgAA9gO3AiKiAggA9AMAIaMCAgDoAwAhqAIBALMDACGrAgEAtAMAIbMCAQCzAwAhtAIBALQDACG1AgEAswMAIbcCAQCzAwAhBwUAAMkGACALAADQBgAgEAAA5wUAIBIAAM4GACCLAgAAgAQAIKsCAACABAAgtAIAAIAEACAVBQAA5gMAIAsAAPcDACAQAADIAwAgEgAA8QMAIIECAAD1AwAwggIAABEAEIMCAAD1AwAwhAIBAAAAAYoCIAC1AwAhiwJAALYDACGMAkAAtwMAIY0CQAC3AwAhngIAAPYDtwIiogIIAPQDACGjAgIA6AMAIagCAQCzAwAhqwIBALQDACGzAgEAswMAIbQCAQC0AwAhtQIBALMDACG3AgEAswMAIQMAAAARACABAAASADACAAATACADAAAAEQAgAQAAEgAwAgAAEwAgAQAAABEAIA4OAADuAwAgDwAA6wMAIIECAADzAwAwggIAABcAEIMCAADzAwAwhAIBALMDACGIAgEAswMAIYkCAQCzAwAhigIgALUDACGLAkAAtgMAIYwCQAC3AwAhjQJAALcDACGiAggA9AMAIaMCAgDoAwAhAw4AAM0GACAPAADMBgAgiwIAAIAEACAODgAA7gMAIA8AAOsDACCBAgAA8wMAMIICAAAXABCDAgAA8wMAMIQCAQAAAAGIAgEAswMAIYkCAQCzAwAhigIgALUDACGLAkAAtgMAIYwCQAC3AwAhjQJAALcDACGiAggA9AMAIaMCAgDoAwAhAwAAABcAIAEAABgAMAIAABkAIBINAADtAwAgEAAAyAMAIBIAAPEDACATAADyAwAggQIAAO8DADCCAgAAGwAQgwIAAO8DADCEAgEAswMAIYcCAQCzAwAhigIgALUDACGLAkAAtgMAIYwCQAC3AwAhjQJAALcDACGeAgAA8AOoAiKkAgEAswMAIaUCAgDoAwAhpgIBALMDACGoAgEAswMAIQUNAADKBgAgEAAA5wUAIBIAAM4GACATAADPBgAgiwIAAIAEACAS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_ACABAABHADACAAABACADAAAAPwAgAQAARwAwAgAAAQAgFgUAAMUGACANAADGBgAgFwAAwwYAIBgAAMQGACCEAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAZ4CAAAA4gICswIBAAAAAdICAQAAAAHTAgEAAAAB1wIBAAAAAdgCAQAAAAHZAgEAAAAB2gIBAAAAAdsCAQAAAAHdAgAAAN0CAt4CIAAAAAHgAgAAAOACAuICIAAAAAEBHgAASwAgEoQCAQAAAAGKAiAAAAABiwJAAAAAAYwCQAAAAAGNAkAAAAABngIAAADiAgKzAgEAAAAB0gIBAAAAAdMCAQAAAAHXAgEAAAAB2AIBAAAAAdkCAQAAAAHaAgEAAAAB2wIBAAAAAd0CAAAA3QIC3gIgAAAAAeACAAAA4AIC4gIgAAAAAQEeAABNADABHgAATQAwFgUAAJ8GACANAACgBgAgFwAAnQYAIBgAAJ4GACCEAgEAhgQAIYoCIACJBAAhiwJAAIoEACGMAkAAiwQAIY0CQACLBAAhngIAAJwG4gIiswIBAIYEACHSAgEAhgQAIdMCAQCIBAAh1wIBAIgEACHYAgEAiAQAIdkCAQCIBAAh2gIBAIYEACHbAgEAiAQAId0CAACaBt0CIt4CIACJBAAh4AIAAJsG4AIi4gIgAIkEACECAAAAAQAgHgAAUAAgEoQCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACGeAgAAnAbiAiKzAgEAhgQAIdICAQCGBAAh0wIBAIgEACHXAgEAiAQAIdgCAQCIBAAh2QIBAIgEACHaAgEAhgQAIdsCAQCIBAAh3QIAAJoG3QIi3gIgAIkEACHgAgAAmwbgAiLiAiAAiQQAIQIAAAA_ACAeAABSACACAAAAPwAgHgAAUgAgAwAAAAEAICUAAEsAICYAAFAAIAEAAAABACABAAAAPwAgCQgAAJcGACArAACZBgAgLAAAmAYAIIsCAACABAAg0wIAAIAEACDXAgAAgAQAINgCAACABAAg2QIAAIAEACDbAgAAgAQAIBWBAgAAzgMAMIICAABZABCDAgAAzgMAMIQCAQCGAwAhigIgAIkDACGLAkAAigMAIYwCQACLAwAhjQJAAIsDACGeAgAA0QPiAiKzAgEAhgMAIdICAQCGAwAh0wIBAIgDACHXAgEAiAMAIdgCAQCIAwAh2QIBAIgDACHaAgEAhgMAIdsCAQCIAwAh3QIAAM8D3QIi3gIgAIkDACHgAgAA0APgAiLiAiAAiQMAIQMAAAA_ACABAABYADAqAABZACADAAAAPwAgAQAARwAwAgAAAQAgEAQAAMYDACAJAADMAwAgCgAAuAMAIBQAAM0DACCBAgAAywMAMIICAABBABCDAgAAywMAMIQCAQAAAAGKAiAAtQMAIYsCQAC2AwAhjAJAALcDACGNAkAAtwMAIbMCAQCzAwAhywIBAAAAAdICAQAAAAHWAgEAtAMAIQEAAABcACABAAAAXAAgBgQAAOUFACAJAACVBgAgCgAAlwUAIBQAAJYGACCLAgAAgAQAINYCAACABAAgAwAAAEEAIAEAAF8AMAIAAFwAIAMAAABBACABAABfADACAABcACADAAAAQQAgAQAAXwAwAgAAXAAgDQQAAJEGACAJAACSBgAgCgAAkwYAIBQAAJQGACCEAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAbMCAQAAAAHLAgEAAAAB0gIBAAAAAdYCAQAAAAEBHgAAYwAgCYQCAQAAAAGKAiAAAAABiwJAAAAAAYwCQAAAAAGNAkAAAAABswIBAAAAAcsCAQAAAAHSAgEAAAAB1gIBAAAAAQEeAABlADABHgAAZQAwDQQAAOwFACAJAADtBQAgCgAA7gUAIBQAAO8FACCEAgEAhgQAIYoCIACJBAAhiwJAAIoEACGMAkAAiwQAIY0CQACLBAAhswIBAIYEACHLAgEAhgQAIdICAQCGBAAh1gIBAIgEACECAAAAXAAgHgAAaAAgCYQCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACGzAgEAhgQAIcsCAQCGBAAh0gIBAIYEACHWAgEAiAQAIQIAAABBACAeAABqACACAAAAQQAgHgAAagAgAwAAAFwAICUAAGMAICYAAGgAIAEAAABcACABAAAAQQAgBQgAAOkFACArAADrBQAgLAAA6gUAIIsCAACABAAg1gIAAIAEACAMgQIAAMoDADCCAgAAcQAQgwIAAMoDADCEAgEAhgMAIYoCIACJAwAhiwJAAIoDACGMAkAAiwMAIY0CQACLAwAhswIBAIYDACHLAgEAhgMAIdICAQCGAwAh1gIBAIgDACEDAAAAQQAgAQAAcAAwKgAAcQAgAwAAAEEAIAEAAF8AMAIAAFwAIBIEAADGAwAgDAAAxwMAIBAAAMgDACARAADJAwAggQIAAMUDADCCAgAAJwAQgwIAAMUDADCEAgEAAAABigIgALUDACGLAkAAtgMAIYwCQAC3AwAhjQJAALcDACGzAgEAswMAIcsCAQAAAAHSAgEAAAAB0wIBALQDACHUAgEAtAMAIdUCAQC0AwAhAQAAAHQAIAEAAAB0ACAIBAAA5QUAIAwAAOYFACAQAADnBQAgEQAA6AUAIIsCAACABAAg0wIAAIAEACDUAgAAgAQAINUCAACABAAgAwAAACcAIAEAAHcAMAIAAHQAIAMAAAAnACABAAB3ADACAAB0ACADAAAAJwAgAQAAdwAwAgAAdAAgDwQAAOEFACAMAADiBQAgEAAA4wUAIBEAAOQFACCEAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAbMCAQAAAAHLAgEAAAAB0gIBAAAAAdMCAQAAAAHUAgEAAAAB1QIBAAAAAQEeAAB7ACALhAIBAAAAAYoCIAAAAAGLAkAAAAABjAJAAAAAAY0CQAAAAAGzAgEAAAABywIBAAAAAdICAQAAAAHTAgEAAAAB1AIBAAAAAdUCAQAAAAEBHgAAfQAwAR4AAH0AMA8EAAC8BQAgDAAAvQUAIBAAAL4FACARAAC_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_AgKzAgEAAAABuwIBAAAAAbwCQAAAAAG9AkAAAAABvwIBAAAAAQEeAAC_AQAgC4QCAQAAAAGKAiAAAAABiwJAAAAAAYwCQAAAAAGNAkAAAAABngIAAAC_AgKzAgEAAAABuwIBAAAAAbwCQAAAAAG9AkAAAAABvwIBAAAAAQEeAADBAQAwAR4AAMEBADAMBgAAnAUAIIQCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACGeAgAAmwW_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_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_AiKzAgEAhgMAIbsCAQCIAwAhvAJAAIoDACG9AkAAigMAIb8CAQCGAwAhBwgAAI0DACArAAC8AwAgLAAAvAMAII4CAAAAvwICjwIAAAC_AgiQAgAAAL8CCJUCAAC7A78CIgcIAACNAwAgKwAAvAMAICwAALwDACCOAgAAAL8CAo8CAAAAvwIIkAIAAAC_AgiVAgAAuwO_AiIEjgIAAAC_AgKPAgAAAL8CCJACAAAAvwIIlQIAALwDvwIiDYECAAC9AwAwggIAALcBABCDAgAAvQMAMIQCAQCGAwAhigIgAIkDACGLAkAAigMAIYwCQACLAwAhjQJAAIsDACGoAgEAhgMAIcACAQCGAwAhwQIBAIYDACHCAggAvgMAIcMCAQCIAwAhDQgAAJADACArAADAAwAgLAAAwAMAIG0AAMADACBuAADAAwAgjgIIAAAAAY8CCAAAAAWQAggAAAAFkQIIAAAAAZICCAAAAAGTAggAAAABlAIIAAAAAZUCCAC_AwAhDQgAAJADACArAADAAwAgLAAAwAMAIG0AAMADACBuAADAAwAgjgIIAAAAAY8CCAAAAAWQAggAAAAFkQIIAAAAAZICCAAAAAGTAggAAAABlAIIAAAAAZUCCAC_AwAhCI4CCAAAAAGPAggAAAAFkAIIAAAABZECCAAAAAGSAggAAAABkwIIAAAAAZQCCAAAAAGVAggAwAMAIQ-BAgAAwQMAMIICAAChAQAQgwIAAMEDADCEAgEAhgMAIYwCQACLAwAhjQJAAIsDACG0AgEAiAMAIcQCAQCGAwAhxQIBAIYDACHGAgEAiAMAIccCAADCAwAgyAIAAMIDACDJAgEAiAMAIcoCAQCIAwAhywIBAIgDACEPCAAAkAMAICsAAMMDACAsAADDAwAgjgKAAAAAAZECgAAAAAGSAoAAAAABkwKAAAAAAZQCgAAAAAGVAoAAAAABzAIBAAAAAc0CAQAAAAHOAgEAAAABzwKAAAAAAdACgAAAAAHRAoAAAAABDI4CgAAAAAGRAoAAAAABkgKAAAAAAZMCgAAAAAGUAoAAAAABlQKAAAAAAcwCAQAAAAHNAgEAAAABzgIBAAAAAc8CgAAAAAHQAoAAAAAB0QKAAAAAAQ6BAgAAxAMAMIICAACJAQAQgwIAAMQDADCEAgEAhgMAIYoCIACJAwAhiwJAAIoDACGMAkAAiwMAIY0CQACLAwAhswIBAIYDACHLAgEAhgMAIdICAQCGAwAh0wIBAIgDACHUAgEAiAMAIdUCAQCIAwAhEgQAAMYDACAMAADHAwAgEAAAyAMAIBEAAMkDACCBAgAAxQMAMIICAAAnABCDAgAAxQMAMIQCAQCzAwAhigIgALUDACGLAkAAtgMAIYwCQAC3AwAhjQJAALcDACGzAgEAswMAIcsCAQCzAwAh0gIBALMDACHTAgEAtAMAIdQCAQC0AwAh1QIBALQDACEbBQAA3gMAIA0AAN8DACAXAADcAwAgGAAA3QMAIIECAADYAwAwggIAAD8AEIMCAADYAwAwhAIBALMDACGKAiAAtQMAIYsCQAC2AwAhjAJAALcDACGNAkAAtwMAIZ4CAADbA-ICIrMCAQCzAwAh0gIBALMDACHTAgEAtAMAIdcCAQC0AwAh2AIBALQDACHZAgEAtAMAIdoCAQCzAwAh2wIBALQDACHdAgAA2QPdAiLeAiAAtQMAIeACAADaA-ACIuICIAC1AwAh4wIAAD8AIOQCAAA_ACADuAIAABsAILkCAAAbACC6AgAAGwAgA7gCAAAfACC5AgAAHwAgugIAAB8AIAO4AgAAIwAguQIAACMAILoCAAAjACAMgQIAAMoDADCCAgAAcQAQgwIAAMoDADCEAgEAhgMAIYoCIACJAwAhiwJAAIoDACGMAkAAiwMAIY0CQACLAwAhswIBAIYDACHLAgEAhgMAIdICAQCGAwAh1gIBAIgDACEQBAAAxgMAIAkAAMwDACAKAAC4AwAgFAAAzQMAIIECAADLAwAwggIAAEEAEIMCAADLAwAwhAIBALMDACGKAiAAtQMAIYsCQAC2AwAhjAJAALcDACGNAkAAtwMAIbMCAQCzAwAhywIBALMDACHSAgEAswMAIdYCAQC0AwAhA7gCAAAIACC5AgAACAAgugIAAAgAIAO4AgAANAAguQIAADQAILoCAAA0ACAVgQIAAM4DADCCAgAAWQAQgwIAAM4DADCEAgEAhgMAIYoCIACJAwAhiwJAAIoDACGMAkAAiwMAIY0CQACLAwAhngIAANED4gIiswIBAIYDACHSAgEAhgMAIdMCAQCIAwAh1wIBAIgDACHYAgEAiAMAIdkCAQCIAwAh2gIBAIYDACHbAgEAiAMAId0CAADPA90CIt4CIACJAwAh4AIAANAD4AIi4gIgAIkDACEHCAAAjQMAICsAANcDACAsAADXAwAgjgIAAADdAgKPAgAAAN0CCJACAAAA3QIIlQIAANYD3QIiBwgAAI0DACArAADVAwAgLAAA1QMAII4CAAAA4AICjwIAAADgAgiQAgAAAOACCJUCAADUA-ACIgcIAACNAwAgKwAA0wMAICwAANMDACCOAgAAAOICAo8CAAAA4gIIkAIAAADiAgiVAgAA0gPiAiIHCAAAjQMAICsAANMDACAsAADTAwAgjgIAAADiAgKPAgAAAOICCJACAAAA4gIIlQIAANID4gIiBI4CAAAA4gICjwIAAADiAgiQAgAAAOICCJUCAADTA-ICIgcIAACNAwAgKwAA1QMAICwAANUDACCOAgAAAOACAo8CAAAA4AIIkAIAAADgAgiVAgAA1APgAiIEjgIAAADgAgKPAgAAAOACCJACAAAA4AIIlQIAANUD4AIiBwgAAI0DACArAADXAwAgLAAA1wMAII4CAAAA3QICjwIAAADdAgiQAgAAAN0CCJUCAADWA90CIgSOAgAAAN0CAo8CAAAA3QIIkAIAAADdAgiVAgAA1wPdAiIZBQAA3gMAIA0AAN8DACAXAADcAwAgGAAA3QMAIIECAADYAwAwggIAAD8AEIMCAADYAwAwhAIBALMDACGKAiAAtQMAIYsCQAC2AwAhjAJAALcDACGNAkAAtwMAIZ4CAADbA-ICIrMCAQCzAwAh0gIBALMDACHTAgEAtAMAIdcCAQC0AwAh2AIBALQDACHZAgEAtAMAIdoCAQCzAwAh2wIBALQDACHdAgAA2QPdAiLeAiAAtQMAIeACAADaA-ACIuICIAC1AwAhBI4CAAAA3QICjwIAAADdAgiQAgAAAN0CCJUCAADXA90CIgSOAgAAAOACAo8CAAAA4AIIkAIAAADgAgiVAgAA1QPgAiIEjgIAAADiAgKPAgAAAOICCJACAAAA4gIIlQIAANMD4gIiA7gCAAADACC5AgAAAwAgugIAAAMAIAO4AgAAOwAguQIAADsAILoCAAA7ACASBAAAxgMAIAkAAMwDACAKAAC4AwAgFAAAzQMAIIECAADLAwAwggIAAEEAEIMCAADLAwAwhAIBALMDACGKAiAAtQMAIYsCQAC2AwAhjAJAALcDACGNAkAAtwMAIbMCAQCzAwAhywIBALMDACHSAgEAswMAIdYCAQC0AwAh4wIAAEEAIOQCAABBACAUBAAAxgMAIAwAAMcDACAQAADIAwAgEQAAyQMAIIECAADFAwAwggIAACcAEIMCAADFAwAwhAIBALMDACGKAiAAtQMAIYsCQAC2AwAhjAJAALcDACGNAkAAtwMAIbMCAQCzAwAhywIBALMDACHSAgEAswMAIdMCAQC0AwAh1AIBALQDACHVAgEAtAMAIeMCAAAnACDkAgAAJwAgEAQAAOIDACCBAgAA4AMAMIICAAA7ABCDAgAA4AMAMIQCAQCzAwAhjAJAALcDACGNAkAAtwMAIbQCAQC0AwAhxAIBALMDACHFAgEAswMAIcYCAQC0AwAhxwIAAOEDACDIAgAA4QMAIMkCAQC0AwAhygIBALQDACHLAgEAtAMAIQyOAoAAAAABkQKAAAAAAZICgAAAAAGTAoAAAAABlAKAAAAAAZUCgAAAAAHMAgEAAAABzQIBAAAAAc4CAQAAAAHPAoAAAAAB0AKAAAAAAdECgAAAAAEbBQAA3gMAIA0AAN8DACAXAADcAwAgGAAA3QMAIIECAADYAwAwggIAAD8AEIMCAADYAwAwhAIBALMDACGKAiAAtQMAIYsCQAC2AwAhjAJAALcDACGNAkAAtwMAIZ4CAADbA-ICIrMCAQCzAwAh0gIBALMDACHTAgEAtAMAIdcCAQC0AwAh2AIBALQDACHZAgEAtAMAIdoCAQCzAwAh2wIBALQDACHdAgAA2QPdAiLeAiAAtQMAIeACAADaA-ACIuICIAC1AwAh4wIAAD8AIOQCAAA_ACAPAwAA5QMAIAUAAOYDACCBAgAA4wMAMIICAAA0ABCDAgAA4wMAMIQCAQCzAwAhigIgALUDACGLAkAAtgMAIYwCQAC3AwAhjQJAALcDACGeAgAA5AOtAiKoAgEAswMAIakCAQC0AwAhqgIBALMDACGrAgEAtAMAIQSOAgAAAK0CAo8CAAAArQIIkAIAAACtAgiVAgAAqwOtAiISFQAA_wMAIBYAAMYDACCBAgAA_gMAMIICAAADABCDAgAA_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_AgEAswMAIQSOAgAAAL8CAo8CAAAAvwIIkAIAAAC_AgiVAgAAvAO_AiIRBQAA5gMAIAcAAP0DACCBAgAA-wMAMIICAAAIABCDAgAA-wMAMIQCAQCzAwAhigIgALUDACGLAkAAtgMAIYwCQAC3AwAhjQJAALcDACGoAgEAswMAIcACAQCzAwAhwQIBALMDACHCAggA_AMAIcMCAQC0AwAh4wIAAAgAIOQCAAAIACAPBQAA5gMAIAcAAP0DACCBAgAA-wMAMIICAAAIABCDAgAA-wMAMIQCAQCzAwAhigIgALUDACGLAkAAtgMAIYwCQAC3AwAhjQJAALcDACGoAgEAswMAIcACAQCzAwAhwQIBALMDACHCAggA_AMAIcMCAQC0AwAhCI4CCAAAAAGPAggAAAAFkAIIAAAABZECCAAAAAGSAggAAAABkwIIAAAAAZQCCAAAAAGVAggAwAMAIQO4AgAADAAguQIAAAwAILoCAAAMACAQFQAA_wMAIBYAAMYDACCBAgAA_gMAMIICAAADABCDAgAA_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_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-QYAICYAAIEHACDlAgAA-gYAIOYCAACABwAg6QIAANABACAFJQAA9wYAICYAAP4GACDlAgAA-AYAIOYCAAD9BgAg6QIAAFwAIAslAAD5BAAwJgAA_QQAMOUCAAD6BAAw5gIAAPsEADDnAgAAxgQAMOgCAADGBAAw6QIAAMYEADDqAgAA_AQAIOsCAADGBAAw7AIAAP4EADDtAgAAyQQAMAslAADwBAAwJgAA9AQAMOUCAADxBAAw5gIAAPIEADDnAgAAugQAMOgCAAC6BAAw6QIAALoEADDqAgAA8wQAIOsCAAC6BAAw7AIAAPUEADDtAgAAvQQAMAsNAACPBAAgDwAAkQQAIIQCAQAAAAGFAgIAAAABhgIBAAAAAYcCAQAAAAGJAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAQIAAAAhACAlAAD4BAAgAwAAACEAICUAAPgEACAmAAD3BAAgAR4AAPwGADACAAAAIQAgHgAA9wQAIAIAAAC-BAAgHgAA9gQAIAmEAgEAhgQAIYUCAgCHBAAhhgIBAIgEACGHAgEAhgQAIYkCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACELDQAAjAQAIA8AAI4EACCEAgEAhgQAIYUCAgCHBAAhhgIBAIgEACGHAgEAhgQAIYkCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACELDQAAjwQAIA8AAJEEACCEAgEAAAABhQICAAAAAYYCAQAAAAGHAgEAAAABiQIBAAAAAYoCIAAAAAGLAkAAAAABjAJAAAAAAY0CQAAAAAEJDwAApQQAIIQCAQAAAAGJAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAaICCAAAAAGjAgIAAAABAgAAABkAICUAAIEFACADAAAAGQAgJQAAgQUAICYAAIAFACABHgAA-wYAMAIAAAAZACAeAACABQAgAgAAAMoEACAeAAD_BAAgCIQCAQCGBAAhiQIBAIYEACGKAiAAiQQAIYsCQACKBAAhjAJAAIsEACGNAkAAiwQAIaICCACiBAAhowICAIcEACEJDwAAowQAIIQCAQCGBAAhiQIBAIYEACGKAiAAiQQAIYsCQACKBAAhjAJAAIsEACGNAkAAiwQAIaICCACiBAAhowICAIcEACEJDwAApQQAIIQCAQAAAAGJAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAaICCAAAAAGjAgIAAAABAyUAAPkGACDlAgAA-gYAIOkCAADQAQAgAyUAAPcGACDlAgAA-AYAIOkCAABcACAEJQAA-QQAMOUCAAD6BAAw6QIAAMYEADDqAgAA_AQAIAQlAADwBAAw5QIAAPEEADDpAgAAugQAMOoCAADzBAAgAAAACyUAAIoFADAmAACPBQAw5QIAAIsFADDmAgAAjAUAMOcCAACOBQAw6AIAAI4FADDpAgAAjgUAMOoCAACNBQAg6wIAAI4FADDsAgAAkAUAMO0CAACRBQAwEAUAAIMFACAQAACFBQAgEgAAhAUAIIQCAQAAAAGKAiAAAAABiwJAAAAAAYwCQAAAAAGNAkAAAAABngIAAAC3AgKiAggAAAABowICAAAAAagCAQAAAAGrAgEAAAABswIBAAAAAbQCAQAAAAG1AgEAAAABAgAAABMAICUAAJUFACADAAAAEwAgJQAAlQUAICYAAJQFACABHgAA9gYAMBUFAADmAwAgCwAA9wMAIBAAAMgDACASAADxAwAggQIAAPUDADCCAgAAEQAQgwIAAPUDADCEAgEAAAABigIgALUDACGLAkAAtgMAIYwCQAC3AwAhjQJAALcDACGeAgAA9gO3AiKiAggA9AMAIaMCAgDoAwAhqAIBALMDACGrAgEAtAMAIbMCAQCzAwAhtAIBALQDACG1AgEAswMAIbcCAQCzAwAhAgAAABMAIB4AAJQFACACAAAAkgUAIB4AAJMFACARgQIAAJEFADCCAgAAkgUAEIMCAACRBQAwhAIBALMDACGKAiAAtQMAIYsCQAC2AwAhjAJAALcDACGNAkAAtwMAIZ4CAAD2A7cCIqICCAD0AwAhowICAOgDACGoAgEAswMAIasCAQC0AwAhswIBALMDACG0AgEAtAMAIbUCAQCzAwAhtwIBALMDACERgQIAAJEFADCCAgAAkgUAEIMCAACRBQAwhAIBALMDACGKAiAAtQMAIYsCQAC2AwAhjAJAALcDACGNAkAAtwMAIZ4CAAD2A7cCIqICCAD0AwAhowICAOgDACGoAgEAswMAIasCAQC0AwAhswIBALMDACG0AgEAtAMAIbUCAQCzAwAhtwIBALMDACENhAIBAIYEACGKAiAAiQQAIYsCQACKBAAhjAJAAIsEACGNAkAAiwQAIZ4CAADrBLcCIqICCACiBAAhowICAIcEACGoAgEAhgQAIasCAQCIBAAhswIBAIYEACG0AgEAiAQAIbUCAQCGBAAhEAUAAO0EACAQAADvBAAgEgAA7gQAIIQCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACGeAgAA6wS3AiKiAggAogQAIaMCAgCHBAAhqAIBAIYEACGrAgEAiAQAIbMCAQCGBAAhtAIBAIgEACG1AgEAhgQAIRAFAACDBQAgEAAAhQUAIBIAAIQFACCEAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAZ4CAAAAtwICogIIAAAAAaMCAgAAAAGoAgEAAAABqwIBAAAAAbMCAQAAAAG0AgEAAAABtQIBAAAAAQQlAACKBQAw5QIAAIsFADDpAgAAjgUAMOoCAACNBQAgAAAAAAHrAgAAAL8CAgUlAADxBgAgJgAA9AYAIOUCAADyBgAg5gIAAPMGACDpAgAACgAgAyUAAPEGACDlAgAA8gYAIOkCAAAKACAAAAAAAAXrAggAAAAB7gIIAAAAAe8CCAAAAAHwAggAAAAB8QIIAAAAAQUlAADrBgAgJgAA7wYAIOUCAADsBgAg5gIAAO4GACDpAgAAXAAgCyUAAKYFADAmAACrBQAw5QIAAKcFADDmAgAAqAUAMOcCAACqBQAw6AIAAKoFADDpAgAAqgUAMOoCAACpBQAg6wIAAKoFADDsAgAArAUAMO0CAACtBQAwCoQCAQAAAAGKAiAAAAABiwJAAAAAAYwCQAAAAAGNAkAAAAABngIAAAC_AgKzAgEAAAABuwIBAAAAAbwCQAAAAAG9AkAAAAABAgAAAA4AICUAALEFACADAAAADgAgJQAAsQUAICYAALAFACABHgAA7QYAMA8GAAD6AwAggQIAAPgDADCCAgAADAAQgwIAAPgDADCEAgEAAAABigIgALUDACGLAkAAtgMAIYwCQAC3AwAhjQJAALcDACGeAgAA-QO_AiKzAgEAswMAIbsCAQC0AwAhvAJAALYDACG9AkAAtgMAIb8CAQCzAwAhAgAAAA4AIB4AALAFACACAAAArgUAIB4AAK8FACAOgQIAAK0FADCCAgAArgUAEIMCAACtBQAwhAIBALMDACGKAiAAtQMAIYsCQAC2AwAhjAJAALcDACGNAkAAtwMAIZ4CAAD5A78CIrMCAQCzAwAhuwIBALQDACG8AkAAtgMAIb0CQAC2AwAhvwIBALMDACEOgQIAAK0FADCCAgAArgUAEIMCAACtBQAwhAIBALMDACGKAiAAtQMAIYsCQAC2AwAhjAJAALcDACGNAkAAtwMAIZ4CAAD5A78CIrMCAQCzAwAhuwIBALQDACG8AkAAtgMAIb0CQAC2AwAhvwIBALMDACEKhAIBAIYEACGKAiAAiQQAIYsCQACKBAAhjAJAAIsEACGNAkAAiwQAIZ4CAACbBb8CIrMCAQCGBAAhuwIBAIgEACG8AkAAigQAIb0CQACKBAAhCoQCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACGeAgAAmwW_AiKzAgEAhgQAIbsCAQCIBAAhvAJAAIoEACG9AkAAigQAIQqEAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAZ4CAAAAvwICswIBAAAAAbsCAQAAAAG8AkAAAAABvQJAAAAAAQMlAADrBgAg5QIAAOwGACDpAgAAXAAgBCUAAKYFADDlAgAApwUAMOkCAACqBQAw6gIAAKkFACAAAAAHJQAA5gYAICYAAOkGACDlAgAA5wYAIOYCAADoBgAg5wIAAD8AIOgCAAA_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_AUAMCYAAIAGADDlAgAA_QUAMOYCAAD-BQAw5wIAAI4FADDoAgAAjgUAMOkCAACOBQAw6gIAAP8FACDrAgAAjgUAMOwCAACBBgAw7QIAAJEFADALJQAA8AUAMCYAAPUFADDlAgAA8QUAMOYCAADyBQAw5wIAAPQFADDoAgAA9AUAMOkCAAD0BQAw6gIAAPMFACDrAgAA9AUAMOwCAAD2BQAw7QIAAPcFADAKAwAA3wQAIIQCAQAAAAGKAiAAAAABiwJAAAAAAYwCQAAAAAGNAkAAAAABngIAAACtAgKpAgEAAAABqgIBAAAAAasCAQAAAAECAAAANgAgJQAA-wUAIAMAAAA2ACAlAAD7BQAgJgAA-gUAIAEeAADaBgAwDwMAAOUDACAFAADmAwAggQIAAOMDADCCAgAANAAQgwIAAOMDADCEAgEAAAABigIgALUDACGLAkAAtgMAIYwCQAC3AwAhjQJAALcDACGeAgAA5AOtAiKoAgEAswMAIakCAQC0AwAhqgIBALMDACGrAgEAtAMAIQIAAAA2ACAeAAD6BQAgAgAAAPgFACAeAAD5BQAgDYECAAD3BQAwggIAAPgFABCDAgAA9wUAMIQCAQCzAwAhigIgALUDACGLAkAAtgMAIYwCQAC3AwAhjQJAALcDACGeAgAA5AOtAiKoAgEAswMAIakCAQC0AwAhqgIBALMDACGrAgEAtAMAIQ2BAgAA9wUAMIICAAD4BQAQgwIAAPcFADCEAgEAswMAIYoCIAC1AwAhiwJAALYDACGMAkAAtwMAIY0CQAC3AwAhngIAAOQDrQIiqAIBALMDACGpAgEAtAMAIaoCAQCzAwAhqwIBALQDACEJhAIBAIYEACGKAiAAiQQAIYsCQACKBAAhjAJAAIsEACGNAkAAiwQAIZ4CAADVBK0CIqkCAQCIBAAhqgIBAIYEACGrAgEAiAQAIQoDAADWBAAghAIBAIYEACGKAiAAiQQAIYsCQACKBAAhjAJAAIsEACGNAkAAiwQAIZ4CAADVBK0CIqkCAQCIBAAhqgIBAIYEACGrAgEAiAQAIQoDAADfBAAghAIBAAAAAYoCIAAAAAGLAkAAAAABjAJAAAAAAY0CQAAAAAGeAgAAAK0CAqkCAQAAAAGqAgEAAAABqwIBAAAAARALAACCBQAgEAAAhQUAIBIAAIQFACCEAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAZ4CAAAAtwICogIIAAAAAaMCAgAAAAGrAgEAAAABswIBAAAAAbQCAQAAAAG1AgEAAAABtwIBAAAAAQIAAAATACAlAACEBgAgAwAAABMAICUAAIQGACAmAACDBgAgAR4AANkGADACAAAAEwAgHgAAgwYAIAIAAACSBQAgHgAAggYAIA2EAgEAhgQAIYoCIACJBAAhiwJAAIoEACGMAkAAiwQAIY0CQACLBAAhngIAAOsEtwIiogIIAKIEACGjAgIAhwQAIasCAQCIBAAhswIBAIYEACG0AgEAiAQAIbUCAQCGBAAhtwIBAIYEACEQCwAA7AQAIBAAAO8EACASAADuBAAghAIBAIYEACGKAiAAiQQAIYsCQACKBAAhjAJAAIsEACGNAkAAiwQAIZ4CAADrBLcCIqICCACiBAAhowICAIcEACGrAgEAiAQAIbMCAQCGBAAhtAIBAIgEACG1AgEAhgQAIbcCAQCGBAAhEAsAAIIFACAQAACFBQAgEgAAhAUAIIQCAQAAAAGKAiAAAAABiwJAAAAAAYwCQAAAAAGNAkAAAAABngIAAAC3AgKiAggAAAABowICAAAAAasCAQAAAAGzAgEAAAABtAIBAAAAAbUCAQAAAAG3AgEAAAABCgcAALMFACCEAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAcACAQAAAAHBAgEAAAABwgIIAAAAAcMCAQAAAAECAAAACgAgJQAAkAYAIAMAAAAKACAlAACQBgAgJgAAjwYAIAEeAADYBgAwDwUAAOYDACAHAAD9AwAggQIAAPsDADCCAgAACAAQgwIAAPsDADCEAgEAAAABigIgALUDACGLAkAAtgMAIYwCQAC3AwAhjQJAALcDACGoAgEAswMAIcACAQCzAwAhwQIBALMDACHCAggA_AMAIcMCAQC0AwAhAgAAAAoAIB4AAI8GACACAAAAjQYAIB4AAI4GACANgQIAAIwGADCCAgAAjQYAEIMCAACMBgAwhAIBALMDACGKAiAAtQMAIYsCQAC2AwAhjAJAALcDACGNAkAAtwMAIagCAQCzAwAhwAIBALMDACHBAgEAswMAIcICCAD8AwAhwwIBALQDACENgQIAAIwGADCCAgAAjQYAEIMCAACMBgAwhAIBALMDACGKAiAAtQMAIYsCQAC2AwAhjAJAALcDACGNAkAAtwMAIagCAQCzAwAhwAIBALMDACHBAgEAswMAIcICCAD8AwAhwwIBALQDACEJhAIBAIYEACGKAiAAiQQAIYsCQACKBAAhjAJAAIsEACGNAkAAiwQAIcACAQCGBAAhwQIBAIYEACHCAggAowUAIcMCAQCIBAAhCgcAAKUFACCEAgEAhgQAIYoCIACJBAAhiwJAAIoEACGMAkAAiwQAIY0CQACLBAAhwAIBAIYEACHBAgEAhgQAIcICCACjBQAhwwIBAIgEACEKBwAAswUAIIQCAQAAAAGKAiAAAAABiwJAAAAAAYwCQAAAAAGNAkAAAAABwAIBAAAAAcECAQAAAAHCAggAAAABwwIBAAAAAQMlAADWBgAg5QIAANcGACDpAgAAAQAgBCUAAIUGADDlAgAAhgYAMOkCAACJBgAw6gIAAIgGACAEJQAA_AUAMOUCAAD9BQAw6QIAAI4FADDqAgAA_wUAIAQlAADwBQAw5QIAAPEFADDpAgAA9AUAMOoCAADzBQAgAAAAAAAB6wIAAADdAgIB6wIAAADgAgIB6wIAAADiAgILJQAAtwYAMCYAALwGADDlAgAAuAYAMOYCAAC5BgAw5wIAALsGADDoAgAAuwYAMOkCAAC7BgAw6gIAALoGACDrAgAAuwYAMOwCAAC9BgAw7QIAAL4GADALJQAAqwYAMCYAALAGADDlAgAArAYAMOYCAACtBgAw5wIAAK8GADDoAgAArwYAMOkCAACvBgAw6gIAAK4GACDrAgAArwYAMOwCAACxBgAw7QIAALIGADAHJQAApgYAICYAAKkGACDlAgAApwYAIOYCAACoBgAg5wIAAEEAIOgCAABBACDpAgAAXAAgByUAAKEGACAmAACkBgAg5QIAAKIGACDmAgAAowYAIOcCAAAnACDoAgAAJwAg6QIAAHQAIA0MAADiBQAgEAAA4wUAIBEAAOQFACCEAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAbMCAQAAAAHSAgEAAAAB0wIBAAAAAdQCAQAAAAHVAgEAAAABAgAAAHQAICUAAKEGACADAAAAJwAgJQAAoQYAICYAAKUGACAPAAAAJwAgDAAAvQUAIBAAAL4FACARAAC_BQAgHgAApQYAIIQCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACGzAgEAhgQAIdICAQCGBAAh0wIBAIgEACHUAgEAiAQAIdUCAQCIBAAhDQwAAL0FACAQAAC-BQAgEQAAvwUAIIQCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACGzAgEAhgQAIdICAQCGBAAh0wIBAIgEACHUAgEAiAQAIdUCAQCIBAAhCwkAAJIGACAKAACTBgAgFAAAlAYAIIQCAQAAAAGKAiAAAAABiwJAAAAAAYwCQAAAAAGNAkAAAAABswIBAAAAAdICAQAAAAHWAgEAAAABAgAAAFwAICUAAKYGACADAAAAQQAgJQAApgYAICYAAKoGACANAAAAQQAgCQAA7QUAIAoAAO4FACAUAADvBQAgHgAAqgYAIIQCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACGzAgEAhgQAIdICAQCGBAAh1gIBAIgEACELCQAA7QUAIAoAAO4FACAUAADvBQAghAIBAIYEACGKAiAAiQQAIYsCQACKBAAhjAJAAIsEACGNAkAAiwQAIbMCAQCGBAAh0gIBAIYEACHWAgEAiAQAIQuEAgEAAAABjAJAAAAAAY0CQAAAAAG0AgEAAAABxAIBAAAAAcUCAQAAAAHGAgEAAAABxwKAAAAAAcgCgAAAAAHJAgEAAAABygIBAAAAAQIAAAA9ACAlAAC2BgAgAwAAAD0AICUAALYGACAmAAC1BgAgAR4AANUGADAQBAAA4gMAIIECAADgAwAwggIAADsAEIMCAADgAwAwhAIBAAAAAYwCQAC3AwAhjQJAALcDACG0AgEAtAMAIcQCAQCzAwAhxQIBALMDACHGAgEAtAMAIccCAADhAwAgyAIAAOEDACDJAgEAtAMAIcoCAQC0AwAhywIBALQDACECAAAAPQAgHgAAtQYAIAIAAACzBgAgHgAAtAYAIA-BAgAAsgYAMIICAACzBgAQgwIAALIGADCEAgEAswMAIYwCQAC3AwAhjQJAALcDACG0AgEAtAMAIcQCAQCzAwAhxQIBALMDACHGAgEAtAMAIccCAADhAwAgyAIAAOEDACDJAgEAtAMAIcoCAQC0AwAhywIBALQDACEPgQIAALIGADCCAgAAswYAEIMCAACyBgAwhAIBALMDACGMAkAAtwMAIY0CQAC3AwAhtAIBALQDACHEAgEAswMAIcUCAQCzAwAhxgIBALQDACHHAgAA4QMAIMgCAADhAwAgyQIBALQDACHKAgEAtAMAIcsCAQC0AwAhC4QCAQCGBAAhjAJAAIsEACGNAkAAiwQAIbQCAQCIBAAhxAIBAIYEACHFAgEAhgQAIcYCAQCIBAAhxwKAAAAAAcgCgAAAAAHJAgEAiAQAIcoCAQCIBAAhC4QCAQCGBAAhjAJAAIsEACGNAkAAiwQAIbQCAQCIBAAhxAIBAIYEACHFAgEAhgQAIcYCAQCIBAAhxwKAAAAAAcgCgAAAAAHJAgEAiAQAIcoCAQCIBAAhC4QCAQAAAAGMAkAAAAABjQJAAAAAAbQCAQAAAAHEAgEAAAABxQIBAAAAAcYCAQAAAAHHAoAAAAAByAKAAAAAAckCAQAAAAHKAgEAAAABCxUAAOUEACCEAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAa0CAQAAAAGuAgEAAAABrwIBAAAAAbACAQAAAAGxAgEAAAABAgAAAAUAICUAAMIGACADAAAABQAgJQAAwgYAICYAAMEGACABHgAA1AYAMBAVAAD_AwAgFgAAxgMAIIECAAD-AwAwggIAAAMAEIMCAAD-AwAwhAIBAAAAAYoCIAC1AwAhiwJAALYDACGMAkAAtwMAIY0CQAC3AwAhrQIBALMDACGuAgEAswMAIa8CAQC0AwAhsAIBALQDACGxAgEAAAABsgIBALMDACECAAAABQAgHgAAwQYAIAIAAAC_BgAgHgAAwAYAIA6BAgAAvgYAMIICAAC_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_ACAlAADWBgAgJgAA3QYAIBcAAAA_ACANAACgBgAgFwAAnQYAIBgAAJ4GACAeAADdBgAghAIBAIYEACGKAiAAiQQAIYsCQACKBAAhjAJAAIsEACGNAkAAiwQAIZ4CAACcBuICIrMCAQCGBAAh0gIBAIYEACHTAgEAiAQAIdcCAQCIBAAh2AIBAIgEACHZAgEAiAQAIdoCAQCGBAAh2wIBAIgEACHdAgAAmgbdAiLeAiAAiQQAIeACAACbBuACIuICIACJBAAhFQ0AAKAGACAXAACdBgAgGAAAngYAIIQCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACGeAgAAnAbiAiKzAgEAhgQAIdICAQCGBAAh0wIBAIgEACHXAgEAiAQAIdgCAQCIBAAh2QIBAIgEACHaAgEAhgQAIdsCAQCIBAAh3QIAAJoG3QIi3gIgAIkEACHgAgAAmwbgAiLiAiAAiQQAIRUFAADFBgAgFwAAwwYAIBgAAMQGACCEAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAZ4CAAAA4gICswIBAAAAAdICAQAAAAHTAgEAAAAB1wIBAAAAAdgCAQAAAAHZAgEAAAAB2gIBAAAAAdsCAQAAAAHdAgAAAN0CAt4CIAAAAAHgAgAAAOACAuICIAAAAAECAAAAAQAgJQAA3gYAIAqEAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAZ4CAAAAqAICpAIBAAAAAaUCAgAAAAGmAgEAAAABqAIBAAAAAQmEAgEAAAABhQICAAAAAYYCAQAAAAGIAgEAAAABiQIBAAAAAYoCIAAAAAGLAkAAAAABjAJAAAAAAY0CQAAAAAELhAIBAAAAAYkCAQAAAAGMAkAAAAABjQJAAAAAAZkCAgAAAAGaAgEAAAABnAIAAACcAgKeAgAAAJ4CAp8CAQAAAAGgAgEAAAABoQJAAAAAAQMAAAA_ACAlAADeBgAgJgAA5QYAIBcAAAA_ACAFAACfBgAgFwAAnQYAIBgAAJ4GACAeAADlBgAghAIBAIYEACGKAiAAiQQAIYsCQACKBAAhjAJAAIsEACGNAkAAiwQAIZ4CAACcBuICIrMCAQCGBAAh0gIBAIYEACHTAgEAiAQAIdcCAQCIBAAh2AIBAIgEACHZAgEAiAQAIdoCAQCGBAAh2wIBAIgEACHdAgAAmgbdAiLeAiAAiQQAIeACAACbBuACIuICIACJBAAhFQUAAJ8GACAXAACdBgAgGAAAngYAIIQCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACGeAgAAnAbiAiKzAgEAhgQAIdICAQCGBAAh0wIBAIgEACHXAgEAiAQAIdgCAQCIBAAh2QIBAIgEACHaAgEAhgQAIdsCAQCIBAAh3QIAAJoG3QIi3gIgAIkEACHgAgAAmwbgAiLiAiAAiQQAIRUFAADFBgAgDQAAxgYAIBcAAMMGACCEAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAZ4CAAAA4gICswIBAAAAAdICAQAAAAHTAgEAAAAB1wIBAAAAAdgCAQAAAAHZAgEAAAAB2gIBAAAAAdsCAQAAAAHdAgAAAN0CAt4CIAAAAAHgAgAAAOACAuICIAAAAAECAAAAAQAgJQAA5gYAIAMAAAA_ACAlAADmBgAgJgAA6gYAIBcAAAA_ACAFAACfBgAgDQAAoAYAIBcAAJ0GACAeAADqBgAghAIBAIYEACGKAiAAiQQAIYsCQACKBAAhjAJAAIsEACGNAkAAiwQAIZ4CAACcBuICIrMCAQCGBAAh0gIBAIYEACHTAgEAiAQAIdcCAQCIBAAh2AIBAIgEACHZAgEAiAQAIdoCAQCGBAAh2wIBAIgEACHdAgAAmgbdAiLeAiAAiQQAIeACAACbBuACIuICIACJBAAhFQUAAJ8GACANAACgBgAgFwAAnQYAIIQCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACGeAgAAnAbiAiKzAgEAhgQAIdICAQCGBAAh0wIBAIgEACHXAgEAiAQAIdgCAQCIBAAh2QIBAIgEACHaAgEAhgQAIdsCAQCIBAAh3QIAAJoG3QIi3gIgAIkEACHgAgAAmwbgAiLiAiAAiQQAIQwEAACRBgAgCgAAkwYAIBQAAJQGACCEAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAbMCAQAAAAHLAgEAAAAB0gIBAAAAAdYCAQAAAAECAAAAXAAgJQAA6wYAIAqEAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAZ4CAAAAvwICswIBAAAAAbsCAQAAAAG8AkAAAAABvQJAAAAAAQMAAABBACAlAADrBgAgJgAA8AYAIA4AAABBACAEAADsBQAgCgAA7gUAIBQAAO8FACAeAADwBgAghAIBAIYEACGKAiAAiQQAIYsCQACKBAAhjAJAAIsEACGNAkAAiwQAIbMCAQCGBAAhywIBAIYEACHSAgEAhgQAIdYCAQCIBAAhDAQAAOwFACAKAADuBQAgFAAA7wUAIIQCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACGzAgEAhgQAIcsCAQCGBAAh0gIBAIYEACHWAgEAiAQAIQsFAACyBQAghAIBAAAAAYoCIAAAAAGLAkAAAAABjAJAAAAAAY0CQAAAAAGoAgEAAAABwAIBAAAAAcECAQAAAAHCAggAAAABwwIBAAAAAQIAAAAKACAlAADxBgAgAwAAAAgAICUAAPEGACAmAAD1BgAgDQAAAAgAIAUAAKQFACAeAAD1BgAghAIBAIYEACGKAiAAiQQAIYsCQACKBAAhjAJAAIsEACGNAkAAiwQAIagCAQCGBAAhwAIBAIYEACHBAgEAhgQAIcICCACjBQAhwwIBAIgEACELBQAApAUAIIQCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACGoAgEAhgQAIcACAQCGBAAhwQIBAIYEACHCAggAowUAIcMCAQCIBAAhDYQCAQAAAAGKAiAAAAABiwJAAAAAAYwCQAAAAAGNAkAAAAABngIAAAC3AgKiAggAAAABowICAAAAAagCAQAAAAGrAgEAAAABswIBAAAAAbQCAQAAAAG1AgEAAAABDAQAAJEGACAJAACSBgAgFAAAlAYAIIQCAQAAAAGKAiAAAAABiwJAAAAAAYwCQAAAAAGNAkAAAAABswIBAAAAAcsCAQAAAAHSAgEAAAAB1gIBAAAAAQIAAABcACAlAAD3BgAgCIQCAQAAAAGKAiAAAAABiwJAAAAAAYwCQAAAAAGNAkAAAAABqwIBAAAAAbMCAQAAAAG0AgEAAAABAgAAANABACAlAAD5BgAgCIQCAQAAAAGJAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAaICCAAAAAGjAgIAAAABCYQCAQAAAAGFAgIAAAABhgIBAAAAAYcCAQAAAAGJAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAQMAAABBACAlAAD3BgAgJgAA_wYAIA4AAABBACAEAADsBQAgCQAA7QUAIBQAAO8FACAeAAD_BgAghAIBAIYEACGKAiAAiQQAIYsCQACKBAAhjAJAAIsEACGNAkAAiwQAIbMCAQCGBAAhywIBAIYEACHSAgEAhgQAIdYCAQCIBAAhDAQAAOwFACAJAADtBQAgFAAA7wUAIIQCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACGzAgEAhgQAIcsCAQCGBAAh0gIBAIYEACHWAgEAiAQAIQMAAADTAQAgJQAA-QYAICYAAIIHACAKAAAA0wEAIB4AAIIHACCEAgEAhgQAIYoCIACJBAAhiwJAAIoEACGMAkAAiwQAIY0CQACLBAAhqwIBAIgEACGzAgEAhgQAIbQCAQCIBAAhCIQCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACGrAgEAiAQAIbMCAQCGBAAhtAIBAIgEACELBQAA4AQAIIQCAQAAAAGKAiAAAAABiwJAAAAAAYwCQAAAAAGNAkAAAAABngIAAACtAgKoAgEAAAABqQIBAAAAAaoCAQAAAAGrAgEAAAABAgAAADYAICUAAIMHACADAAAANAAgJQAAgwcAICYAAIcHACANAAAANAAgBQAA1wQAIB4AAIcHACCEAgEAhgQAIYoCIACJBAAhiwJAAIoEACGMAkAAiwQAIY0CQACLBAAhngIAANUErQIiqAIBAIYEACGpAgEAiAQAIaoCAQCGBAAhqwIBAIgEACELBQAA1wQAIIQCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACGeAgAA1QStAiKoAgEAhgQAIakCAQCIBAAhqgIBAIYEACGrAgEAiAQAIQwEAACRBgAgCQAAkgYAIAoAAJMGACCEAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAbMCAQAAAAHLAgEAAAAB0gIBAAAAAdYCAQAAAAECAAAAXAAgJQAAiAcAIBUFAADFBgAgDQAAxgYAIBgAAMQGACCEAgEAAAABigIgAAAAAYsCQAAAAAGMAkAAAAABjQJAAAAAAZ4CAAAA4gICswIBAAAAAdICAQAAAAHTAgEAAAAB1wIBAAAAAdgCAQAAAAHZAgEAAAAB2gIBAAAAAdsCAQAAAAHdAgAAAN0CAt4CIAAAAAHgAgAAAOACAuICIAAAAAECAAAAAQAgJQAAigcAIAMAAAA_ACAlAACKBwAgJgAAjgcAIBcAAAA_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_BQAgHgAAuwcAIIQCAQCGBAAhigIgAIkEACGLAkAAigQAIYwCQACLBAAhjQJAAIsEACGzAgEAhgQAIcsCAQCGBAAh0gIBAIYEACHTAgEAiAQAIdQCAQCIBAAh1QIBAIgEACEOBAAAvAUAIAwAAL0FACARAAC_BQAghAIBAIYEACGKAiAAiQQAIYsCQACKBAAhjAJAAIsEACGNAkAAiwQAIbMCAQCGBAAhywIBAIYEACHSAgEAhgQAIdMCAQCIBAAh1AIBAIgEACHVAgEAiAQAIQUFQgQIABUNQw0XBgIYPhQCFQADFgABAgMHAgUABAUEAAEIABMJCwUKFAgUNwMDBQAEBw8GCAAHAQYABQEHEAAFBQAECAASCwAJEDEOEhoLAggACgoVCAEKFgACDgAIDwAMBQgAEQ0ADRAtDhIsCxMuDwUEAAEIABAMHgwQIg4RJg8DDQANDgAIDwAMAg0oDQ8ADAMMKQAQKgARKwACEDAAEi8AAhAzABIyAAMJOAAKOQAUOgABBEABAhdEABhFAAAAAAMIABorABssABwAAAADCAAaKwAbLAAcAQQAAQEEAAEDCAAhKwAiLAAjAAAAAwgAISsAIiwAIwEEAAEBBAABAwgAKCsAKSwAKgAAAAMIACgrACksACoBBJYBAQEEnAEBAwgALysAMCwAMQAAAAMIAC8rADAsADEBBQAEAQUABAUIADYrADksADptADduADgAAAAAAAUIADYrADksADptADduADgBBgAFAQYABQMIAD8rAEAsAEEAAAADCAA_KwBALABBAAADCABGKwBHLABIAAAAAwgARisARywASAIFAAQLAAkCBQAECwAJBQgATSsAUCwAUW0ATm4ATwAAAAAABQgATSsAUCwAUW0ATm4ATwIVAAMWAAECFQADFgABAwgAVisAVywAWAAAAAMIAFYrAFcsAFgBBQAEAQUABAMIAF0rAF4sAF8AAAADCABdKwBeLABfAQ0ADQENAA0FCABkKwBnLABobQBlbgBmAAAAAAAFCABkKwBnLABobQBlbgBmAg4ACA8ADAIOAAgPAAwFCABtKwBwLABxbQBubgBvAAAAAAAFCABtKwBwLABxbQBubgBvAg3hAg0PAAwCDecCDQ8ADAUIAHYrAHksAHptAHduAHgAAAAAAAUIAHYrAHksAHptAHduAHgDDQANDgAIDwAMAw0ADQ4ACA8ADAUIAH8rAIIBLACDAW0AgAFuAIEBAAAAAAAFCAB_KwCCASwAgwFtAIABbgCBARkCARpGARtIARxJAR1KAR9MASBOFiFPFyJRASNTFiRUGCdVAShWASlXFi1aGS5bHS9dBDBeBDFgBDJhBDNiBDRkBDVmFjZnHjdpBDhrFjlsHzptBDtuBDxvFj1yID5zJD91DUB2DUF4DUJ5DUN6DUR8DUV-FkZ_JUeBAQ1IgwEWSYQBJkqFAQ1LhgENTIcBFk2KASdOiwErT4wBFFCNARRRjgEUUo8BFFOQARRUkgEUVZQBFlaVASxXmAEUWJoBFlmbAS1anQEUW54BFFyfARZdogEuXqMBMl-kAQVgpQEFYaYBBWKnAQVjqAEFZKoBBWWsARZmrQEzZ68BBWixARZpsgE0arMBBWu0AQVstQEWb7gBNXC5ATtxugEGcrsBBnO8AQZ0vQEGdb4BBnbAAQZ3wgEWeMMBPHnFAQZ6xwEWe8gBPXzJAQZ9ygEGfssBFn_OAT6AAc8BQoEB0QEJggHSAQmDAdUBCYQB1gEJhQHXAQmGAdkBCYcB2wEWiAHcAUOJAd4BCYoB4AEWiwHhAUSMAeIBCY0B4wEJjgHkARaPAecBRZAB6AFJkQHpAQiSAeoBCJMB6wEIlAHsAQiVAe0BCJYB7wEIlwHxARaYAfIBSpkB9AEImgH2ARabAfcBS5wB-AEInQH5AQieAfoBFp8B_QFMoAH-AVKhAf8BAqIBgAICowGBAgKkAYICAqUBgwICpgGFAgKnAYcCFqgBiAJTqQGKAgKqAYwCFqsBjQJUrAGOAgKtAY8CAq4BkAIWrwGTAlWwAZQCWbEBlQIDsgGWAgOzAZcCA7QBmAIDtQGZAgO2AZsCA7cBnQIWuAGeAlq5AaACA7oBogIWuwGjAlu8AaQCA70BpQIDvgGmAha_AakCXMABqgJgwQGrAgzCAawCDMMBrQIMxAGuAgzFAa8CDMYBsQIMxwGzAhbIAbQCYckBtgIMygG4AhbLAbkCYswBugIMzQG7AgzOAbwCFs8BvwJj0AHAAmnRAcECC9IBwgIL0wHDAgvUAcQCC9UBxQIL1gHHAgvXAckCFtgBygJq2QHMAgvaAc4CFtsBzwJr3AHQAgvdAdECC94B0gIW3wHVAmzgAdYCcuEB1wIP4gHYAg_jAdkCD-QB2gIP5QHbAg_mAd0CD-cB3wIW6AHgAnPpAeMCD-oB5QIW6wHmAnTsAegCD-0B6QIP7gHqAhbvAe0CdfAB7gJ78QHvAg7yAfACDvMB8QIO9AHyAg71AfMCDvYB9QIO9wH3Ahb4AfgCfPkB-gIO-gH8Ahb7Af0CffwB_gIO_QH_Ag7-AYADFv8BgwN-gAKEA4QB"
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
  AuditLog: "AuditLog",
  Farm: "Farm",
  Crop: "Crop",
  Category: "Category",
  Product: "Product",
  ExpertAdvice: "ExpertAdvice",
  Consultation: "Consultation",
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
    where: { email }
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

// src/app.ts
var app = express2();
app.use(
  cors({
    origin: config_default.frontend_url,
    credentials: true
  })
);
app.use(
  "/api/v1/payments/webhook",
  express2.raw({ type: "application/json" })
);
app.use(express2.json());
app.use(express2.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/admin", AdminRoutes);
app.use("/api/v1/audit-logs", AuditLogRoutes);
app.use("/api/v1/farms", FarmRoutes);
app.use("/api/v1/crops", CropRoutes);
app.use("/api/v1/orders", OrderRoutes);
app.use("/api/v1/payments", PaymentRoutes);
app.use("/api/v1/categories", CategoryRoutes);
app.use("/api/v1/products", ProductRoutes);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use(notFoundHandler);
app.use(globalErrorHandler);
var app_default = app;

// src/utils/seed.ts
import bcrypt2 from "bcryptjs";
import httpStatus9 from "http-status";
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
        httpStatus9.INTERNAL_SERVER_ERROR,
        "Super Admin Name , Email, Password Missing In Env File!!!"
      );
    }
    const hashedPassword = await bcrypt2.hash(
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
        httpStatus9.INTERNAL_SERVER_ERROR,
        "Tester Admin Name , Email, Password Missing In Env File!!!"
      );
    }
    const hashedPassword = await bcrypt2.hash(
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