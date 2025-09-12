"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const razorpayInstance_1 = require("../utilities/razorpayInstance");
const router = express_1.default.Router();
const crypto_1 = __importDefault(require("crypto"));
const work_model_1 = __importDefault(require("../model/work/work.model"));
const payment_model_1 = __importDefault(require("../model/payment/payment.model"));
const generateTransactionId_1 = require("../utilities/generateTransactionId");
const logger_1 = __importDefault(require("../utilities/logger"));
const wallet_model_1 = require("../model/wallet/wallet.model");
const worker_model_1 = __importDefault(require("../model/worker/worker.model"));
router.post("/create-order", async (req, res) => {
    try {
        const { amount, workId } = req.body;
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };
        const order = await razorpayInstance_1.razorpay.orders.create(options);
        const work = await work_model_1.default.findById(workId);
        if (!work) {
            throw new Error("Work not found");
        }
        const payment = await payment_model_1.default.findOne({ workId, transactionId: order.id });
        if (!payment) {
            await payment_model_1.default.create({
                workId,
                userId: work.userId,
                workerId: work.workerId,
                amount,
                transactionId: order.id,
                status: "Pending"
            });
        }
        res.json(order);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to create order" });
    }
});
router.post("/verify-payment", async (req, res) => {
    try {
        console.log("Hello");
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, workId } = req.body;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        const hmac = crypto_1.default.createHmac("sha256", key_secret);
        hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const generated_signature = hmac.digest("hex");
        if (generated_signature !== razorpay_signature) {
            res.status(400).json({ success: false, message: "Payment verification failed" });
            return;
        }
        const payment = await payment_model_1.default.findOne({ workId, transactionId: razorpay_order_id });
        if (!payment) {
            throw new Error("Payment record not found");
        }
        const worker = await worker_model_1.default.findById(payment.workerId);
        if (!worker)
            throw new Error("Worker not found");
        worker.completedWorks += 1;
        await worker.save();
        const work = await work_model_1.default.findById(workId);
        if (!work) {
            throw new Error("Work not found");
        }
        work.paymentStatus = "Completed";
        work.paymentId = payment.id;
        await work.save();
        payment.status = "Paid";
        payment.transactionId = await (0, generateTransactionId_1.generateTransactionId)(razorpay_payment_id);
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
            amount: payment.amount,
            description: payment.notes,
            createdAt: new Date()
        };
        await wallet_model_1.Wallet.updateOne({ userId: work.userId }, {
            $inc: { balance: -userTransaction.amount },
            $push: { transactions: userTransaction }
        });
        await wallet_model_1.Wallet.updateOne({ userId: work.workerId }, {
            $inc: { balance: workerTransaction.amount },
            $push: { transactions: workerTransaction }
        });
        res.json({ success: true, message: "Payment verified successfully" });
    }
    catch (error) {
        logger_1.default.error(error);
        console.error(error);
        const message = error instanceof Error ? error.message : "Something went wrong";
        res.status(500).json({ success: false, message });
    }
});
router.post("/create-wallet-order", async (req, res) => {
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
        const order = await razorpayInstance_1.razorpay.orders.create(options);
        res.json(order);
    }
    catch (err) {
        console.error("Error creating wallet order:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
});
router.post("/verify-wallet-payment", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;
        const userId = req.query.userId; // cast it if you are passing via query
        const key_secret = process.env.RAZORPAY_KEY_SECRET;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto_1.default
            .createHmac("sha256", key_secret)
            .update(sign.toString())
            .digest("hex");
        if (razorpay_signature !== expectedSign) {
            res.status(400).json({ error: "Invalid signature" });
            return;
        }
        let wallet = await wallet_model_1.Wallet.findOne({ userId });
        if (!wallet) {
            wallet = new wallet_model_1.Wallet({ userId, balance: 0, transactions: [] });
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
    }
    catch (err) {
        console.error("Error verifying wallet payment:", err);
        res.status(500).json({ error: "Payment verification failed" });
    }
});
exports.default = router;
