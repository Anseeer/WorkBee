import { IPayment } from "../../model/payment/payment.interface.model";
import { Iwrite } from "../base/base.repo.interface";

export interface IPaymentRepository extends Iwrite<IPayment> {
    create(paymentData: Partial<IPayment>): Promise<IPayment>;
    findOne(workId: string, transactionId: string): Promise<IPayment | null>;
    findPaymentByWorkId(workId: string): Promise<IPayment | null>;
    findPaymentByUserId(userId: string): Promise<IPayment | null>;
    update(paymentId: string, updateData: Partial<IPayment>): Promise<IPayment | null>;
}