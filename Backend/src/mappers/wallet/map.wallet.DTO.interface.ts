import { Types } from "mongoose";

export interface IWalletDTO {
    _id?: string,
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
    _id?: string,
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
