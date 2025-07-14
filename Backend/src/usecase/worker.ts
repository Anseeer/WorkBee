import { IWorker } from "../domain/entities/IWorker";
import { workerRepository } from "../repository/workerRepository";
import bcrypt from "bcrypt"
import { IAvailability } from '../domain/entities/IAvailability';
import generateToken from '../infastructure/services/generateAccessToken';
import mapWorkerToDTO from "../mappers/mapWorkerToDTO";
import { IWorkerResponseDTO } from "../domain/interfaces/IResponseDTO";
import { generateOTP } from "../infastructure/services/otpService";
import { emailService } from "../infastructure/services/emailService";
import { deleteOtp, getOtp, saveOtp } from "../utilities/otpStore";

export class workerUsecase {
    private WorkerRepository: workerRepository
    constructor(WorkerRepository: workerRepository) {
        this.WorkerRepository = WorkerRepository;
    }

    async loginWorker(credentials: { email: string, password: string }): Promise<{ token: string, worker: IWorkerResponseDTO }> {

        const existingWorker = await this.WorkerRepository.findByEmail(credentials.email);

        if (!existingWorker) {
            throw new Error("Cant find the worker in this email , please signup !");
        }

        const matchPass = await bcrypt.compare(credentials.password, existingWorker.password);
        if (!matchPass) {
            throw new Error("Password not match !");
        }

        const token = generateToken(existingWorker._id.toString(), existingWorker.role);
        console.log("ExistingWorker :", existingWorker);

        const worker = mapWorkerToDTO(existingWorker);

        return { token, worker}
    }

    async registerWorker(workerData: Partial<IWorker>): Promise<{ token: string, workerId: string }> {

        if (!workerData.name || !workerData.email || !workerData.password || !workerData.phone || !workerData.categories || !workerData.location) {
            throw new Error("All fields are required");
        }

        const existingWorker = await this.WorkerRepository.findByEmail(workerData.email);
        if (existingWorker) {
            throw new Error("Worker already existing in the email");
        }

        const hashedPass = await bcrypt.hash(workerData.password, 10);
        workerData.password = hashedPass;
        const newWorker = await this.WorkerRepository.create(workerData);

        const token = generateToken(newWorker._id.toString(), newWorker.role);

        return { token, workerId: newWorker._id as string };

    }

    async createWorker(workerId: string, availability: IAvailability, workerData: Partial<IWorker>): Promise<{ workerId: string }> {

        const existingWorker = await this.WorkerRepository.findById(workerId);
        if (!existingWorker) throw new Error("Can't find the worker, please register");

        const updatedFields: Partial<IWorker> = {
            profileImage: workerData.profileImage,
            bio: workerData.bio,
            age: workerData.age,
            services: workerData.services,
            workType: workerData.workType,
            minHours: workerData.minHours,
            preferredSchedule: workerData.preferredSchedule,
            govId: workerData.govId
        };

        const updatedWorker = await this.WorkerRepository.findByIdAndUpdate(workerId, updatedFields);
        if (!updatedWorker) throw new Error('Failed to update worker');

        const existingAvailability = await this.WorkerRepository.findAvailablityByWorkerId(workerId);

        if (existingAvailability) {
            const updated = await this.WorkerRepository.updateAvailablity(workerId, availability);
            if (!updated) throw new Error('Failed to update availability');
        } else {
            const created = await this.WorkerRepository.setAvailablity(availability);
            if (!created) throw new Error('Failed to create availability');
        }

        return { workerId };
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
            const user = this.WorkerRepository.findById(id);
            return user
        }
    
        async getUserByEmail(email: string): Promise<IWorker | null> {
            const user = this.WorkerRepository.findByEmail(email);
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
            await this.WorkerRepository.resetPassword(email, hashedPass);
        }
}