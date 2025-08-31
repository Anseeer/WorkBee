import { Types } from "mongoose";

export interface IWalletDTO {
    userId: Types.ObjectId;
    balance: number;
    transactions: {
        transactionId: string;
        type: "CREDIT" | "DEBIT";
        amount: number;
        description?: string;
        createdAt: Date;
    }[];
    createdAt?: Date;
}

export interface IWalletEntity {
    userId: Types.ObjectId;
    balance: number;
    transactions: {
        transactionId: string;
        type: "CREDIT" | "DEBIT";
        amount: number;
        description?: string;
        createdAt: Date;
    }[];
    createdAt?: Date;
}
