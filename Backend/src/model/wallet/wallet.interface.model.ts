import { Types, Document } from "mongoose";

export interface IWallet extends Document {
    userId: Types.ObjectId;
    balance: number;
    currency: string;
    transactions: {
        transactionId: string;
        type: "CREDIT" | "DEBIT";
        amount: number;
        description?: string;
        createdAt: Date;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
}
