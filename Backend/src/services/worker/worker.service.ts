import bcrypt from "bcrypt"
import { WorkerRepository } from "../../repositories/worker/worker.repo";
import generateToken from "../../utilities/generateToken";
import mapWorkerToDTO from "../../mappers/worker/worker.map.DTO";
import { IWorker } from "../../model/worker/worker.interface";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { generateOTP } from "../../utilities/generateOtp";
import { emailService } from "../../utilities/emailService";
import { deleteOtp, getOtp, saveOtp } from "../../utilities/otpStore";
import { IWorkerDTO } from "../../mappers/worker/worker.map.DTO.interface";
import { IWorkerService } from "./worker.service.interface";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { AvailabilityRepository } from "../../repositories/availability/availability.repo";
import { WORKER_MESSAGE } from "../../constants/messages";

@injectable()
export class WorkerService implements IWorkerService {
    private _workerRepository: WorkerRepository
    private _availabilityRepository: AvailabilityRepository
    constructor(
        @inject(TYPES.workerRepository) workerRepo: WorkerRepository,
        @inject(TYPES.availabilityRepository) availibilityRepo: AvailabilityRepository
    ) {
        this._workerRepository = workerRepo;
        this._availabilityRepository = availibilityRepo;
    }

    async loginWorker(credentials: { email: string, password: string }): Promise<{ token: string, worker: IWorkerDTO, availability?: IAvailability[] }> {

        const existingWorker = await this._workerRepository.findByEmail(credentials.email);
        if (!existingWorker || existingWorker.role !== "Worker") {
            throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER);
        }

        let existingAvailability: IAvailability[] | undefined | null;

        if (existingWorker.isAccountBuilt) {
            existingAvailability = await this._availabilityRepository.findByWorkerId(existingWorker.id);

            if (!existingAvailability) {
                throw new Error(WORKER_MESSAGE.CANT_FIND_AVAILABILITY);
            }
        }

        const matchPass = await bcrypt.compare(credentials.password, existingWorker.password);
        if (!matchPass) {
            throw new Error(WORKER_MESSAGE.INVALID_PASS);
        }

        const token = generateToken(existingWorker.id.toString(), existingWorker.role);

        const worker = mapWorkerToDTO(existingWorker);

        return {
            token,
            worker,
            availability: existingAvailability ?? undefined
        };
    }


    async registerWorker(workerData: Partial<IWorker>): Promise<{ token: string, worker: {} }> {

        if (!workerData.name || !workerData.email || !workerData.password || !workerData.phone || !workerData.categories || !workerData.location) {
            throw new Error(WORKER_MESSAGE.ALL_FIELDS_ARE_REQUIRED);
        }

        const existingWorker = await this._workerRepository.findByEmail(workerData.email);
        if (existingWorker) {
            throw new Error(WORKER_MESSAGE.WORKER_ALREADY_EXIST);
        }

        const hashedPass = await bcrypt.hash(workerData.password, 10);
        workerData.password = hashedPass;
        const newWorker = await this._workerRepository.create(workerData);

        const token = generateToken(newWorker.id.toString(), newWorker.role);

        return { token, worker: newWorker };

    }

    async buildAccount(workerId: string, availability: IAvailability, workerData: Partial<IWorker>): Promise<{ updatedWorker: IWorkerDTO; updatedAvailability: IAvailability }> {

        const existingWorker = await this._workerRepository.findById(workerId);
        if (!existingWorker) throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER);

        const updatedFields: Partial<IWorker> = {
            profileImage: workerData.profileImage,
            bio: workerData.bio,
            age: workerData.age,
            services: workerData.services,
            workType: workerData.workType,
            minHours: workerData.minHours,
            preferredSchedule: workerData.preferredSchedule,
            govId: workerData.govId,
            isAccountBuilt: true
        };

        const updatedWorkerEntity = await this._workerRepository.findByIdAndUpdate(workerId, updatedFields);
        if (!updatedWorkerEntity) throw new Error(WORKER_MESSAGE.UPDATE_WORKER_SUCCESSFULLY);

        let updatedAvailability: IAvailability | null;
        const existingAvailability = await this._workerRepository.findAvailabilityByWorkerId(workerId);

        if (existingAvailability) {
            updatedAvailability = await this._workerRepository.updateAvailability(workerId, availability);
            if (!updatedAvailability) throw new Error(WORKER_MESSAGE.FAILDTO_UPDATE_AVAILABILITY);
        } else {
            updatedAvailability = await this._workerRepository.setAvailability(availability);
            if (!updatedAvailability) throw new Error(WORKER_MESSAGE.FAILDTO_CREATE_AVAILABILITY);
        }

        const updatedWorker: IWorkerDTO = mapWorkerToDTO(updatedWorkerEntity);

        return { updatedWorker, updatedAvailability };
    }


    async forgotPass(email: string): Promise<string> {
        const otp = generateOTP()
        await emailService(email, otp);
        saveOtp(email, otp);
        return otp;
    }

    async resendOtp(email: string): Promise<string> {
        deleteOtp(email)
        return this.forgotPass(email);
    }

    async getUserById(id: string): Promise<IWorker | null> {
        const user = this._workerRepository.findById(id);
        return user
    }

    async getUserByEmail(email: string): Promise<IWorker | null> {
        const user = this._workerRepository.findByEmail(email);
        return user
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const record = getOtp(email);

        if (!record) throw new Error(WORKER_MESSAGE.NO_OTP_FOUND);
        if (Date.now() > record.expiresAt) {
            deleteOtp(email);
            throw new Error(WORKER_MESSAGE.OTP_EXPIRED);
        }

        if (record.otp !== otp.toString()) {
            throw new Error(WORKER_MESSAGE.INVALID_OTP);
        }
        deleteOtp(email);
        return true;
    }

    async resetPass(email: string, password: string): Promise<void> {
        const hashedPass = await bcrypt.hash(password, 10);
        await this._workerRepository.resetPassword(email, hashedPass);
    }

    async updateWorker(workerData: Partial<IWorker>): Promise<boolean> {
        if (!workerData || !workerData._id) {
            throw new Error(WORKER_MESSAGE.WORKER_DATA_OR_ID_NOT_GET)
        }
        await this._workerRepository.update(workerData);
        return true;
    }

}