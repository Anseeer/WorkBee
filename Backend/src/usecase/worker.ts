import jwt, { Secret } from 'jsonwebtoken';
import { IWorker } from "../domain/entities/IWorker";
import { workerRepository } from "../repository/workerRepository";
import bcrypt from "bcrypt"
import { IAvailability } from '../domain/entities/IAvailability';

export class workerUsecase {
    private WorkerRepository: workerRepository
    constructor(WorkerRepository: workerRepository) {
        this.WorkerRepository = WorkerRepository;
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

        const secret: Secret = process.env.JWT_SECRET as string;
        const expiresIn = (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '1d';
        const token = jwt.sign(
            { id: newWorker._id, role: newWorker.role },
            secret,
            { expiresIn }
        );


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
}