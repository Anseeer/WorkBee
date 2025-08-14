import express, { Request, Response } from "express";
import { razorpay } from "../utilities/razorpayInstance";

const router = express.Router();
import crypto from "crypto";


router.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body;
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Unable to create order" });
    }
});

router.post("/verify-payment", async (req: Request, res: Response) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const key_secret = process.env.RAZORPAY_KEY_SECRET as string;

    const hmac = crypto.createHmac("sha256", key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest("hex");

    if (generated_signature === razorpay_signature) {
        
        res.json({ success: true, message: "Payment verified successfully" });
    } else {
        res.status(400).json({ success: false, message: "Payment verification failed" });
    }
});


export default router;
