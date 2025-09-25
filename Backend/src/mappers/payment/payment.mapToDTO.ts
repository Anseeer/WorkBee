import { IPayment } from "../../model/payment/payment.interface.model";
import { IPaymentDTO, PaymentStatus } from "./payment.mapToDTO.interface";

export const mapPaymentToDTO = (payment: IPayment): IPaymentDTO => {
    return {
        id: payment.id, 
        workId: payment.workId.toString(),
        userId: payment.userId.toString(),
        workerId: payment.workerId.toString(),
        amount: payment.amount,
        platformFee: payment.platformFee,
        status: payment.status as PaymentStatus,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,
        notes: payment.notes,
        createdAt: payment.createdAt,
        paidAt: payment.paidAt,
    };
};

export const mapPaymentsToDTO = (payments: IPayment[]): IPaymentDTO[] => {
    return payments.map(mapPaymentToDTO);
};

