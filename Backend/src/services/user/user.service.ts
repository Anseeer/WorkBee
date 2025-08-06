import bcrypt from "bcrypt";
import { UserRepository } from "../../repositories/user/user.repo";
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


@injectable()
export class UserService implements IUserService {
    private _userRepository: UserRepository;
    private googleClient: OAuth2Client;
    constructor(@inject(TYPES.userRepository) userRepo: UserRepository) {
        this._userRepository = userRepo;
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async registerUser(userData: Partial<Iuser>): Promise<{ user: IUserDTO, token: string }> {
        if (!userData.email || !userData.password || !userData.name || !userData.location || !userData.phone) {
            throw new Error("All Fild is required for registration.");
        }

        const userExist = await this._userRepository.findByEmail(userData.email);
        if (userExist) {
            throw new Error('User Already Exist with This Email !');
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
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
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

        if (!record) throw new Error("No OTP found for this email");
        if (Date.now() > record.expiresAt) {
            deleteOtp(email);

            throw new Error("OTP expired");
        }

        if (record.otp !== otp.toString()) {
            throw new Error("Invalid OTP");
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
        if (!payload?.email) throw new Error("Google login failed");

        let user = await this._userRepository.findByEmail(payload.email);
        if (!user) {
            throw new Error("Cannot find user, please sign up");
        }

        const jwtToken = generateToken(user._id, user.role);
        const userDTO: IUserDTO = mapUserToDTO(user);

        return { token: jwtToken, user: userDTO };
    }

}