import { IPayment } from "../../model/payment/payment.interface.model";

export interface IPaymentRepository {
    create(paymentData: Partial<IPayment>): Promise<IPayment>;
    findOne(workId: string, transactionId: string): Promise<IPayment | null>;
    findPaymentByWorkId(workId: string): Promise<IPayment | null>;
    update(paymentId: string, updateData: Partial<IPayment>): Promise<IPayment | null>;
}