import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import { notFoundHandler } from "./middlewares/not-found";
import { globalErrorHandler } from "./middlewares/global-error";
import {AuthRoutes} from "./module/auth/auth.route";
import {CategoryRoutes} from "./module/category/category.route";
import {ProductRoutes} from "./module/product/product.route";
import {AdminRoutes} from "./module/admin/admin.route";
import {FarmRoutes} from "./module/farm/farm.route";
import {CropRoutes} from "./module/crop/crop.route";
import {OrderRoutes} from "./module/order/order.route";
import {PaymentRoutes} from "./module/payment/payment.route";

const app: Application = express();

app.use(
    cors({
        origin: config.frontend_url,
        credentials: true,
    }),
);

app.use(
    "/api/v1/payments/webhook",
    express.raw({ type: "application/json" })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/admin", AdminRoutes);
app.use("/api/v1/farms", FarmRoutes);
app.use("/api/v1/crops", CropRoutes);
app.use("/api/v1/orders", OrderRoutes);
app.use("/api/v1/payments", PaymentRoutes);
app.use("/api/v1/categories", CategoryRoutes);
app.use("/api/v1/products", ProductRoutes);
// 1. All your actual API Routes go here
app.get("/", (req: Request, res: Response) => {
    res.send("Hello, World!");
});

// 2. ⚠️ THE NOT FOUND MIDDLEWARE (Catches anything that didn't match above)
app.use(notFoundHandler);

// 3. Global Error Handler (Catches server crashes/thrown errors)
app.use(globalErrorHandler);

export default app;