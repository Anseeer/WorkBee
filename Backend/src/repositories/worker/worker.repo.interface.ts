import { IAvailabilitEntity } from "../../mappers/availability/availability.map.DTO.interface";
import { IWorkerEntity } from "../../mappers/worker/worker.map.DTO.interface";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { ISubscription } from "../../model/subscription/subscription.interface";
import { IWork } from "../../model/work/work.interface";
import { IWorker } from "../../model/worker/worker.interface";

export interface IWorkerRepository {
    find(): Promise<IWorker[] | []>;
    create(user: Partial<IWorker | IWorkerEntity>): Promise<IWorker>;
    findById(workerId: string): Promise<IWorker | null>;
    findByEmail(email: string): Promise<IWorker | null>;
    resetPassword(email: string, hashedPass: string): Promise<boolean>;
    findByIdAndUpdate(workerId: string, updatedFields: Partial<IWorker>): Promise<IWorker | null>;
    findAvailabilityByWorkerId(workerId: string): Promise<IAvailability | null>;
    setAvailability(availability: IAvailability): Promise<IAvailability | null>;
    updateAvailability(iworkerIdd: string, availability: IAvailabilitEntity): Promise<IAvailability | null>;
    getAllWorkers(): Promise<IWorker[]>;
    getAllNonVerifiedWorkers(): Promise<IWorker[]>;
    setIsActive(workerId: string): Promise<boolean>;
    approveWorker(workerId: string): Promise<boolean>;
    rejectedWorker(workerId: string): Promise<boolean>;
    update(worker: Partial<IWorker | IWorkerEntity>): Promise<boolean>;
    search(searchTerms: Partial<IWork>): Promise<IWorker[]>;
    findWorkersByIds(workerIds: string[]): Promise<IWorker[]>;
    rateWorker(workerId: string, rating: number): Promise<{ average: number, ratingsCount: number }>;
    updateCompletedWorks(workerId: string): Promise<void>;
    setSubscriptionPlan(workerId: string, planData: Partial<ISubscription>): Promise<IWorker>;
    setPlanExpired(workerId: string): Promise<boolean>;
    reApprovalRequest(workerId: string): Promise<boolean>;
}
