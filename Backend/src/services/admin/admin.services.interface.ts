import { IAvailabilityDTO } from "../../mappers/availability/availability.map.DTO.interface";
import { MappedEarningDTO } from "../../mappers/earnings/earnigsResult.DTO.interface";
import { IUserDTO } from "../../mappers/user/user.map.DTO.interface";
import { IWalletDTO } from "../../mappers/wallet/map.wallet.DTO.interface";
import { IWorkerDTO } from "../../mappers/worker/worker.map.DTO.interface";
import { Iuser } from "../../model/user/user.interface";

export interface IAdminService {
    login(adminData: Partial<Iuser>): Promise<{ admin: IUserDTO, accessToken: string, refreshToken: string }>;
    fetchUsers(currentPage: string, pageSize: string): Promise<{ users: IUserDTO[] | undefined, totalPage: number }>;
    setIsActiveUsers(id: string): Promise<boolean>;
    setIsActiveWorkers(id: string): Promise<boolean>;
    fetchWorkers(currentPage: string, pageSize: string): Promise<{ workers: IWorkerDTO[] | undefined, totalPage: number }>;
    fetchWorkersNonVerified(): Promise<IWorkerDTO[] | undefined>;
    fetchAvailability(id: string): Promise<IAvailabilityDTO | null>;
    approveWorker(id: string): Promise<void>;
    rejectedWorker(id: string): Promise<void>;
    fetchEarnings(userId: string | null, filter: string): Promise<MappedEarningDTO[]>;
    platformWallet(): Promise<IWalletDTO | null>;
}
