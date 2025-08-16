import { IWork } from "../../model/work/work.interface";

export interface IWorkService {
    createWork(workDetails: IWork): Promise<IWork>;
    workDetails(workId: string): Promise<IWork>;
    fetchWorkHistoryByUser(userId: string): Promise<IWork[]>;
    fetchWorkHistoryByWorker(workerId: string): Promise<IWork[]>;
    cancel(workId: string): Promise<boolean>;
    accept(workId: string,workerId:string): Promise<boolean>;
    completed(workId: string): Promise<boolean>;
}