import { UpdateWriteOpResult } from "mongoose";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { IWorker } from "../../model/worker/worker.interface";

export interface IWorkerRepository {
    create(user: Partial<IWorker>): Promise<IWorker>;
    findById(id: string): Promise<IWorker | null>;
    findByEmail(email: string): Promise<IWorker | null>;
    resetPassword(email: string, hashedPass: string): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    findByIdAndUpdate(id: string, updatedFields: Partial<IWorker>): Promise<IWorker | null>;
    findAvailabilityByWorkerId(id: string): Promise<IAvailability | null>;
    setAvailability(availability: IAvailability): Promise<IAvailability>;
    updateAvailability(id: string, availability: IAvailability): Promise<UpdateWriteOpResult>;
    getAllWorkers(): Promise<IWorker[]>;
    setIsActive(id: string): Promise<boolean>;
}
