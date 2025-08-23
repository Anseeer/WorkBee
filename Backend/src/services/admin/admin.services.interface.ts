import { IUserDTO } from "../../mappers/user/user.map.DTO.interface";
import { IWorkerDTO } from "../../mappers/worker/worker.map.DTO.interface";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { Iuser } from "../../model/user/user.interface";

export interface IAdminService {
    login(adminData: Partial<Iuser>): Promise<{ admin: IUserDTO, accessToken: string, refreshToken: string }>;
    fetchUsers(currentPage:string,pageSize:string): Promise<{users:IUserDTO[] | undefined,totalPage:number}>;
    setIsActiveUsers(id: string): Promise<boolean>;
    setIsActiveWorkers(id: string): Promise<boolean>;
    fetchWorkers(currentPage:string,pageSize:string): Promise<{workers:IWorkerDTO[] | undefined,totalPage:number}>;
    fetchWorkersNonVerified(): Promise<IWorkerDTO[] | undefined>;
    fetchAvailability(id: string): Promise<IAvailability | null>;
    approveWorker(id: string): Promise<void>;
    rejectedWorker(id: string): Promise<void>;
}
