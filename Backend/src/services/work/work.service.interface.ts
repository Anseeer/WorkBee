import { IWork } from "../../model/work/work.interface";

export interface IWorkService {
    createWork(workDetails: IWork): Promise<IWork>;
    workDetails(workId: string): Promise<IWork>;
    fetchWorkHistoryByUser(userId: string,currentPage:string, pageSize:string): Promise<{paginatedWorks:IWork[],totalPages:number}>;
    fetchWorkHistoryByWorker(workerId: string,currentPage:string,pageSize:string): Promise<{paginatedWorkHistory:IWork[],totalPage:number}>;
    cancel(workId: string): Promise<boolean>;
    accept(workId: string): Promise<boolean>;
    completed(workId: string, workerId: string): Promise<boolean>;
    getAllWorks(currentPage:string,pageSize:string): Promise<{paginatedWorks :IWork[],totalPage:number}>;
}