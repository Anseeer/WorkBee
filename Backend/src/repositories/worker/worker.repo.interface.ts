import { IWorkerEntity } from "../../mappers/worker/worker.map.DTO.interface";
import { ISubscription } from "../../model/subscription/subscription.interface";
import { IWorker } from "../../model/worker/worker.interface";
import { ISearchTerm } from "../../utilities/Types";

export interface IWorkerRepository {
    find(): Promise<IWorker[] | []>;
    create(user: Partial<IWorker | IWorkerEntity>): Promise<IWorker>;
    findByEmail(email: string): Promise<IWorker | null>;
    findWorkerById(workerId: string): Promise<IWorker | null>;
    resetPassword(email: string, hashedPass: string): Promise<boolean>;
    findByIdAndUpdate(workerId: string, updatedFields: Partial<IWorker>): Promise<IWorker | null>;
    getAllWorkers(): Promise<IWorker[]>;
    getAllNonVerifiedWorkers(): Promise<IWorker[]>;
    setIsActive(workerId: string): Promise<boolean>;
    approveWorker(workerId: string): Promise<boolean>;
    rejectedWorker(workerId: string, reason: string): Promise<boolean>;
    update(worker: Partial<IWorker | IWorkerEntity>): Promise<boolean>;
    search(searchTerms: ISearchTerm): Promise<IWorker[]>;
    findWorkersByIds(workerIds: string[]): Promise<IWorker[]>;
    rateWorker(workerId: string, rating: number): Promise<{ average: number, ratingsCount: number }>;
    updateCompletedWorks(workerId: string): Promise<void>;
    setSubscriptionPlan(workerId: string, planData: Partial<ISubscription>): Promise<IWorker>;
    setPlanExpired(workerId: string): Promise<boolean>;
    reApprovalRequest(workerId: string): Promise<boolean>;
}
