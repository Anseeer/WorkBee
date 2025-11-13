import express, { Request, Response } from "express";
import { razorpay } from "../utilities/razorpayInstance";
import crypto from "crypto";
import { generateTransactionId } from "../utilities/generateTransactionId";
import logger from "../utilities/logger";
import container from "../inversify/inversify.container";
import { IWorkService } from "../services/work/work.service.interface";
import TYPES from "../inversify/inversify.types";
import { IPaymentService } from "../services/payment/payment.service.interface";
import { IWorkerService } from "../services/worker/worker.service.interface";
import { IWalletService } from "../services/wallet/wallet.service.interface";
import mongoose from "mongoose";
import { IWallet } from "../model/wallet/wallet.interface.model";
import { ISubscriptionService } from "../services/subscription/subscription.service.interface";
import { getIO } from "../socket/socket";
import { mapNotificationToEntity } from "../mappers/notification/mapNotificationToEntity";
import { INotificationService } from "../services/notification/notification.service.interface";

const router = express.Router();

const workService = container.get<IWorkService>(TYPES.workService);
const paymentService = container.get<IPaymentService>(TYPES.paymentService);
const workerService = container.get<IWorkerService>(TYPES.workerService);
const walletService = container.get<IWalletService>(TYPES.walletService);
const subscriptionService = container.get<ISubscriptionService>(TYPES.subscriptionService);
const notificationService = container.get<INotificationService>(TYPES.notificationService);


router.post("/create-order", async (req: Request, res: Response) => {
    try {
        const { amount, workId, platformFee } = req.body;
        const wage = amount - platformFee;

        const options = {
            amount: amount * 100,
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
                platformFee: platformFee,
                transactionId: order.id,
                status: "Pending"
            });
        }

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: "Unable to create order", err });
    }
});

router.post("/verify-payment", async (req: Request, res: Response): Promise<void> => {
    try {
        const io = getIO();
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
        if (!payment) {
            throw new Error("Payment record not found");
        }

        const worker = await workerService.getUserById(payment.workerId.toString());
        if (!worker?.subscription) {
            throw new Error("Worker subscription not found. Cannot calculate commission.");
        }
        const commission = parseInt(worker.subscription.commission as string) || 0;

        if (!worker) throw new Error("Worker not found");

        await workerService.updateCompletedWorks(payment.workerId.toString());

        const work = await workService.findById(workId);

        if (!work) {
            throw new Error("Work not found");
        }
        const totalAmount = payment?.amount + payment.platformFee;
        await workService.updatePaymentStatus(workId, "Completed", totalAmount.toString());

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
            amount: payment.amount - (payment.amount * commission) / 100,
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
            description: `Platform - fee from ${work.service}`,
            createdAt: new Date()
        };

        const platformTransactionOfCommission = {
            transactionId: updatedPayment.transactionId,
            type: "CREDIT" as const,
            amount: (payment.amount * commission) / 100,
            description: `Commission - from ${work.service}`,
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

        const platFormWallet = await walletService.findPlatformWallet();
        if (!platFormWallet) {
            await walletService.create({
                walletType: "PLATFORM",
                balance: 0,
                transactions: []
            });
        }

        await walletService.updatePlatformWallet(
            {
                balance: platformTransaction.amount + platformTransactionOfCommission.amount,
                transactions: [platformTransaction, platformTransactionOfCommission]
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
            body: `The payment of ₹${work.totalAmount} has been completed by ${work.workerName}.
                    Job description: ${work.description}`,
            read: false,
        };

        const notificationEntity = mapNotificationToEntity(notification);
        const newNotification = await notificationService.create(notificationEntity);
        if (!newNotification) throw new Error("Failed to create notification");
        io.to(notification?.recipient?.toString()).emit("new-notification", newNotification);

        res.json({ success: true, message: "Payment verified successfully" });
    } catch (error) {
        logger.error(error);
        const message = error instanceof Error ? error.message : "Something went wrong";
        res.status(500).json({ success: false, message });
    }
});

router.post("/create-wallet-order", async (req: Request, res: Response): Promise<void> => {
    try {
        const { amount } = req.body;
        if (!amount || amount < 1) {
            res.status(400).json({ error: "Invalid Amount" });
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
        res.status(500).json({ error: "Something went wrong", err });
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
            balance: amount,
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
        res.status(500).json({ error: "Payment verification failed", err });
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
        res.status(500).json({ error: "Something went wrong with creating subscription order", err });
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
        res.status(500).json({ error: "Payment verification failed", err });
    }
});

router.post("/payout/worker", async (req: Request, res: Response): Promise<void> => {
    try {
        const { workerId, accountName, accountNumber, amount } = req.body;
        const transactionId = generateTransactionId(accountNumber)

        if (workerId == "PLATFORM") {
            const platformTransaction = {
                transactionId: (await transactionId).toString(),
                type: "DEBIT" as const,
                amount: amount as number,
                description: `Payout of ₹${amount} to ${accountName}`,
                createdAt: new Date()
            };

            await walletService.updatePlatformWallet(
                {
                    balance: -amount,
                    transactions: [platformTransaction]
                },
                "PLATFORM"
            );
        } else {
            const userTransaction = {
                transactionId: (await transactionId).toString(),
                type: "DEBIT" as const,
                amount: amount as number,
                description: `Payout of ₹${amount} to ${accountName}`,
                createdAt: new Date()
            };
            await walletService.update(
                {
                    balance: -amount,
                    transactions: [userTransaction]
                },
                workerId.toString()
            );
        }

        // const worker = await workerService.findById(workerId);
        // if (!worker) {
        //     res.status(404).json({ success: false, message: "Worker not found" });
        //     return
        // }

        // const { data: contact } = await axios.post(
        //     "https://api.razorpay.com/v1/contacts",
        //     {
        //         name: worker.name,
        //         email: worker.email,
        //         contact: worker.phone,
        //         type: "employee",
        //         reference_id: `worker_${worker._id}`,
        //     },
        //     { auth: { username: process.env.RAZORPAY_KEY_ID!, password: process.env.RAZORPAY_KEY_SECRET! } }
        // );


        // const { data: fundAccount } = await axios.post(
        //     "https://api.razorpay.com/v1/fund_accounts",
        //     {
        //         contact_id: contact.id,
        //         account_type: "bank_account",
        //         bank_account: {
        //             name: accountName,
        //             ifsc: ifscCode,
        //             account_number: accountNumber,
        //         },
        //     },
        //     { auth: { username: process.env.RAZORPAY_KEY_ID!, password: process.env.RAZORPAY_KEY_SECRET! } }
        // );

        // const { data: payout } = await axios.post(
        //     "https://api.razorpay.com/v1/payouts",
        //     {
        //         account_number: process.env.RAZORPAYX_ACCOUNT!,
        //         fund_account_id: fundAccount.id,
        //         amount: Number(amount) * 100,
        //         currency: "INR",
        //         mode: "UPI",
        //         purpose: "payout",
        //         queue_if_low_balance: true,
        //         narration: `Withdrawal for worker ${worker.name}`,
        //     },
        //     { auth: { username: process.env.RAZORPAY_KEY_ID!, password: process.env.RAZORPAY_KEY_SECRET! } }
        // );

        res.json({ success: true, message: 'Payout success' });
    } catch (err) {
        res.status(500).json({ error: "Payment verification failed", err });
    }
});


export default router;