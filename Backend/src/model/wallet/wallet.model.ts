import mongoose, { Schema } from "mongoose";
import { IWallet } from "./wallet.interface.model";


const transactionSchema = new Schema(
    {
        transactionId: { type: String, required: true },
        type: { type: String, enum: ["credit", "debit"], required: true },
        amount: { type: Number, required: true },
        description: { type: String },
        createdAt: { type: Date, default: Date.now }
    },
    { _id: false }
);

const walletSchema = new Schema<IWallet>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        balance: { type: Number, default: 0 },
        currency: { type: String, default: "INR" },
        transactions: [transactionSchema]
    },
    { timestamps: true }
);

export  const Wallet = mongoose.model<IWallet>("Wallet", walletSchema);
