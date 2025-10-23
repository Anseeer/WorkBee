import { Types } from "mongoose";

export interface IWalletDTO {
    _id?: string,
    userId: string;
    balance: number;
    transactions: {
        transactionId: string | null;
        type: "CREDIT" | "DEBIT";
        amount: number;
        description?: string | undefined;
        createdAt: Date;
    }[];
    createdAt?: Date;
}

export interface IWalletEntity {
    userId: Types.ObjectId;
    balance: number;
    transactions: {
        transactionId: string | null;
        type: "CREDIT" | "DEBIT";
        amount: number;
        description?: string;
        createdAt: Date;
    }[];
    createdAt?: Date;
}
