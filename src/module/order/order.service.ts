import {prisma} from "../../lib/prisma";
import { ICreateOrder } from "./order.interface";
import {OrderStatus, Role} from "../../../generated/prisma/enums";

const createOrder = async (userId: string, payload: ICreateOrder) => {
    const buyer = await prisma.buyer.findUnique({
        where: { userId },
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
                where: { id: item.productId, isDeleted: false },
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

            // স্টক মাইনাস করা
            await tx.product.update({
                where: { id: product.id },
                data: {
                    quantity: product.quantity - item.quantity,
                    // যদি স্টক ০ হয়ে যায় তবে প্রোডাক্ট SOLD_OUT মার্ক করা
                    status: product.quantity - item.quantity === 0 ? "SOLD_OUT" : product.status,
                },
            });

            // অর্ডার আইটেমের ডেটা পুশ করা
            orderItemsData.push({
                productId: product.id,
                quantity: item.quantity,
                price: product.price,
            });
        }

        // ইউনিক অর্ডার নম্বর তৈরি করা
        const orderNumber = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

        // অর্ডার এবং অর্ডার আইটেম একসাথে তৈরি (Nested Creation)
        const newOrder = await tx.order.create({
            data: {
                orderNumber,
                totalAmount,
                deliveryAddress: payload.deliveryAddress,
                status: OrderStatus.PENDING,
                buyerId: buyer.id,
                farmerId: farmerIdForOrder,
                orderItems: {
                    create: orderItemsData,
                },
            },
            include: {
                orderItems: true,
            },
        });

        return newOrder;
    });

    return result;
};

const getMyOrders = async (userId: string) => {
    const buyer = await prisma.buyer.findUnique({ where: { userId } });
    if (!buyer) throw new Error("Buyer profile not found");

    return prisma.order.findMany({
        where: { buyerId: buyer.id },
        include: {
            orderItems: { include: { product: true } },
        },
        orderBy: { createdAt: "desc" },
    });
};

const getOrderById = async (id: string, userId: string, role: Role) => {
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            buyer: true,
            orderItems: { include: { product: true } },
        },
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

const updateOrderStatus = async (
    id: string,
    status: OrderStatus,
    queryUser: { userId: string; role: string }
) => {
    const { userId, role } = queryUser;

    const whereCondition: any = { id };

    if (role === 'FARMER') {
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
            orderItems: { include: { product: true } },
        },
    });

    return updatedOrder;
};


export const orderService = {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
};