import { IServiceDTO } from "../../mappers/service/service.map.DTO.interface";
import { IWorkDTO } from "../../mappers/work/work.map.DTO.interface";
import { IWork } from "../../model/work/work.interface";
import { TopThreeResultDTO } from "../../utilities/topThreeTypes";

export interface IWorkService {
    createWork(workDetails: IWork): Promise<IWorkDTO>;
    findById(workId: string): Promise<IWorkDTO | null>;
    workDetails(workId: string): Promise<IWorkDTO>;
    fetchWorkHistoryByUser(userId: string, currentPage: string, pageSize: string): Promise<{ paginatedWorks: IWorkDTO[], totalPages: number }>;
    fetchWorkHistoryByWorker(workerId: string, currentPage: string, pageSize: string): Promise<{ paginatedWorkHistory: IWorkDTO[], totalPage: number }>;
    cancel(workId: string, userId: string): Promise<boolean>;
    accept(workId: string): Promise<boolean>;
    completed(workId: string, workerId: string): Promise<boolean>;
    getAllWorks(currentPage: string, pageSize: string): Promise<{ paginatedWorks: IWorkDTO[], totalPage: number }>;
    getAssignedWorks(workerId: string): Promise<IWorkDTO[] | undefined>;
    getRequestedWorks(workerId: string): Promise<IWorkDTO[] | undefined>;
    getTopThree(): Promise<TopThreeResultDTO[] | undefined>;
    updatePaymentStatus(workId: string, status: string): Promise<void>;
    getTopServices(limit: number): Promise<IServiceDTO[]>;
} 