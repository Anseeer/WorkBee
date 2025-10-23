export interface ITransactions {
    transactionId: string;
    type: "CREDIT" | "DEBIT";
    amount: number;
    description?: string;
    createdAt: string;
};