import mongoose, { Schema } from "mongoose";
import { IWallet } from "./wallet.interface.model";


const transactionSchema = new Schema(
    {
        transactionId: { type: String || null, required: true, default:null },
        type: { type: String, enum: ["CREDIT", "DEBIT"], required: true },
        amount: { type: Number, required: true },
        description: { type: String },
        createdAt: { type: Date, default: Date.now }
    },
    { _id: false }
);

const walletSchema = new Schema<IWallet>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
        walletType: {
            type: String,
            enum: ["USER", "WORKER", "PLATFORM"],
            default: "USER"
        },
        balance: { type: Number, default: 0 },
        currency: { type: String, default: "INR" },
        transactions: [transactionSchema]
    },
    { timestamps: true }
);

export const Wallet = mongoose.model<IWallet>("Wallet", walletSchema);
