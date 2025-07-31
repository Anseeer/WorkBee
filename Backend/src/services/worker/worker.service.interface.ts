import { IWorkerDTO } from "../../mappers/worker/worker.map.DTO.interface";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { IWorker } from "../../model/worker/worker.interface";


export interface IWorkerService {
    registerWorker(workerData: Partial<IWorker>):Promise<{ token: string, worker:{} }> ;
    loginWorker(credentials:{email:String,password:String}): Promise<{ token: string, worker: IWorkerDTO }>;
    buildAccount(workerId: string, availability: IAvailability, workerData: Partial<IWorker>): Promise<{ updatedWorker: IWorkerDTO; updatedAvailability: IAvailability }>;
    forgotPass(email: string): Promise<string>;
    resendOtp(email: string): Promise<string>;
    getUserById(id: string): Promise<IWorker | null>;
    getUserByEmail(email: string): Promise<IWorker | null>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    resetPass(email: string, password: string): Promise<void>;
}
