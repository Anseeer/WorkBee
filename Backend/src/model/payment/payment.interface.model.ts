import mongoose, { Document } from "mongoose";

export interface IPayment extends Document {
    userId: mongoose.Schema.Types.ObjectId | null,
    workerId: mongoose.Schema.Types.ObjectId | null,
    workId: mongoose.Schema.Types.ObjectId | null,
    amount: number,
    platformFee: number,
    status: string,
    paymentMethod: string,
    transactionId: string,
    notes: string,
    createdAt: Date,
    paidAt: Date
} 