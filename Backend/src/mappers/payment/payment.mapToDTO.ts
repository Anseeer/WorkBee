import { IPayment } from "../../model/payment/payment.interface.model";
import { IPaymentDTO, PaymentStatus } from "./payment.mapToDTO.interface";

export const mapPaymentToDTO = (payment: IPayment): IPaymentDTO => {
    return {
        id: payment.id,
        workId: payment?.workId?.toString() as string,
        userId: payment?.userId?.toString() as string,
        workerId: payment?.workerId?.toString() as string,
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

