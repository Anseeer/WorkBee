import { generate_Access_Token, generate_Refresh_Token } from "../../utilities/generateToken";
import bcrypt from "bcrypt";
import { IAdminService } from "./admin.services.interface";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { mapUserToDTO } from "../../mappers/user/user.map.DTO";
import { IUserDTO } from "../../mappers/user/user.map.DTO.interface";
import mapWorkerToDTO from "../../mappers/worker/worker.map.DTO";
import { IWorkerDTO } from "../../mappers/worker/worker.map.DTO.interface";
import { Iuser } from "../../model/user/user.interface";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { IUserRepository } from "../../repositories/user/user.repo.interface";
import { IWorkerRepository } from "../../repositories/worker/worker.repo.interface";
import { IAvailabilityRepository } from "../../repositories/availability/availability.repo.interface";
import { ADMIN_MESSAGES } from "../../constants/messages";
import { IAvailabilityDTO } from "../../mappers/availability/availability.map.DTO.interface";
import { mapAvailabilityToDTO } from "../../mappers/availability/availability.map.DTO";
import { Role } from "../../constants/role";

@injectable()
export class AdminService implements IAdminService {
    private _userRepository: IUserRepository;
    private _workerRepository: IWorkerRepository;
    private _availabilityRepository: IAvailabilityRepository;
    constructor(
        @inject(TYPES.userRepository) userRepo: IUserRepository,
        @inject(TYPES.workerRepository) workerRepo: IWorkerRepository,
        @inject(TYPES.availabilityRepository) availabilityRepo: IAvailabilityRepository
    ) {
        this._userRepository = userRepo;
        this._workerRepository = workerRepo;
        this._availabilityRepository = availabilityRepo;
    }

    async login(adminData: Partial<Iuser>): Promise<{ accessToken: string, refreshToken: string, admin: IUserDTO }> {
        const existingAdmin = await this._userRepository.findByEmail(adminData.email!);
        if (!existingAdmin) {
            throw new Error(ADMIN_MESSAGES.CANT_FIND_ADMIN);
        }

        if (existingAdmin.role !== Role.ADMIN) {
            throw new Error(ADMIN_MESSAGES.CANT_FIND_ADMIN);
        }

        const matchPass = await bcrypt.compare(adminData.password!, existingAdmin.password);
        if (!matchPass) {
            throw new Error(ADMIN_MESSAGES.INVALID_PASSWORD);
        }

        const accessToken = generate_Access_Token(existingAdmin._id.toString(), existingAdmin.role);
        const refreshToken = generate_Refresh_Token(existingAdmin._id.toString(), existingAdmin.role);
        const admin = mapUserToDTO(existingAdmin);

        return { accessToken, refreshToken, admin };
    }

    async fetchUsers(currentPage: string, pageSize: string): Promise<{ users: IUserDTO[] | undefined, totalPage: number }> {
        const page = parseInt(currentPage);
        const size = parseInt(pageSize);
        const startIndex = (page - 1) * size;
        const endIndex = page * size;
        const allUsers = await this._userRepository.getAllUsers();
        const user = allUsers?.slice(startIndex, endIndex);
        const users = user?.map((item) => mapUserToDTO(item));
        const totalPage = Math.ceil(allUsers?.length as number / size);
        return { users, totalPage };
    }

    async setIsActiveUsers(id: string): Promise<boolean> {
        if (!id) {
            throw new Error(ADMIN_MESSAGES.ID_NOT_RECEIVED);
        }
        return await this._userRepository.setIsActive(id);
    }

    async setIsActiveWorkers(id: string): Promise<boolean> {
        if (!id) {
            throw new Error(ADMIN_MESSAGES.ID_NOT_RECEIVED);
        }
        return await this._workerRepository.setIsActive(id);
    }

    async fetchWorkers(currentPage: string, pageSize: string): Promise<{ workers: IWorkerDTO[] | undefined, totalPage: number }> {
        const page = parseInt(currentPage);
        const size = parseInt(pageSize);
        const startIndex = (page - 1) * size;
        const endIndex = page * size;
        const allWorkers = await this._workerRepository.getAllWorkers();
        const worker = allWorkers.slice(startIndex, endIndex);
        const workers = worker.map((item) => mapWorkerToDTO(item));
        const totalPage = Math.ceil(allWorkers.length / size);
        return { workers, totalPage };
    }

    async fetchWorkersNonVerified(): Promise<IWorkerDTO[] | undefined> {
        const allWorkers = await this._workerRepository.getAllNonVerifiedWorkers();
        const workers = allWorkers.map((item) => mapWorkerToDTO(item));
        return workers;
    }

    async fetchAvailability(id: string): Promise<IAvailabilityDTO | null> {
        const findAvailability = await this._availabilityRepository.findByWorkerId(id);
        const availability = mapAvailabilityToDTO(findAvailability as IAvailability);
        return availability;
    }

    async approveWorker(id: string): Promise<void> {
        await this._workerRepository.approveWorker(id);
    }

    async rejectedWorker(id: string): Promise<void> {
        await this._workerRepository.rejectedWorker(id);
    }

}