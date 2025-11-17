import { IAvailabilityDTO } from "../../mappers/availability/availability.map.DTO.interface";
import { IWalletDTO } from "../../mappers/wallet/map.wallet.DTO.interface";
import { IWorkerDTO } from "../../mappers/worker/worker.map.DTO.interface";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { IWork } from "../../model/work/work.interface";
import { IWorker } from "../../model/worker/worker.interface";

export interface IWorkerService {
    registerWorker(tempWorkerId: string, otp: string): Promise<{ accessToken: string, refreshToken: string, worker?: IWorkerDTO, wallet: IWalletDTO | null }>;
    findById(workerId: string): Promise<IWorkerDTO | null>;
    loginWorker(credentials: { email: string; password: string }): Promise<{ accessToken: string; refreshToken: string; worker: IWorkerDTO; wallet: IWalletDTO | null, availability?: IAvailabilityDTO }>;
    buildAccount(workerId: string, availability: IAvailability, workerData: Partial<IWorker>): Promise<{ updatedWorker: IWorkerDTO; updatedAvailability: IAvailabilityDTO | null }>;
    forgotPass(email: string): Promise<string>;
    resendOtp(email: string): Promise<string>;
    getUserById(userId: string): Promise<IWorkerDTO | null>;
    getUserByEmail(email: string): Promise<IWorkerDTO | null>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    resetPass(email: string, password: string): Promise<void>;
    updateWorker(workerData: IWorker): Promise<boolean>;
    searchWorker(serachTerm: Partial<IWork>): Promise<IWorkerDTO[]>;
    findWorkersByIds(workerIds: string[]): Promise<IWorkerDTO[]>;
    findWallet(workerId: string): Promise<IWalletDTO | null>;
    googleLogin(credential: string): Promise<{ accessToken: string; refreshToken: string; worker: IWorkerDTO; wallet: IWalletDTO | null, availability?: IAvailabilityDTO; }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getEarnings(filter: string, workerId: string): Promise<any[] | undefined>
    rateWorker(workerId: string, rating: number): Promise<{ average: number, ratingsCount: number }>
    updateCompletedWorks(workerId: string): Promise<void>;
    reApprovalRequest(workerId: string): Promise<void>;
}