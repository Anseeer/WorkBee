import { ITempWorker } from "../../model/temp_worker/temp.worker.interface";

export interface ITempWorkerService {
    register(workerData: ITempWorker): Promise<string>;
    resendOtp(tempWorkerId: string): Promise<string>;
}
