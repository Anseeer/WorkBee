import { IServices } from "../../model/service/service.interface";
import { IWork } from "../../model/work/work.interface";
import { TopThreeResult } from "../../utilities/Types";

export interface IWorkRepository {
    create(workDetails: Partial<IWork>): Promise<IWork>;
    findByUser(userId: string): Promise<IWork[]>;
    findByWorker(workerId: string): Promise<IWork[]>;
    cancel(workId: string): Promise<boolean>;
    accept(workId: string): Promise<boolean>;
    findById(workId: string): Promise<IWork | null>;
    setIsWorkCompleted(workId: string, hoursWorked: string, commisionPercentage: string): Promise<boolean>;
    getAllWorks(): Promise<IWork[]>;
    getAssignedWorks(workerId: string): Promise<IWork[]>;
    getRequestedWorks(workerId: string): Promise<IWork[]>;
    getTopThree(): Promise<TopThreeResult[]>;
    updatePaymentStatus(workId: string, status: string, totalAmount: string): Promise<void>;
    getTopServices(limit: number): Promise<IServices[]>
}