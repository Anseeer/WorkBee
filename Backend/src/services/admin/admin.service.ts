import generateToken from "../../utilities/generateToken";
import bcrypt from "bcrypt";
import { IAdminService } from "./admin.services.interface";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { UserRepository } from "../../repositories/user/user.repo";
import { mapUserToDTO } from "../../mappers/user/user.map.DTO";
import { IUserDTO } from "../../mappers/user/user.map.DTO.interface";
import { WorkerRepository } from "../../repositories/worker/worker.repo";
import mapWorkerToDTO from "../../mappers/worker/worker.map.DTO";
import { IWorkerDTO } from "../../mappers/worker/worker.map.DTO.interface";
import { Iuser } from "../../model/user/user.interface";

@injectable()
export class AdminService implements IAdminService {
    private _userRepository: UserRepository;
    private _workerRepository: WorkerRepository;
    constructor(
        @inject(TYPES.userRepository) userRepo: UserRepository,
        @inject(TYPES.workerRepository) workerRepo: WorkerRepository
    ) {
        this._userRepository = userRepo;
        this._workerRepository = workerRepo;
    }

    async login(adminData: Partial<Iuser>): Promise<{ token: string, admin: IUserDTO }> {
        const existingAdmin = await this._userRepository.findByEmail(adminData.email!);
        if (!existingAdmin) {
            throw new Error("Can't find the admin with this email.");
        }

        if (existingAdmin.role !== "Admin") {
            throw new Error("Can't role admin with this email.");
        }

        const matchPass = await bcrypt.compare(adminData.password!, existingAdmin.password);
        if (!matchPass) {
            throw new Error("Invalid Password");
        }

        const token = await generateToken(existingAdmin._id.toString(), existingAdmin.role);
        const admin = mapUserToDTO(existingAdmin);

        return { token, admin };
    }

    async fetchUsers(): Promise<IUserDTO[] | undefined> {
        const allUsers = await this._userRepository.getAllUsers();
        const users = allUsers?.map((item) => mapUserToDTO(item));
        return users;
    }

    async setIsActiveUsers(id: string): Promise<boolean> {
        if (!id) {
            throw new Error('id not get');
        }
        return await this._userRepository.setIsActive(id);
    }
    async setIsActiveWorkers(id: string): Promise<boolean> {
        if (!id) {
            throw new Error('id not get');
        }
        return await this._workerRepository.setIsActive(id);
    }

    async fetchWorkers(): Promise<IWorkerDTO[] | undefined> {
        const allWorkers = await this._workerRepository.getAllWorkers();
        const workers = allWorkers.map((item) => mapWorkerToDTO(item));
        return workers;
    }


}