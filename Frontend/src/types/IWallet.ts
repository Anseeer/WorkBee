
export interface IWallet {
    userId: string;
    balance: number;
    currency: string;
    transactions: {
        transactionId: string;
        type: "CREDIT" | "DEBIT";
        amount: number;
        description?: string;
        createdAt: string;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
}
