import mongoose, { Document } from "mongoose";

export interface IPayment extends Document {
    userId: mongoose.Schema.Types.ObjectId,
    workerId: mongoose.Schema.Types.ObjectId,
    workId: mongoose.Schema.Types.ObjectId,
    amount: number,
    platformFee: number,
    status: string,
    paymentMethod: string,
    transactionId: string,
    notes: string,
    createdAt: Date,
    paidAt: Date
} 