import { IWorkEntity } from "../../mappers/work/work.map.DTO.interface";
import { IWork } from "../../model/work/work.interface";

export interface IWorkRepository {
    create(workDetails: Partial<IWorkEntity>): Promise<IWork>;
    findByUser(userId: string): Promise<IWork[]>;
    findByWorker(workerId: string): Promise<IWork[]>;
    cancel(workId: string): Promise<boolean>;
    accept(workId: string): Promise<boolean>;
    findById(workId: string): Promise<IWork | null>;
    setIsWorkCompleted(workId: string): Promise<boolean>;
    getAllWorks(): Promise<IWork[]>;
}