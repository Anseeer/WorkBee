export type PaymentStatus = "Pending" | "Paid" | "Failed" | "Refunded";

export interface IPaymentDTO {
    id: string;
    workId: string;
    userId: string;
    workerId: string;
    amount: number;
    platformFee: number;
    status: PaymentStatus;
    paymentMethod: string | null;
    transactionId: string | null;
    notes: string | null;
    createdAt: Date;
    paidAt: Date | null;
}


