import bcrypt from "bcrypt";
import { Iuser } from "../../model/user/user.interface";
import { IUserDTO } from "../../mappers/user/user.map.DTO.interface";
import { generate_Access_Token, generate_Refresh_Token } from "../../utilities/generateToken";
import { mapToUserEntity, mapUserToDTO } from "../../mappers/user/user.map.DTO";
import { generateOTP } from "../../utilities/generateOtp";
import { emailService } from "../../utilities/emailService";
import { deleteOtp, getOtp, saveOtp } from "../../utilities/otpStore";
import { IUserService } from "./user.service.interface";
import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { OAuth2Client } from "google-auth-library";
import { IUserRepository } from "../../repositories/user/user.repo.interface";
import { USERS_MESSAGE } from "../../constants/messages";
import { IAvailabilityRepository } from "../../repositories/availability/availability.repo.interface";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { IWalletRepository } from "../../repositories/wallet/wallet.repo.interface";
import { IWallet } from "../../model/wallet/wallet.interface.model";
import { mapAvailabilityToDTO } from "../../mappers/availability/availability.map.DTO";
import { IAvailabilityDTO } from "../../mappers/availability/availability.map.DTO.interface";
import { mapWalletToDTO, mapWalletToEntity } from "../../mappers/wallet/map.wallet.DTO";
import { IWalletDTO } from "../../mappers/wallet/map.wallet.DTO.interface";
import { Types } from "mongoose";
import { Role } from "../../constants/role";
import logger from "../../utilities/logger";
import { ITempUserRepository } from "../../repositories/temp_user/temp.user.interface.repo";

const client = new OAuth2Client();

@injectable()
export class UserService implements IUserService {
    private _userRepository: IUserRepository;
    private _tempUserRepository: ITempUserRepository;
    private _availabilityRepository: IAvailabilityRepository;
    private _walletRepository: IWalletRepository;
    constructor(
        @inject(TYPES.userRepository) userRepo: IUserRepository,
        @inject(TYPES.tempUserRepository) tempUserRepo: ITempUserRepository,
        @inject(TYPES.availabilityRepository) availabilityRepo: IAvailabilityRepository,
        @inject(TYPES.walletRepository) walletRepo: IWalletRepository
    ) {
        this._userRepository = userRepo;
        this._tempUserRepository = tempUserRepo;
        this._availabilityRepository = availabilityRepo;
        this._walletRepository = walletRepo;
    }

