import { injectable } from "inversify";
import BaseRepository from "../base/base.repo";
import { IPayment } from "../../model/payment/payment.interface.model";
import Payment from "../../model/payment/payment.model";
import { IPaymentRepository } from "./payment.repo.interface";

@injectable()
export class PaymentRepository extends BaseRepository<IPayment> implements IPaymentRepository {
    constructor() {
        super(Payment);
    }

    async findOne(workId: string, transactionId: string): Promise<IPayment | null> {
        try {
            const payment = await this.model.findOne({ workId, transactionId });
            if (!payment) return null;
            return payment;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to find payment : ${errMsg}`);
        }
    }

    async findPaymentByWorkId(workId: string): Promise<IPayment | null> {
        try {
            const payment = await this.model.findOne({ workId });
            if (!payment) return null;
            return payment;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to find payment : ${errMsg}`);
        }
    }

    async update(paymentId: string, updateData: Partial<IPayment>): Promise<IPayment | null> {
        try {
            if (!paymentId) {
                throw new Error("Payment ID not provided");
            }

            const updatedPayment = await this.model.findByIdAndUpdate(
                paymentId,
                { $set: updateData },
                { new: true }
            );

            return updatedPayment;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to update payment: ${errMsg}`);
        }
    }

}