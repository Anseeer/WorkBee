import { IUserDTO } from "../../mappers/user/user.map.DTO.interface";
import { IWorkerDTO } from "../../mappers/worker/worker.map.DTO.interface";
import { Iuser } from "../../model/user/user.interface";

export interface IAdminService {
    login(adminData: Partial<Iuser>): Promise<{ admin: IUserDTO, token: string }>;
    fetchUsers(): Promise<IUserDTO[] | undefined>;
    setIsActiveUsers(id: string): Promise<boolean>;
    setIsActiveWorkers(id: string): Promise<boolean>;
    fetchWorkers(): Promise<IWorkerDTO[] | undefined>;
}