    async verifyRegister(verifyData: { userId: string, otp: string }): Promise<{ user: IUserDTO, accessToken: string, refreshToken: string, wallet: IWalletDTO | null }> {
        try {
            if (!verifyData.userId || !verifyData.otp) {
                throw new Error(USERS_MESSAGE.INVALID_CREDENTIALS_IN_VERIFY_REGISTER);
            }

            const userExist = await this._tempUserRepository.findById(verifyData.userId);
            if (!userExist) {
                throw new Error(USERS_MESSAGE.CANT_FIND_USER_REGISTER_FIRST);
            }

            if (userExist.otp !== verifyData.otp) {
                throw new Error(USERS_MESSAGE.INVALID_OTP)
            }

            const userData = {
                _id: userExist.id,
                name: userExist.name,
                email: userExist.email,
                phone: userExist.phone,
                password: userExist.password,
                location: userExist.location,
                profileImage: userExist.profileImage,
                isActive: true,
                role: 'User',
                createdAt: userExist.createdAt,
                updatedAt: userExist.updatedAt
            }

            const userEntity = await mapToUserEntity(userData);
            const newUser = await this._userRepository.create(userEntity);

            const initializeWallet = {
                userId: new Types.ObjectId(newUser?._id),
                balance: 0,
                currency: "INR",
                transactions: []
            }

            const walletEntity = mapWalletToEntity(initializeWallet);
            await this._walletRepository.create(walletEntity);

            const walletData = await this._walletRepository.findByUser(newUser.id);

            const accessToken = generate_Access_Token(newUser._id.toString(), newUser.role);
            const refreshToken = generate_Refresh_Token(newUser._id.toString(), newUser.role);

            const user = mapUserToDTO(newUser);
            const wallet = mapWalletToDTO(walletData as IWallet);

            await this._tempUserRepository.delete(verifyData.userId);

            return { user, accessToken, refreshToken, wallet };
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async loginUser(email: string, password: string): Promise<{ user: IUserDTO; accessToken: string; refreshToken: string; wallet: IWalletDTO | null }> {
        try {
            const findUser = await this._userRepository.findByEmail(email);
            if (!findUser || findUser.role !== Role.USER) {
                throw new Error(USERS_MESSAGE.CANT_FIND_USER);
            }

            const isMatch = await bcrypt.compare(password, findUser.password);
            if (!isMatch) {
                throw new Error(USERS_MESSAGE.INVALID_CREDENTIALS);
            }

            if (findUser.isActive == false) {
                throw new Error(USERS_MESSAGE.USER_BLOCKED);
            }

            const walletData = await this._walletRepository.findByUser(findUser.id);

            const accessToken = generate_Access_Token(findUser._id.toString(), findUser.role);
            const refreshToken = generate_Refresh_Token(findUser._id.toString(), findUser.role);

            const user = mapUserToDTO(findUser);
            const wallet = mapWalletToDTO(walletData as IWallet);

            return { user, accessToken, refreshToken, wallet };
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    async forgotPass(email: string): Promise<string> {
        try {
            const otp = await generateOTP();
            await emailService(email, otp, "RESET_PASSWORD");
            saveOtp(email, otp);
            return otp;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    async resendOtp(email: string): Promise<string> {
        try {
            deleteOtp(email);
            return await this.forgotPass(email);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    async getUserById(userId: string): Promise<IUserDTO | null> {
        try {
            const userData = await this._userRepository.findById(userId);
            const user = mapUserToDTO(userData as Iuser);
            return user;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    async getUserByEmail(email: string): Promise<IUserDTO | null> {
        try {
            const userData = await this._userRepository.findByEmail(email);
            const user = mapUserToDTO(userData as Iuser);
            return user;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        try {
            const record = await getOtp(email);

            if (!record) throw new Error(USERS_MESSAGE.NO_OTP_FOUND_FOR_THIS_EMAIL);
            if (Date.now() > record.expiresAt) {
                deleteOtp(email);
                throw new Error(USERS_MESSAGE.OTP_EXPIRED);
            }

            if (record.otp !== otp.toString()) {
                throw new Error(USERS_MESSAGE.INVALID_OTP);
            }

            deleteOtp(email);
            return true;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    async resetPass(email: string, password: string): Promise<void> {
        try {
            const hashedPass = await bcrypt.hash(password, 10);
            await this._userRepository.resetPassword(email, hashedPass);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    async googleLogin(credential: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: IUserDTO;
        wallet: IWalletDTO | null;
    }> {
        try {
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload?.email) throw new Error(USERS_MESSAGE.GOOGLE_LOGIN_FAILED);

            const existingUser = await this._userRepository.findByEmail(payload.email);
            if (!existingUser || existingUser.role !== Role.USER) {
                throw new Error(USERS_MESSAGE.CANT_FIND_USER_REGISTER_FIRST);
            }

            if (existingUser.isActive === false) {
                throw new Error(USERS_MESSAGE.USER_BLOCKED);
            }

            const walletData = await this._walletRepository.findByUser(existingUser.id);
            const jwtAccessToken = generate_Access_Token(existingUser._id.toString(), existingUser.role);
            const jwtRefreshToken = generate_Refresh_Token(existingUser._id.toString(), existingUser.role);
            const userDTO: IUserDTO = mapUserToDTO(existingUser);
            const walletDTO: IWalletDTO = mapWalletToDTO(walletData as IWallet);

            return {
                accessToken: jwtAccessToken,
                refreshToken: jwtRefreshToken,
                user: userDTO,
                wallet: walletDTO
            };
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    }

    async fetchAvailability(workerId: string): Promise<IAvailabilityDTO | null> {
        try {
            const availabilityData = await this._availabilityRepository.findByWorkerId(workerId);
            const availability = mapAvailabilityToDTO(availabilityData as IAvailability);
            return availability;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    async fetchData(userId: string): Promise<{ user: IUserDTO, wallet: IWalletDTO | null }> {
        try {
            const userData = await this._userRepository.fetchData(userId);
            const walletData = await this._walletRepository.findByUser(userId);
            const wallet = mapWalletToDTO(walletData as IWallet);
            const user = mapUserToDTO(userData);
            return { user, wallet };
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    async update(userDetails: Iuser, userId: string): Promise<boolean> {
        try {
            const userData = mapToUserEntity(userDetails);
            return await this._userRepository.update(userData, userId);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    async findUsersByIds(userIds: string[]): Promise<IUserDTO[]> {
        try {
            if (!userIds) {
                throw new Error(USERS_MESSAGE.USER_ID_NOT_GET);
            }

            const users = await this._userRepository.findUsersByIds(userIds);
            return users.map((user) => mapUserToDTO(user));
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

}