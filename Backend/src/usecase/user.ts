import { UserRepository } from "../repository/user.repository";
import bcrypt from "bcrypt";
import jwt, { Secret } from 'jsonwebtoken';
import { deleteOtp, getOtp, saveOtp } from "../utilities/otpStore";
import { Iuser } from "../domain/entities/IUser";
import { generateOTP } from "../infastructure/services/otpService";
import { emailService } from "../infastructure/services/emailService";
import { mapUserToDTO } from "../mappers/mapUserToDTO ";
import { IUserResponseDTO } from "../domain/interfaces/IUserResponseDTO";


export class userUsecase {
    private userRepository: UserRepository;
    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async registerUser(userData: Partial<Iuser>): Promise<{ user: IUserResponseDTO, token: string }> {
        if (!userData.email || !userData.password || !userData.name || !userData.location || !userData.phone) {
            throw new Error("All Fild is required for registration.");
        }

        const userExist = await this.userRepository.findByEmail(userData.email);
        if (userExist) {
            throw new Error('User Already Exist with This Email !');
        }

        const hashedPass = await bcrypt.hash(userData.password, 10)
        userData.password = hashedPass;
        const newUser = await this.userRepository.create(userData);

        const secret: Secret = process.env.JWT_SECRET as string;
        const expiresIn = (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '1d';
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            secret,
            { expiresIn }
        );

        const user = mapUserToDTO(newUser);

        return { user, token };
    }

    async loginUser(email: string, password: string): Promise<{ user: IUserResponseDTO; token: string }> {
        let findUser = await this.userRepository.findByEmail(email);
        if (!findUser) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const secret: Secret = process.env.JWT_SECRET as string;
        const expiresIn = (process.env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']) || '1d';

        const token = jwt.sign(
            { id: findUser._id, role: findUser.role },
            secret,
            { expiresIn }
        );

        const user = mapUserToDTO(findUser);

        return { user, token };
    }

    async forgotPass(email: string): Promise<string> {
        const otp = generateOTP()
        await emailService(email, otp);
        saveOtp(email, otp);
        return otp;
    }

    async resendOtp(email: string): Promise<string> {
        deleteOtp(email)
        return this.forgotPass(email);
    }

    async getUserById(id: string): Promise<Iuser | null> {
        const user = this.userRepository.findById(id);
        return user
    }

    async getUserByEmail(email: string): Promise<Iuser | null> {
        const user = this.userRepository.findByEmail(email);
        return user
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const record = getOtp(email);

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
        await this.userRepository.resetPassword(email, hashedPass);
    }


}