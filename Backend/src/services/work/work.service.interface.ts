import { IWorkDTO } from "../../mappers/work/work.map.DTO.interface";
import { IWork } from "../../model/work/work.interface";

export interface IWorkService {
    createWork(workDetails: IWork): Promise<IWorkDTO>;
    workDetails(workId: string): Promise<IWorkDTO>;
    fetchWorkHistoryByUser(userId: string, currentPage: string, pageSize: string): Promise<{ paginatedWorks: IWorkDTO[], totalPages: number }>;
    fetchWorkHistoryByWorker(workerId: string, currentPage: string, pageSize: string): Promise<{ paginatedWorkHistory: IWorkDTO[], totalPage: number }>;
    cancel(workId: string, id: string): Promise<boolean>;
    accept(workId: string): Promise<boolean>;
    completed(workId: string, workerId: string): Promise<boolean>;
    getAllWorks(currentPage: string, pageSize: string): Promise<{ paginatedWorks: IWorkDTO[], totalPage: number }>;
    getPendingWork(workerId: string): Promise<IWork[]>;
    getAssignedWorks(workerId: string): Promise<IWork[]>;
} 