import express, { Request, Response } from "express";
import { razorpay } from "../utilities/razorpayInstance";
import crypto from "crypto";
import { generateTransactionId } from "../utilities/generateTransactionId";
import logger from "../utilities/logger";
import { mapNotificationToEntity } from "../mappers/notification/mapNotificationToEntity";
import container from "../inversify/inversify.container";
import { IWorkService } from "../services/work/work.service.interface";
import TYPES from "../inversify/inversify.types";
import { IPaymentService } from "../services/payment/payment.service.interface";
import { IWorkerService } from "../services/worker/worker.service.interface";
import { IWalletService } from "../services/wallet/wallet.service.interface";
import mongoose from "mongoose";
import { INotificationService } from "../services/notification/notification.service.interface";
import { IWallet } from "../model/wallet/wallet.interface.model";
import { ISubscriptionService } from "../services/subscription/subscription.service.interface";

const router = express.Router();

const workService = container.get<IWorkService>(TYPES.workService);
const paymentService = container.get<IPaymentService>(TYPES.paymentService);
const workerService = container.get<IWorkerService>(TYPES.workerService);
const walletService = container.get<IWalletService>(TYPES.walletService);
const notificationService = container.get<INotificationService>(TYPES.notificationService);
const subscriptionService = container.get<ISubscriptionService>(TYPES.subscriptionService);

router.post("/create-order", async (req: Request, res: Response) => {
    try {
        const { amount, workId, platFromFee } = req.body;
        const wage = amount - platFromFee;

        const options = {
            amount: wage * 100,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        const work = await workService.findById(workId);
        if (!work) {
            throw new Error("Work not found");
        }

        const payment = await paymentService.findOne(workId, order.id);
        if (!payment) {
            await paymentService.create({
                workId,
                userId: work.userId,
                workerId: work.workerId,
                amount: wage,
                platformFee: platFromFee,
                transactionId: order.id,
                status: "Pending"
            });
        }

        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to create order" });
    }
});

router.post("/verify-payment", async (req: Request, res: Response): Promise<void> => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, workId } = req.body;
        const key_secret = process.env.RAZORPAY_KEY_SECRET as string;

        const hmac = crypto.createHmac("sha256", key_secret);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generated_signature = hmac.digest("hex");

        if (generated_signature !== razorpay_signature) {
            res.status(400).json({ success: false, message: "Payment verification failed" });
            return;
        }

        const payment = await paymentService.findOne(workId, razorpay_order_id);
        console.log("payment :", payment);
        if (!payment) {
            throw new Error("Payment record not found");
        }

        const worker = await workerService.getUserById(payment.workerId.toString());
        console.log("Worker :", worker);
        if (!worker) throw new Error("Worker not found");

        await workerService.updateCompletedWorks(payment.workerId.toString());

        const work = await workService.findById(workId);
        console.log("work :", work);

        if (!work) {
            throw new Error("Work not found");
        }

        await workService.updatePaymentStatus(workId, "Completed");

        const updatedPayment = {
            status: "Paid",
            transactionId: await generateTransactionId(razorpay_payment_id),
            paidAt: new Date(),
            notes: `Paid to ${work.service}`
        };
        await paymentService.update(payment.id.toString(), updatedPayment);

        const workerTransaction = {
            transactionId: updatedPayment.transactionId,
            type: "CREDIT" as const,
            amount: payment.amount,
            description: `${work.service} wage`,
            createdAt: new Date()
        };

        const userTransaction = {
            transactionId: updatedPayment.transactionId,
            type: "DEBIT" as const,
            amount: (payment.amount + payment.platformFee),
            description: updatedPayment.notes,
            createdAt: new Date()
        };

        const platformTransaction = {
            transactionId: updatedPayment.transactionId,
            type: "CREDIT" as const,
            amount: payment.platformFee,
            description: `Platform fee from ${work.service}`,
            createdAt: new Date()
        };

        await walletService.update(
            {
                balance: -userTransaction.amount,
                transactions: [userTransaction]
            },
            work.userId.toString()
        );

        await walletService.update(
            {
                balance: workerTransaction.amount,
                transactions: [workerTransaction]
            },
            work.workerId.toString()
        );

        await walletService.updatePlatformWallet(
            {
                balance: platformTransaction.amount,
                transactions: [platformTransaction]
            },
            "PLATFORM"
        );

        const notification = {
            recipient: new mongoose.Types.ObjectId(work.workerId.toString()),
            recipientModel: "Worker",
            actor: new mongoose.Types.ObjectId(work.userId.toString()),
            actorModel: "User",
            type: "job_paid",
            title: work.service,
            body: `The payment of ${work.wage} has been completed by ${work.workerName}.
                    Job description: ${work.description}`,
            read: false,
        };

        const notificationEntity = mapNotificationToEntity(notification);
        const newNotification = await notificationService.create(notificationEntity);
        if (!newNotification) throw new Error("Failed to create notification");

        res.json({ success: true, message: "Payment verified successfully" });
    } catch (error) {
        logger.error(error);
        console.error(error);
        const message = error instanceof Error ? error.message : "Something went wrong";
        res.status(500).json({ success: false, message });
    }
});

router.post("/create-wallet-order", async (req: Request, res: Response): Promise<void> => {
    try {
        const { amount } = req.body;
        if (!amount || amount < 1) {
            res.status(400).json({ error: "Invalid amount" });
            return;
        }

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `wallet_topup_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        console.error("Error creating wallet order:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

router.post("/verify-wallet-payment", async (req: Request, res: Response): Promise<void> => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;
        const userId = req.query.userId as string;

        const key_secret = process.env.RAZORPAY_KEY_SECRET as string;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", key_secret)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            res.status(400).json({ error: "Invalid signature" });
            return;
        }

        let wallet = await walletService.findByUser(userId);
        if (!wallet) {
            wallet = await walletService.create({
                userId: new mongoose.Types.ObjectId(userId),
                balance: 0,
                transactions: []
            });
        }

        const walletUpdate: Partial<IWallet> = {
            balance: (wallet?.balance ?? 0) + amount,
            transactions: [
                {
                    amount,
                    description: "Deposit amount",
                    type: "CREDIT" as const,
                    transactionId: razorpay_payment_id,
                    createdAt: new Date(),
                },
            ],
        };


        const updatedWallet = await walletService.update(walletUpdate, userId);

        res.json({ success: true, wallet: updatedWallet });
    } catch (err) {
        console.error("Error verifying wallet payment:", err);
        res.status(500).json({ error: "Payment verification failed" });
    }
});

router.post("/create-subscription-order", async (req: Request, res: Response): Promise<void> => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `wallet_topup_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        console.error("Error creating subscription order:", err);
        res.status(500).json({ error: "Something went wrong with creating subscription order" });
    }
});

router.post("/verify-subscription-payment", async (req: Request, res: Response): Promise<void> => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId, workerId } = req.body;

        const key_secret = process.env.RAZORPAY_KEY_SECRET as string;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", key_secret)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature !== expectedSign) {
            res.status(400).json({ error: "Invalid signature" });
            return;
        }

        const transactionId = await generateTransactionId(razorpay_payment_id);
        await subscriptionService.activateSubscriptionPlan(workerId, planId, transactionId)

        res.json({ success: true });
    } catch (err) {
        console.error("Error verifying wallet payment:", err);
        res.status(500).json({ error: "Payment verification failed" });
    }
});

export default router;