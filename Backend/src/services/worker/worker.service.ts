import bcrypt from "bcrypt"
import { generate_Access_Token, generate_Refresh_Token } from "../../utilities/generateToken";
import mapWorkerToDTO, { mapWorkerToEntity } from "../../mappers/worker/worker.map.DTO";
import { IWorker } from "../../model/worker/worker.interface";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { generateOTP } from "../../utilities/generateOtp";
import { emailService } from "../../utilities/emailService";
import { deleteOtp, getOtp, saveOtp } from "../../utilities/otpStore";
import { IWorkerDTO } from "../../mappers/worker/worker.map.DTO.interface";
import { IWorkerService } from "./worker.service.interface";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { WORKER_MESSAGE } from "../../constants/messages";
import { IWork } from "../../model/work/work.interface";
import { IAvailabilityRepository } from "../../repositories/availability/availability.repo.interface";
import { IWorkerRepository } from "../../repositories/worker/worker.repo.interface";
import { IWalletRepository } from "../../repositories/wallet/wallet.repo.interface";
import { IWallet } from "../../model/wallet/wallet.interface.model";
import { OAuth2Client } from "google-auth-library";
import { IAvailabilityDTO } from "../../mappers/availability/availability.map.DTO.interface";
import { mapWalletToDTO, mapWalletToEntity } from "../../mappers/wallet/map.wallet.DTO";
import { mapAvailabilityToDTO, mapAvailabilityToEntity } from "../../mappers/availability/availability.map.DTO";
import { IWalletDTO } from "../../mappers/wallet/map.wallet.DTO.interface";
import { Types } from "mongoose";
import logger from "../../utilities/logger";

const client = new OAuth2Client();

@injectable()
export class WorkerService implements IWorkerService {
    private _workerRepository: IWorkerRepository
    private _availabilityRepository: IAvailabilityRepository
    private _walletRepository: IWalletRepository
    constructor(
        @inject(TYPES.workerRepository) workerRepo: IWorkerRepository,
        @inject(TYPES.availabilityRepository) availibilityRepo: IAvailabilityRepository,
        @inject(TYPES.walletRepository) walletRepo: IWalletRepository,
    ) {
        this._workerRepository = workerRepo;
        this._availabilityRepository = availibilityRepo;
        this._walletRepository = walletRepo;
    }

