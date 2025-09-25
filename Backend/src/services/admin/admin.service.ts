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
import { IWalletRepository } from "../../repositories/wallet/wallet.repo.interface";
import { IWalletDTO } from "../../mappers/wallet/map.wallet.DTO.interface";
import { mapWalletToDTO } from "../../mappers/wallet/map.wallet.DTO";
import { IWallet } from "../../model/wallet/wallet.interface.model";
import { mapEarningsToDTO } from "../../mappers/earnings/earningsResult.mapToDTO";
import { MappedEarningDTO } from "../../mappers/earnings/earnigsResult.DTO.interface";

@injectable()
export class AdminService implements IAdminService {
    private _userRepository: IUserRepository;
    private _workerRepository: IWorkerRepository;
    private _availabilityRepository: IAvailabilityRepository;
    private _walletRepository: IWalletRepository;
    constructor(
        @inject(TYPES.userRepository) userRepo: IUserRepository,
        @inject(TYPES.workerRepository) workerRepo: IWorkerRepository,
        @inject(TYPES.availabilityRepository) availabilityRepo: IAvailabilityRepository,
        @inject(TYPES.walletRepository) walletRepo: IWalletRepository,
    ) {
        this._userRepository = userRepo;
        this._workerRepository = workerRepo;
        this._availabilityRepository = availabilityRepo;
        this._walletRepository = walletRepo;
    }

    async login(adminData: Partial<Iuser>): Promise<{ accessToken: string, refreshToken: string, admin: IUserDTO }> {
        try {
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
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async fetchUsers(currentPage: string, pageSize: string): Promise<{ users: IUserDTO[] | undefined, totalPage: number }> {
        try {
            const page = parseInt(currentPage);
            const size = parseInt(pageSize);
            const startIndex = (page - 1) * size;
            const endIndex = page * size;
            const allUsers = await this._userRepository.getAllUsers();
            const user = allUsers?.slice(startIndex, endIndex);
            const users = user?.map((item) => mapUserToDTO(item));
            const totalPage = Math.ceil(allUsers?.length as number / size);
            return { users, totalPage };
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async setIsActiveUsers(id: string): Promise<boolean> {
        try {
            if (!id) {
                throw new Error(ADMIN_MESSAGES.ID_NOT_RECEIVED);
            }
            return await this._userRepository.setIsActive(id);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async setIsActiveWorkers(id: string): Promise<boolean> {
        try {
            if (!id) {
                throw new Error(ADMIN_MESSAGES.ID_NOT_RECEIVED);
            }
            return await this._workerRepository.setIsActive(id);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async fetchWorkers(currentPage: string, pageSize: string): Promise<{ workers: IWorkerDTO[] | undefined, totalPage: number }> {
        try {
            const page = parseInt(currentPage);
            const size = parseInt(pageSize);
            const startIndex = (page - 1) * size;
            const endIndex = page * size;
            const allWorkers = await this._workerRepository.getAllWorkers();
            const worker = allWorkers.slice(startIndex, endIndex);
            const workers = worker.map((item) => mapWorkerToDTO(item));
            const totalPage = Math.ceil(allWorkers.length / size);
            return { workers, totalPage };
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async fetchWorkersNonVerified(): Promise<IWorkerDTO[] | undefined> {
        try {
            const allWorkers = await this._workerRepository.getAllNonVerifiedWorkers();
            const workers = allWorkers.map((item) => mapWorkerToDTO(item));
            return workers;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async fetchAvailability(id: string): Promise<IAvailabilityDTO | null> {
        try {
            const findAvailability = await this._availabilityRepository.findByWorkerId(id);
            const availability = mapAvailabilityToDTO(findAvailability as IAvailability);
            return availability;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async approveWorker(id: string): Promise<void> {
        try {
            await this._workerRepository.approveWorker(id);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async rejectedWorker(id: string): Promise<void> {
        try {
            await this._workerRepository.rejectedWorker(id);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async fetchEarnings(userId: string | null, filter: string): Promise<MappedEarningDTO[]> {
        try {
            const earnings = await this._walletRepository.getEarnings(null, filter);
            return await earnings.map((earn) => mapEarningsToDTO(earn));
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async platformWallet(): Promise<IWalletDTO | null> {
        try {
            const findWallet = await this._walletRepository.platformWallet();
            const wallet = mapWalletToDTO(findWallet as IWallet);
            return wallet;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

}