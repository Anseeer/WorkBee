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
import { Wallet } from "../../model/wallet/wallet.model";
import { IWalletRepository } from "../../repositories/wallet/wallet.repo.interface";
import { IWallet } from "../../model/wallet/wallet.interface.model";

const client = new OAuth2Client();

@injectable()
export class UserService implements IUserService {
    private _userRepository: IUserRepository;
    private _availabilityRepository: IAvailabilityRepository;
    private _walletRepository: IWalletRepository;
    constructor(
        @inject(TYPES.userRepository) userRepo: IUserRepository,
        @inject(TYPES.availabilityRepository) availabilityRepo: IAvailabilityRepository,
        @inject(TYPES.walletRepository) walletRepo: IWalletRepository
    ) {
        this._userRepository = userRepo;
        this._availabilityRepository = availabilityRepo;
        this._walletRepository = walletRepo;
    }

    async registerUser(userData: Partial<Iuser>): Promise<{ user: IUserDTO, accessToken: string, refreshToken: string, wallet: IWallet | null }> {
        if (!userData.email || !userData.password || !userData.name || !userData.location || !userData.phone) {
            throw new Error(USERS_MESSAGE.ALL_FIELDS_REQUIRED_FOR_REGISTRATION);
        }

        const userExist = await this._userRepository.findByEmail(userData.email);
        if (userExist) {
            throw new Error(USERS_MESSAGE.USER_ALREADY_EXISTS_WITH_EMAIL);
        }

        const hashedPass = await bcrypt.hash(userData.password, 10)
        userData.password = hashedPass;
        const userEntity = await mapToUserEntity(userData);
        const newUser = await this._userRepository.create(userEntity);

        await Wallet.create({
            userId: newUser._id,
            balance: 0,
            currency: "INR",
            transactions: []
        })

        const wallet = await this._walletRepository.findByUser(newUser.id);

        const accessToken = generate_Access_Token(newUser._id.toString(), newUser.role);
        const refreshToken = generate_Refresh_Token(newUser._id.toString(), newUser.role);

        const user = mapUserToDTO(newUser);

        return { user, accessToken, refreshToken, wallet };
    }

    async loginUser(email: string, password: string): Promise<{ user: IUserDTO; accessToken: string; refreshToken: string; wallet: IWallet | null }> {
        let findUser = await this._userRepository.findByEmail(email);
        if (!findUser || findUser.role !== "User") {
            throw new Error(USERS_MESSAGE.CANT_FIND_USER);
        }

        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
            throw new Error(USERS_MESSAGE.INVALID_CREDENTIALS);
        }

        if (findUser.isActive == false) {
            throw new Error(USERS_MESSAGE.USER_BLOCKED)
        }

        const wallet = await this._walletRepository.findByUser(findUser.id);

        const accessToken = generate_Access_Token(findUser._id.toString(), findUser.role);
        const refreshToken = generate_Refresh_Token(findUser._id.toString(), findUser.role);

        const user = await mapUserToDTO(findUser);

        return { user, accessToken, refreshToken, wallet };
    }

    async forgotPass(email: string): Promise<string> {
        const otp = await generateOTP()
        await emailService(email, otp);
        saveOtp(email, otp);
        return otp;
    }

    async resendOtp(email: string): Promise<string> {
        deleteOtp(email)
        return this.forgotPass(email);
    }

    async getUserById(id: string): Promise<Iuser | null> {
        const user = await this._userRepository.findById(id);
        return user
    }

    async getUserByEmail(email: string): Promise<Iuser | null> {
        const user = await this._userRepository.findByEmail(email);
        return user
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
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
    }

    async resetPass(email: string, password: string): Promise<void> {
        const hashedPass = await bcrypt.hash(password, 10);
        await this._userRepository.resetPassword(email, hashedPass);
    }

    async googleLogin(credential: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: IUserDTO;
        wallet: IWallet | null
    }> {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload?.email) throw new Error(USERS_MESSAGE.GOOGLE_LOGIN_FAILED);

        const existingUser = await this._userRepository.findByEmail(payload.email);
        if (!existingUser || existingUser.role !== "User") {
            throw new Error(USERS_MESSAGE.CANT_FIND_USER);
        }

        if (existingUser.isActive === false) {
            throw new Error(USERS_MESSAGE.USER_BLOCKED);
        }

        const wallet = await this._walletRepository.findByUser(existingUser.id);
        const jwtAccessToken = generate_Access_Token(existingUser._id.toString(), existingUser.role);
        const jwtRefreshToken = generate_Refresh_Token(existingUser._id.toString(), existingUser.role);
        const userDTO: IUserDTO = mapUserToDTO(existingUser);

        return {
            accessToken: jwtAccessToken,
            refreshToken: jwtRefreshToken,
            user: userDTO,
            wallet
        };
    }

    async fetchAvailability(id: string): Promise<IAvailability | null> {
        const availability = await this._availabilityRepository.findByWorkerId(id);
        return availability;
    }

    async fetchData(userId: string): Promise<{ user: IUserDTO, wallet: IWallet | null }> {
        const userData = await this._userRepository.fetchData(userId);
        const wallet = await this._walletRepository.findByUser(userId);
        const user = mapUserToDTO(userData);
        return { user, wallet };
    }

    async update(userDetails: Iuser, userId: string): Promise<boolean> {
        const userData = await mapToUserEntity(userDetails);
        return await this._userRepository.update(userData, userId);
    }

    async findUsersByIds(userIds: string[]): Promise<IUserDTO[]> {
        if (!userIds) {
            throw new Error(USERS_MESSAGE.USER_ID_NOT_GET)
        }

        const users = await this._userRepository.findUsersByIds(userIds);

        return users.map((user) => mapUserToDTO(user));
    }

}