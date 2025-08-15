
export interface IWallet  {
    userId: string;
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
