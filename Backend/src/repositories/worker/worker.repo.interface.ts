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
    findAvailablityByWorkerId(id: string): Promise<IAvailability | null>;
    setAvailablity(availablity: IAvailability): Promise<IAvailability>;
    updateAvailablity(id: string, availability: IAvailability): Promise<UpdateWriteOpResult>;
}
