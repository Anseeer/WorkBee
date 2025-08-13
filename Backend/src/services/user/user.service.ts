import bcrypt from "bcrypt";
import { Iuser } from "../../model/user/user.interface";
import { IUserDTO } from "../../mappers/user/user.map.DTO.interface";
import generateToken from "../../utilities/generateToken";
import { mapUserToDTO } from "../../mappers/user/user.map.DTO";
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

@injectable()
export class UserService implements IUserService {
    private _userRepository: IUserRepository;
    private _availabilityRepository: IAvailabilityRepository;
    private googleClient: OAuth2Client;
    constructor(
        @inject(TYPES.userRepository) userRepo: IUserRepository,
        @inject(TYPES.availabilityRepository) availabilityRepo: IAvailabilityRepository
    ) {
        this._userRepository = userRepo;
        this._availabilityRepository = availabilityRepo;
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async registerUser(userData: Partial<Iuser>): Promise<{ user: IUserDTO, token: string }> {
        if (!userData.email || !userData.password || !userData.name || !userData.location || !userData.phone) {
            throw new Error(USERS_MESSAGE.ALL_FIELDS_REQUIRED_FOR_REGISTRATION);
        }

        const userExist = await this._userRepository.findByEmail(userData.email);
        if (userExist) {
            throw new Error(USERS_MESSAGE.USER_ALREADY_EXISTS_WITH_EMAIL);
        }

        const hashedPass = await bcrypt.hash(userData.password, 10)
        userData.password = hashedPass;
        const newUser = await this._userRepository.create(userData);

        const token = generateToken(newUser._id.toString(), newUser.role);

        const user = mapUserToDTO(newUser);

        return { user, token };
    }

    async loginUser(email: string, password: string): Promise<{ user: IUserDTO; token: string }> {
        let findUser = await this._userRepository.findByEmail(email);
        if (!findUser || findUser.role !== "User") {
            throw new Error(USERS_MESSAGE.CAT_FIND_USER);
        }

        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
            throw new Error(USERS_MESSAGE.INVALID_CREDENTIALS);
        }

        if (findUser.isActive == false) {
            throw new Error(USERS_MESSAGE.USER_BLOCKED)
        }

        const token = generateToken(findUser._id.toString(), findUser.role);

        const user = await mapUserToDTO(findUser);

        return { user, token };
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

    async googleLogin(token: string): Promise<{ token: string; user: IUserDTO }> {
        const ticket = await this.googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload?.email) throw new Error(USERS_MESSAGE.GOOGLE_LOGIN_FAILED);

        let user = await this._userRepository.findByEmail(payload.email);
        if (!user) {
            throw new Error(USERS_MESSAGE.CAT_FIND_USER);
        }

        const jwtToken = generateToken(user._id, user.role);
        const userDTO: IUserDTO = mapUserToDTO(user);

        return { token: jwtToken, user: userDTO };
    }

    async fetchAvailability(id: string): Promise<IAvailability[] | null> {
        const availability = await this._availabilityRepository.findByWorkerId(id);
        return availability;
    }

    async fetchData(userId: string): Promise<IUserDTO> {
        const userData = await this._userRepository.fetchData(userId);
        const user = mapUserToDTO(userData);
        return user;
    }

    async update(userDetails: Iuser,userId:string): Promise<boolean> {
        return await this._userRepository.update(userDetails,userId);
    }

}