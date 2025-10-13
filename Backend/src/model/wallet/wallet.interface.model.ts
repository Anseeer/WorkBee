import { Types, Document } from "mongoose";

export interface IWallet extends Document {
    userId?: Types.ObjectId; 
    walletType: "USER" | "WORKER" | "PLATFORM";
    balance: number;
    currency: string;
    transactions: {
        transactionId: string|null;
        type: "CREDIT" | "DEBIT";
        amount: number;
        description?: string;
        createdAt: Date;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
}
