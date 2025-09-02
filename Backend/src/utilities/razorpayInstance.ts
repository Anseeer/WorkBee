import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

import Razorpay from "razorpay";

console.log("Env console like :",process.env.RAZORPAY_KEY_ID)

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});