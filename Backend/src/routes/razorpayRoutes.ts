import express, { Request, Response } from "express";
import { razorpay } from "../utilities/razorpayInstance";

const router = express.Router();
import crypto from "crypto";
import Work from "../model/work/work.model";
import Payment from "../model/payment/payment.model";
import { generateTransactionId } from "../utilities/generateTransactionId";
import logger from "../utilities/logger";
import { Wallet } from "../model/wallet/wallet.model";
import Worker from "../model/worker/worker.model";
import { mapNotificationToEntity } from "../mappers/notification/mapNotificationToEntity";
import Notification from "../model/notification/notification.model";
import axios from "axios";

router.post("/create-order", async (req, res) => {
    try {
        const { amount, workId, platFromFee } = req.body;
        const wage = amount - platFromFee;

        const options = {
            amount: wage * 100,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        const work = await Work.findById(workId);
        if (!work) {
            throw new Error("Work not found");
        }

        const payment = await Payment.findOne({ workId, transactionId: order.id });
        if (!payment) {
            await Payment.create({
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

        const payment = await Payment.findOne({ workId, transactionId: razorpay_order_id });
        if (!payment) {
            throw new Error("Payment record not found");
        }

        const worker = await Worker.findById(payment.workerId);
        if (!worker) throw new Error("Worker not found");

        worker.completedWorks += 1;
        await worker.save();

        const work = await Work.findById(workId);
        if (!work) {
            throw new Error("Work not found");
        }

        work.paymentStatus = "Completed";
        work.paymentId = payment.id;
        await work.save();

        payment.status = "Paid";
        payment.transactionId = await generateTransactionId(razorpay_payment_id);
        payment.paidAt = new Date();
        payment.notes = `Paid to ${work.service}`;
        await payment.save();

        const workerTransaction = {
            transactionId: payment.transactionId,
            type: "CREDIT",
            amount: payment.amount,
            description: `${work.service} wage`,
            createdAt: new Date()
        };

        const userTransaction = {
            transactionId: payment.transactionId,
            type: "DEBIT",
            amount: (payment.amount + payment.platformFee),
            description: payment.notes,
            createdAt: new Date()
        };

        const platformTransaction = {
            transactionId: payment.transactionId,
            type: "CREDIT",
            amount: payment.platformFee,
            description: `Platform fee from ${work.service}`,
            createdAt: new Date()
        };

        await Wallet.updateOne(
            { userId: work.userId },
            {
                $inc: { balance: -userTransaction.amount },
                $push: { transactions: userTransaction }
            }
        );

        await Wallet.updateOne(
            { userId: work.workerId },
            {
                $inc: { balance: workerTransaction.amount },
                $push: { transactions: workerTransaction }
            }
        );

        await Wallet.updateOne(
            { walletType: "PLATFORM" },
            {
                $inc: { balance: platformTransaction.amount },
                $push: { transactions: platformTransaction }
            },
            { upsert: true }
        );

        const notification = {
            recipient: work?.workerId.toString(),
            recipientModel: "Worker",
            actor: work.userId.toString(),
            actorModel: "User",
            type: "job_paid",
            title: work?.service,
            body: `The payment of ${work?.wage} has been completed by ${work?.workerName}.
                    Job description: ${work?.description}`,
            read: false,
        };

        const notificationEntity = mapNotificationToEntity(notification);
        const newNotification = await Notification.create(notificationEntity);
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
        const userId = req.query.userId as string; // cast it if you are passing via query

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

        let wallet = await Wallet.findOne({ userId });
        if (!wallet) {
            wallet = new Wallet({ userId, balance: 0, transactions: [] });
        }

        wallet.balance += amount;
        wallet.transactions.push({
            amount,
            description: "Deposit amount",
            type: "CREDIT",
            transactionId: razorpay_payment_id,
            createdAt: new Date(),
        });

        await wallet.save();

        res.json({ success: true, wallet });
    } catch (err) {
        console.error("Error verifying wallet payment:", err);
        res.status(500).json({ error: "Payment verification failed" });
    }
});


// router.post("/withdraw-money", async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { accountHolderName, accountNumber, ifscCode, withdrawAmount } = req.body;

//         if (!accountHolderName || !accountNumber || !ifscCode || !withdrawAmount) {
//             return res.status(400).json({ error: "Missing required fields" });
//         }

//         // Use RazorpayX base URL
//         const baseUrl = "https://api.razorpayx.com/v1";
//         const auth = {
//             username: process.env.RAZORPAY_KEY_ID!, // Use RazorpayX key_id
//             password: process.env.RAZORPAY_KEY_SECRET!, // Use RazorpayX key_secret
//         };

//         // 1️⃣ Create Contact
//         const contactRes = await axios.post(
//             `${baseUrl}/contacts`,
//             { name: accountHolderName, type: "employee" }, // Or "vendor" if applicable
//             { auth }
//         );
//         console.log("Contact created:", contactRes.data.id); // Debug log

//         // 2️⃣ Create Fund Account
//         const fundRes = await axios.post(
//             `${baseUrl}/fund_accounts`,
//             {
//                 contact_id: contactRes.data.id,
//                 account_type: "bank_account",
//                 bank_account: {
//                     name: accountHolderName,
//                     ifsc: ifscCode,
//                     account_number: accountNumber,
//                 },
//             },
//             { auth }
//         );
//         console.log("Fund account created:", fundRes.data.id); // Debug log

//         // 3️⃣ Create Payout
//         const payoutAmountInPaise = Number(withdrawAmount) * 100; // Ensure positive integer
//         if (payoutAmountInPaise <= 0) {
//             return res.status(400).json({ error: "Withdraw amount must be positive" });
//         }

//         const payoutRes = await axios.post(
//             `${baseUrl}/payouts`,
//             {
//                 account_number: process.env.RAZORPAYX_ACCOUNT!, // Your RazorpayX account number
//                 fund_account_id: fundRes.data.id,
//                 amount: payoutAmountInPaise,
//                 currency: "INR",
//                 mode: "IMPS", // Or "NEFT"/"UPI" based on time/bank
//                 purpose: "payout",
//                 queue_if_low_balance: true,
//                 // Optional: reference_id: "your-unique-ref", narration: "Withdraw from app"
//             },
//             { auth }
//         );

//         res.json({ success: true, payout: payoutRes.data });

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (error: any) {
//         console.error("Withdraw error at step:", error.config?.url || "unknown", error.response?.data || error.message || error);
//         // More specific status based on error
//         if (error.response?.status === 400) {
//             res.status(400).json({ error: "Invalid request - check account details" });
//         } else {
//             res.status(500).json({ error: error.response?.data?.description || error.message });
//         }
//     }
// });

export default router;
