import { IPaymentDTO } from "../../mappers/payment/payment.mapToDTO.interface";
import { IPayment } from "../../model/payment/payment.interface.model";

export interface IPaymentService {
    findOne(workId: string, transactionId: string): Promise<IPaymentDTO | null>;
    findPaymentByWorkId(workId: string): Promise<IPaymentDTO | null>;
    findPaymentByUserId(userId: string): Promise<IPaymentDTO | null>;
    create(paymentData: Partial<IPayment>): Promise<IPaymentDTO | null>;
    update(paymentId: string, updateData: Partial<IPayment>): Promise<IPaymentDTO | null>;
    cancelPaymentByWorkId(workId: string): Promise<boolean>;
    cancelPaymentByUserId(userId: string): Promise<boolean>;

}