    async loginWorker(credentials: { email: string, password: string }): Promise<{
        accessToken: string,
        refreshToken: string,
        worker: IWorkerDTO,
        wallet: IWalletDTO | null,
        availability?: IAvailabilityDTO
    }> {
        try {
            const existingWorker = await this._workerRepository.findByEmail(credentials.email);
            if (!existingWorker || existingWorker.role !== "Worker") {
                throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER);
            }

            if (existingWorker.isActive == false) {
                throw new Error(WORKER_MESSAGE.WORKER_BLOCKED)
            }

            let existingAvailability: IAvailability | undefined | null;
            let availability: IAvailabilityDTO | null = null;

            if (existingWorker.isAccountBuilt) {
                existingAvailability = await this._availabilityRepository.findByWorkerId(existingWorker.id);

                if (!existingAvailability) {
                    throw new Error(WORKER_MESSAGE.CANT_FIND_AVAILABILITY);
                }
                availability = mapAvailabilityToDTO(existingAvailability)
            }

            const matchPass = await bcrypt.compare(credentials.password, existingWorker.password);
            if (!matchPass) {
                throw new Error(WORKER_MESSAGE.INVALID_PASS);
            }

            const accessToken = generate_Access_Token(existingWorker.id.toString(), existingWorker.role);
            const refreshToken = generate_Refresh_Token(existingWorker.id.toString(), existingWorker.role);
            const walletData = await this._walletRepository.findByUser(existingWorker.id);
            const wallet = mapWalletToDTO(walletData as IWallet)
            const worker = mapWorkerToDTO(existingWorker);

            return {
                accessToken,
                refreshToken,
                worker,
                wallet,
                availability: availability ?? undefined
            };
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async registerWorker(workerData: Partial<IWorker>): Promise<{
        accessToken: string,
        refreshToken: string,
        worker: IWorkerDTO,
        wallet: IWalletDTO | null
    }> {
        try {
            if (!workerData.name || !workerData.email || !workerData.password || !workerData.phone || !workerData.categories || !workerData.location) {
                throw new Error(WORKER_MESSAGE.ALL_FIELDS_ARE_REQUIRED);
            }

            const existingWorker = await this._workerRepository.findByEmail(workerData.email);
            if (existingWorker) {
                throw new Error(WORKER_MESSAGE.WORKER_ALREADY_EXIST);
            }

            const hashedPass = await bcrypt.hash(workerData.password, 10);
            workerData.password = hashedPass;
            const workerEntity = await mapWorkerToEntity(workerData);
            const newWorker = await this._workerRepository.create(workerEntity);
            const worker = mapWorkerToDTO(newWorker as IWorker);

            const initializeWallet = {
                userId: new Types.ObjectId(newWorker?._id?.toString()),
                balance: 0,
                currency: "INR",
                transactions: []
            };

            const walletEntity = mapWalletToEntity(initializeWallet)
            await this._walletRepository.create(walletEntity)

            const newWallet = await this._walletRepository.findByUser(newWorker.id);
            const wallet = mapWalletToDTO(newWallet as IWallet);

            const accessToken = generate_Access_Token(newWorker.id.toString(), newWorker.role);
            const refreshToken = generate_Refresh_Token(newWorker.id.toString(), newWorker.role);

            return { accessToken, refreshToken, worker, wallet };
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async buildAccount(
        workerId: string,
        availability: IAvailability,
        workerData: Partial<IWorker>
    ): Promise<{ updatedWorker: IWorkerDTO; updatedAvailability: IAvailabilityDTO | null }> {
        try {
            const existingWorker = await this._workerRepository.findWorkerById(workerId);
            if (!existingWorker) throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER);

            const updatedFields: Partial<IWorker> = {
                profileImage: workerData.profileImage,
                bio: workerData.bio,
                age: workerData.age,
                services: workerData.services,
                radius: workerData.radius,
                preferredSchedule: workerData.preferredSchedule,
                govId: workerData.govId,
                isAccountBuilt: true
            };

            const updatedWorkerEntity = await this._workerRepository.findByIdAndUpdate(workerId, updatedFields);
            if (!updatedWorkerEntity) throw new Error(WORKER_MESSAGE.UPDATE_WORKER_SUCCESSFULLY);

            let updatedAvailability: IAvailabilityDTO | null = null;
            const existingAvailability = await this._workerRepository.findAvailabilityByWorkerId(workerId);

            if (existingAvailability) {
                const updatedFields = mapAvailabilityToEntity(availability);
                const updatedValue = await this._workerRepository.updateAvailability(workerId, updatedFields);

                if (!updatedValue) throw new Error(WORKER_MESSAGE.FAILDTO_UPDATE_AVAILABILITY);

                updatedAvailability = mapAvailabilityToDTO(updatedValue);
            } else {
                const createdValue = await this._workerRepository.setAvailability(availability);

                if (!createdValue) throw new Error(WORKER_MESSAGE.FAILDTO_CREATE_AVAILABILITY);

                updatedAvailability = mapAvailabilityToDTO(createdValue);
            }

            const updatedWorker: IWorkerDTO = mapWorkerToDTO(updatedWorkerEntity);

            return { updatedWorker, updatedAvailability };
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async forgotPass(email: string): Promise<string> {
        try {
            const otp = generateOTP();
            await emailService(email, otp, "RESET_PASSWORD");
            saveOtp(email, otp);
            return otp;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async resendOtp(email: string): Promise<string> {
        try {
            deleteOtp(email);
            return await this.forgotPass(email);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async getUserById(userId: string): Promise<IWorkerDTO | null> {
        try {
            const findUser = await this._workerRepository.findWorkerById(userId);
            if (!findUser) throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER);
            return mapWorkerToDTO(findUser);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async getUserByEmail(email: string): Promise<IWorkerDTO | null> {
        try {
            const findUser = await this._workerRepository.findByEmail(email);
            if (!findUser) throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER);
            return mapWorkerToDTO(findUser);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        try {
            const record = getOtp(email);
            if (!record) throw new Error(WORKER_MESSAGE.NO_OTP_FOUND);
            if (Date.now() > record.expiresAt) {
                deleteOtp(email);
                throw new Error(WORKER_MESSAGE.OTP_EXPIRED);
            }
            if (record.otp !== otp.toString()) throw new Error(WORKER_MESSAGE.INVALID_OTP);
            deleteOtp(email);
            return true;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async resetPass(email: string, password: string): Promise<void> {
        try {
            const hashedPass = await bcrypt.hash(password, 10);
            await this._workerRepository.resetPassword(email, hashedPass);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async updateWorker(workerData: Partial<IWorker>): Promise<boolean> {
        try {
            if (!workerData || !workerData._id) {
                throw new Error(WORKER_MESSAGE.WORKER_DATA_OR_ID_NOT_GET);
            }
            const workerEntity = await mapWorkerToEntity(workerData);
            await this._workerRepository.update(workerEntity);
            return true;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async searchWorker(searchTerm: Partial<IWork>): Promise<IWorkerDTO[]> {
        try {
            if (!searchTerm) {
                throw new Error("Search term not provided");
            }

            const { location, serviceId, categoryId } = searchTerm;
            if (!location?.lat || !location?.lng || !serviceId || !categoryId) {
                throw new Error("All search terms are required: location, workType, serviceId, categoryId");
            }

            const filteredWorkers = await this._workerRepository.search(searchTerm);
            return filteredWorkers.map(mapWorkerToDTO);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to search workers: ${errMsg}`);
        }
    }

    async findWorkersByIds(workerIds: string[]): Promise<IWorkerDTO[]> {
        try {
            if (!workerIds || workerIds.length === 0) {
                throw new Error(WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID);
            }

            const workers = await this._workerRepository.findWorkersByIds(workerIds);
            return workers.map(mapWorkerToDTO);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to find workers by IDs: ${errMsg}`);
        }
    }

    async googleLogin(credential: string): Promise<{
        accessToken: string;
        refreshToken: string;
        worker: IWorkerDTO;
        wallet: IWalletDTO | null;
        availability?: IAvailabilityDTO
    }> {

        try {
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();

            if (!payload?.email) throw new Error(WORKER_MESSAGE.GOOGLE_LOGIN_FAILED);

            const existingWorker = await this._workerRepository.findByEmail(payload.email);
            if (!existingWorker || existingWorker.role !== "Worker") {
                throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER_SIGNUP_FIRST);
            }

            if (existingWorker.isActive === false) {
                throw new Error(WORKER_MESSAGE.WORKER_BLOCKED);
            }

            let existingAvailability: IAvailabilityDTO | undefined | null;
            let existingvalue: IAvailability | null;

            if (existingWorker.isAccountBuilt) {
                existingvalue = await this._availabilityRepository.findByWorkerId(existingWorker.id);
                existingAvailability = mapAvailabilityToDTO(existingvalue as IAvailability)
                if (!existingAvailability) {
                    throw new Error(WORKER_MESSAGE.CANT_FIND_AVAILABILITY);
                }
            }

            const accessToken = generate_Access_Token(existingWorker.id.toString(), existingWorker.role);
            const refreshToken = generate_Refresh_Token(existingWorker.id.toString(), existingWorker.role);
            const findWallet = await this._walletRepository.findByUser(existingWorker.id);
            const wallet = mapWalletToDTO(findWallet as IWallet)
            const worker = mapWorkerToDTO(existingWorker);

            return {
                accessToken,
                refreshToken,
                worker,
                wallet,
                availability: existingAvailability ?? undefined,
            };
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            throw new Error(errMsg);
        }
    }

    async findWallet(workerId: string): Promise<IWalletDTO | null> {
        try {
            if (!workerId) {
                throw new Error("Worker ID not provided");
            }
            const wallet = await this._walletRepository.findByUser(workerId);
            return mapWalletToDTO(wallet as IWallet);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(`Failed to find wallet: ${errMsg}`);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getEarnings(filter: string, workerId: string): Promise<any[] | undefined> {
        try {
            if (!filter || !workerId) {
                throw new Error("Worker ID or filter not provided");
            }
            return await this._walletRepository.getEarnings(workerId, filter);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(`Failed to get earnings: ${errMsg}`);
        }
    }

    async rateWorker(workerId: string, rating: number): Promise<{ average: number; ratingsCount: number; }> {
        try {
            if (!workerId) {
                throw new Error(WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID);
            }
            if (rating == null) {
                throw new Error("Rating not provided");
            }
            return await this._workerRepository.rateWorker(workerId, rating);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(`Failed to rate worker: ${errMsg}`);
        }
    }

    async findById(id: string): Promise<IWorkerDTO | null> {
        try {
            if (!id) {
                throw new Error(WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID)
            }
            const worker = await this._workerRepository.findWorkerById(id);
            if (worker) {
                return mapWorkerToDTO(worker)
            } else {
                return null;
            }
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(`Failed to rate worker: ${errMsg}`);
        }
    }

    async updateCompletedWorks(workerId: string): Promise<void> {
        try {
            if (!workerId) {
                throw new Error(WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID)
            }
            await this._workerRepository.updateCompletedWorks(workerId);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(`Failed to rate worker: ${errMsg}`);
        }
    }

    async reApprovalRequest(workerId: string): Promise<void> {
        try {
            if (!workerId) {
                throw new Error(WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID)
            }
            await this._workerRepository.reApprovalRequest(workerId);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(`Failed to reApprovalRequest: ${errMsg}`);
        }
    }

}