import { IWorkerDTO } from "../../mappers/worker/worker.map.DTO.interface";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { IWallet } from "../../model/wallet/wallet.interface.model";
import { IWork } from "../../model/work/work.interface";
import { IWorker } from "../../model/worker/worker.interface";


export interface IWorkerService {
    registerWorker(workerData: Partial<IWorker>): Promise<{ token: string, worker?: {}, wallet: IWallet | null }>;
    loginWorker(credentials: { email: string; password: string }): Promise<{
        token: string;
        worker: IWorkerDTO;
        wallet: IWallet | null,
        availability?: IAvailability;
    }>;
    buildAccount(workerId: string, availability: IAvailability, workerData: Partial<IWorker>): Promise<{ updatedWorker: IWorkerDTO; updatedAvailability: IAvailability }>;
    forgotPass(email: string): Promise<string>;
    resendOtp(email: string): Promise<string>;
    getUserById(id: string): Promise<IWorker | null>;
    getUserByEmail(email: string): Promise<IWorker | null>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    resetPass(email: string, password: string): Promise<void>;
    updateWorker(workerData: IWorker): Promise<boolean>;
    searchWorker(serachTerm: Partial<IWork>): Promise<IWorkerDTO[]>;
    findWorkersByIds(workerIds: string[]): Promise<IWorkerDTO[]>;
    googleLogin(credential: string): Promise<{
        token: string;
        worker: IWorkerDTO;
        wallet: IWallet | null,
        availability?: IAvailability;
    }>;

}
