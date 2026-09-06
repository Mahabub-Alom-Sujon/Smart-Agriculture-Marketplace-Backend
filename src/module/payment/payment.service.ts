import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import Stripe from "stripe";
import {OrderStatus, PaymentStatus} from "../../../generated/prisma/enums";
import {ICreatePaymentPayload} from "./payment.interface";
import config from '../../config';

const createPaymentSession = async (payload: ICreatePaymentPayload, userId: string) => {
    const { orderId } = payload;

    // ১. অর্ডারটি এক্সিস্ট করে কিনা এবং PENDING কিনা চেক করা
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

    // ২. স্ট্রাইপ চেকাউট সেশন তৈরি করা
    const lineItems = order.orderItems.map(item => ({
        price_data: {
            currency: 'bdt',
            product_data: {
                name: item.product.name,
            },
            unit_amount: item.price * 100, // স্ট্রাইপ পয়সা/সেন্টে হিসাব করে (১ টাকা = ১০০ পয়সা)
        },
        quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${config.frontend_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.frontend_url}/payment/cancel`,
        client_reference_id: orderId,
        customer_email: order.buyer.email || undefined, // আপনার বায়ার মডেলে ইমেইল থাকলে
    });

    // ৩. পেমেন্ট রেকর্ড ডেটাবেজে সেভ বা আপডেট করা
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

const handleWebhook = async (signature: string, rawBody: Buffer) => {
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            config.stripe_webhook_secret
        );
    } catch (err: any) {
        throw new Error(`Webhook Error: ${err.message}`);
    }

    // পেমেন্ট সফল হলে
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.client_reference_id;
        const stripePaymentIntentId = session.payment_intent as string;

        if (orderId) {
            // ট্রানজেকশনের মাধ্যমে পেমেন্ট ও অর্ডার আপডেট করা
            await prisma.$transaction(async (tx) => {
                await tx.payment.update({
                    where: { orderId },
                    data: {
                        status: PaymentStatus.PAID,
                        stripePaymentIntentId,
                        paidAt: new Date(),
                    }
                });

                await tx.order.update({
                    where: { id: orderId },
                    data: {
                        status: OrderStatus.COMPLETED // অথবা আপনার এনাম অনুযায়ী PAID / PREPARING
                    }
                });
            });
        }
    }

    return { received: true };
};

const getPaymentById = async (
    paymentId: string,
    userId: string,
    role: string
) => {
    const payment = await prisma.payment.findUnique({
        where: {
            id: paymentId,
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
                    createdAt: true,
                },
            },
        },
    });

    if (!payment) {
        throw new Error("Payment not found");
    }

    // Admin/Super Admin can see any payment
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
        return payment;
    }

    // Buyer can only see his own payment
    if (role === "BUYER") {
        // ১. userId দিয়ে বায়ারের প্রোফাইল আইডি (buyer.id) খুঁজে বের করা
        const buyer = await prisma.buyer.findUnique({
            where: { userId }
        });

        if (!buyer || payment.order.buyerId !== buyer.id) {
            throw new Error("You are not allowed to view this payment");
        }
        return payment;
    }

    // Farmer can only see payments for his orders
    if (role === "FARMER") {
        // ২. userId দিয়ে ফার্মারের প্রোফাইল আইডি (farmer.id) খুঁজে বের করা
        const farmer = await prisma.farmer.findUnique({
            where: { userId } // আপনার farmer মডেলে userId ইউনিক ইনডেক্স থাকতে হবে
        });

        if (!farmer || payment.order.farmerId !== farmer.id) {
            throw new Error("You are not allowed to view this payment");
        }
        return payment;
    }

    throw new Error("You are not allowed to view this payment");
};

export const paymentService = {
    createPaymentSession,
    handleWebhook,
    getPaymentById,
};