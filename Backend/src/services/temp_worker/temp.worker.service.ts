import bcrypt from "bcrypt";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { WORKER_MESSAGE } from "../../constants/messages";
import logger from "../../utilities/logger";
import { generateOTP } from "../../utilities/generateOtp";
import { emailService } from "../../utilities/emailService";
import { saveOtp } from "../../utilities/otpStore";
import { ITempWorkerService } from "./temp.worker.service.interface";
import { IWorkerRepository } from "../../repositories/worker/worker.repo.interface";
import { ITempWorkerRepository } from "../../repositories/temp_worker/temp.worker.interface.repo";
import { ITempWorker } from "../../model/temp_worker/temp.worker.interface";
import { mapToTempWorkerEntity } from "../../mappers/temp_worker/temp.worker.map.DTO";

@injectable()
export class TempWorkerService implements ITempWorkerService {

    private _tempWorkerRepository: ITempWorkerRepository;
    private _workerRepository: IWorkerRepository;

    constructor(
        @inject(TYPES.tempWorkerRepository) tempWorkerRepo: ITempWorkerRepository,
        @inject(TYPES.workerRepository) workerRepo: IWorkerRepository,
    ) {
        this._tempWorkerRepository = tempWorkerRepo;
        this._workerRepository = workerRepo;
    }

    async register(workerData: Partial<ITempWorker>): Promise<string> {
        try {

            if (!workerData.email || !workerData.password || !workerData.name || !workerData.location || !workerData.phone || !workerData.categories) {
                throw new Error(WORKER_MESSAGE.ALL_FIELDS_ARE_REQUIRED);
            }

            const workerExist = await this._workerRepository.findByEmail(workerData?.email);
            if (workerExist) {
                throw new Error(WORKER_MESSAGE.WORKER_ALREADY_EXIST);
            }

            const existInTemp = await this._tempWorkerRepository.findTempWorkerByEmail(workerData?.email)

            if (existInTemp) {
                await this._tempWorkerRepository.delete(existInTemp.id)
            }

            const hashedPass = await bcrypt.hash(workerData.password, 10);
            const otp = await generateOTP();
            saveOtp(workerData.email, otp);
            await emailService(workerData.email, otp, "VERIFY_EMAIL");
            workerData.password = hashedPass;
            workerData.otp = otp;
            const workerEntity = await mapToTempWorkerEntity(workerData);
            const newWorker = await this._tempWorkerRepository.create(workerEntity);
            return newWorker.id;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error("Error in the temp_worker creating", errMsg);
            throw new Error(errMsg);
        }
    }

    async resendOtp(tempWorkerId: string): Promise<string> {
        try {
            if (!tempWorkerId) {
                throw new Error(WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID);
            }

            const workerExist = await this._tempWorkerRepository.findById(tempWorkerId);
            if (!workerExist) {
                throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER_SIGNUP_FIRST);
            }

            const otp = await generateOTP();

            saveOtp(workerExist.email, otp);
            await emailService(workerExist.email, otp, "VERIFY_EMAIL");

            await this._tempWorkerRepository.updateById(tempWorkerId, {
                otp,
                updatedAt: new Date()
            });

            return tempWorkerId;

        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error("Error in resendOtp", errMsg);
            throw new Error(errMsg);
        }
    }

}