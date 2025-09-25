import { IAvailabilitEntity } from "../../mappers/availability/availability.map.DTO.interface";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { IWork } from "../../model/work/work.interface";
import { IWorker } from "../../model/worker/worker.interface";

export interface IWorkerRepository {
    create(user: Partial<IWorker>): Promise<IWorker>;
    findById(id: string): Promise<IWorker | null>;
    findByEmail(email: string): Promise<IWorker | null>;
    resetPassword(email: string, hashedPass: string): Promise<boolean>;
    findByIdAndUpdate(id: string, updatedFields: Partial<IWorker>): Promise<IWorker | null>;
    findAvailabilityByWorkerId(id: string): Promise<IAvailability | null>;
    setAvailability(availability: IAvailability): Promise<IAvailability | null>;
    updateAvailability(id: string, availability: IAvailabilitEntity): Promise<IAvailability | null>;
    getAllWorkers(): Promise<IWorker[]>;
    getAllNonVerifiedWorkers(): Promise<IWorker[]>;
    setIsActive(id: string): Promise<boolean>;
    approveWorker(id: string): Promise<boolean>;
    rejectedWorker(id: string): Promise<boolean>;
    update(worker: Partial<IWorker>): Promise<boolean>;
    search(searchTerms: Partial<IWork>): Promise<IWorker[]>;
    findWorkersByIds(workerIds: string[]): Promise<IWorker[]>;
    rateWorker(workerId: string, rating: number): Promise<{ average: number, ratingsCount: number }>;
    updateCompletedWorks(workerId: string): Promise<void>;
}
