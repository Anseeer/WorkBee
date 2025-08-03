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

@injectable()
export class WorkerService implements IWorkerService {
    private _workerRepository: WorkerRepository
    private _availabilityRepository: AvailabilityRepository
    constructor(
        @inject(TYPES.workerRepository) workerRepo: WorkerRepository,
        @inject(TYPES.availabilityRepository) availibilityRepo : AvailabilityRepository
    ) {
        this._workerRepository = workerRepo;    
        this._availabilityRepository = availibilityRepo;    
    }

    async loginWorker(credentials: { email: string, password: string }): Promise<{ token: string, worker: IWorkerDTO ,availability:IAvailability[]}> {

        const existingWorker = await this._workerRepository.findByEmail(credentials.email);
        if (!existingWorker) {
            throw new Error("Cant find the worker in this email , please signup !");
        }

        const existingAvailability = await this._availabilityRepository.findByWorkerId(existingWorker.id);

        if (!existingAvailability) {
            throw new Error("Cant find the availabilty in this worker");
        }

        const matchPass = await bcrypt.compare(credentials.password, existingWorker.password);
        if (!matchPass) {
            throw new Error("Password not match !");
        }

        const token = generateToken(existingWorker.id.toString(), existingWorker.role);
        console.log("ExistingWorker :", existingWorker);

        const worker = mapWorkerToDTO(existingWorker);

        return { token, worker ,availability:existingAvailability}
    }

    async registerWorker(workerData: Partial<IWorker>): Promise<{ token: string, worker: {} }> {

        if (!workerData.name || !workerData.email || !workerData.password || !workerData.phone || !workerData.categories || !workerData.location) {
            throw new Error("All fields are required");
        }

        const existingWorker = await this._workerRepository.findByEmail(workerData.email);
        if (existingWorker) {
            throw new Error("Worker already existing in the email");
        }

        const hashedPass = await bcrypt.hash(workerData.password, 10);
        workerData.password = hashedPass;
        const newWorker = await this._workerRepository.create(workerData);

        const token = generateToken(newWorker.id.toString(), newWorker.role);

        return { token, worker: newWorker };

    }

    async buildAccount(workerId: string, availability: IAvailability, workerData: Partial<IWorker>): Promise<{ updatedWorker: IWorkerDTO; updatedAvailability: IAvailability }> {

        const existingWorker = await this._workerRepository.findById(workerId);
        if (!existingWorker) throw new Error("Can't find the worker, please register");

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
        if (!updatedWorkerEntity) throw new Error("Failed to update worker");

        let updatedAvailability: IAvailability | null;
        const existingAvailability = await this._workerRepository.findAvailabilityByWorkerId(workerId);

        if (existingAvailability) {
            updatedAvailability = await this._workerRepository.updateAvailability(workerId, availability);
            if (!updatedAvailability) throw new Error("Failed to update availability");
        } else {
            updatedAvailability = await this._workerRepository.setAvailability(availability);
            if (!updatedAvailability) throw new Error("Failed to create availability");
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

        if (!record) throw new Error("No OTP found for this email");
        if (Date.now() > record.expiresAt) {
            deleteOtp(email);

            throw new Error("OTP expired");
        }

        if (record.otp !== otp.toString()) {
            throw new Error("Invalid OTP");
        }


        deleteOtp(email);
        return true;
    }

    async resetPass(email: string, password: string): Promise<void> {
        const hashedPass = await bcrypt.hash(password, 10);
        await this._workerRepository.resetPassword(email, hashedPass);
    }

}