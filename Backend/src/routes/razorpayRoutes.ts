import express, { Request, Response } from "express";
import { razorpay } from "../utilities/razorpayInstance";

const router = express.Router();
import crypto from "crypto";
import Work from "../model/work/work.model";
import Payment from "../model/payment/payment.model";
import { generateTransactionId } from "../utilities/generateTransactionId";
import logger from "../utilities/logger";

router.post("/create-order", async (req, res) => {
    try {
        const { amount, workId } = req.body;

        const options = {
            amount: amount * 100,
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
                amount,
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


interface VerifyPaymentBody {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    workId: string;
}

router.post<{}, any, VerifyPaymentBody>(
    "/verify-payment",
    async (req: Request<{}, any, VerifyPaymentBody>, res: Response): Promise<void> => {
        try {
            console.log("Hello")
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

            const work = await Work.findById(workId);
            if (!work) {
                throw new Error("Work not found");
            }
            work.paymentStatus = "Completed";
            work.paymentId = payment.id;
            await work.save();

            // Update payment
            payment.status = "Paid";
            payment.transactionId = await generateTransactionId(razorpay_payment_id);
            payment.paidAt = new Date();
            payment.notes = `Paid to ${work.service}`;
            await payment.save();

            // Optional: Create transaction record
            /*
            await Transaction.create({
                workId,
                userId: payment.userId,
                workerId: payment.workerId,
                transactionId: payment.transactionId,
                amount: payment.amount,
                type: "credit",
                createdAt: new Date()
            });
    
            // Optional: Update worker's wallet
            await Wallet.updateOne(
                { userId: payment.workerId },
                { $inc: { balance: payment.amount } }
            );
            */

            res.json({ success: true, message: "Payment verified successfully" });
        } catch (error) {
            console.log("Errorrrrrr:::::::::::::");
            logger.error(error);
            console.error(error);
            const message = error instanceof Error ? error.message : "Something went wrong";
            res.status(500).json({ success: false, message });
        }
    }
);



export default router;
