import { Types, Document } from "mongoose";

export interface IWallet extends Document {
    userId: Types.ObjectId;
    balance: number;
    currency: string;
    transactions: {
        transactionId: string;
        type: "credit" | "debit";
        amount: number;
        description?: string;
        createdAt: Date;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
}
