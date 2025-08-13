import { IWork } from "../../model/work/work.interface";

export interface IWorkService {
    createWork(workDetails: IWork): Promise<IWork>;
    fetchWorkHistoryByUser(userId: string): Promise<IWork[]>;
    fetchWorkHistoryByWorker(workerId: string): Promise<IWork[]>;
    cancel(workId: string): Promise<boolean>;
}