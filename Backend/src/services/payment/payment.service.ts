import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { IPaymentService } from "./payment.service.interface";
import { IPayment } from "../../model/payment/payment.interface.model";
import { IPaymentRepository } from "../../repositories/payment/payment.repo.interface";
import { IPaymentDTO } from "../../mappers/payment/payment.mapToDTO.interface";
import { mapPaymentToDTO } from "../../mappers/payment/payment.mapToDTO";
import logger from "../../utilities/logger";

@injectable()
export class PaymentService implements IPaymentService {
    private _paymentRepository: IPaymentRepository;
    constructor(@inject(TYPES.paymentRepository) paymentRepo: IPaymentRepository) {
        this._paymentRepository = paymentRepo;
    }

    async findOne(workId: string, transactionId: string): Promise<IPaymentDTO | null> {
        try {
            if (!workId || !transactionId) {
                throw new Error('Cant get the workId or transactionId')
            }
            const payment = await this._paymentRepository.findOne(workId, transactionId);
            if (!payment) return null;
            return mapPaymentToDTO(payment);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async findPaymentByWorkId(workId: string): Promise<IPaymentDTO | null> {
        try {
            if (!workId) {
                throw new Error('Cant get the workId ')
            }
            const payment = await this._paymentRepository.findPaymentByWorkId(workId);
            if (!payment) return null;
            return mapPaymentToDTO(payment);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async findPaymentByUserId(userId: string): Promise<IPaymentDTO | null> {
        try {
            if (!userId) {
                throw new Error('Cant get the userId ')
            }
            const payment = await this._paymentRepository.findPaymentByUserId(userId);
            if (!payment) return null;
            return mapPaymentToDTO(payment);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async create(paymentData: Partial<IPayment>): Promise<IPaymentDTO | null> {
        try {
            if (!paymentData) {
                throw new Error('PaymentData  not get ');
            }
            const payment = await this._paymentRepository.create(paymentData);
            return mapPaymentToDTO(payment);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async update(paymentId: string, updateData: Partial<IPayment>): Promise<IPaymentDTO | null> {
        try {
            if (!paymentId || !updateData) {
                throw new Error('PaymentId or updateData not get ');
            }
            const payment = await this._paymentRepository.update(paymentId, updateData);
            return mapPaymentToDTO(payment as IPayment);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async cancelPaymentByWorkId(workId: string): Promise<boolean> {
        try {
            if (!workId) throw new Error('workId not provided');

            const payment = await this._paymentRepository.findPaymentByWorkId(workId);

            if (!payment) return false;

            return await this._paymentRepository.delete(payment?.id.toString());
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async cancelPaymentByUserId(userId: string): Promise<boolean> {
        try {
            if (!userId) throw new Error('userId not provided');

            const payment = await this._paymentRepository.findPaymentByUserId(userId);

            if (!payment) return false;

            return await this._paymentRepository.delete(payment?.id.toString());
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

}