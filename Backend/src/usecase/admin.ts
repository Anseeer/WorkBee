import { IAdmin } from "../domain/entities/IAdmin";
import { IAdminResponseDTO } from "../domain/interfaces/IResponseDTO";
import { emailService } from "../infastructure/services/emailService";
import generateToken from "../infastructure/services/generateAccessToken";
import { generateOTP } from "../infastructure/services/otpService";
import { mapAdminToDTO } from "../mappers/mapAdminToDTO";
import { adminRepository } from "../repository/adminRepository";
import bcrypt from "bcrypt";
import { deleteOtp, getOtp, saveOtp } from "../utilities/otpStore";

export class adminUsecase {
    private adminRepository: adminRepository;
    constructor(adminRepository: adminRepository) {
        this.adminRepository = adminRepository;
    }

    async register(adminData: IAdmin): Promise<{ token: string, admin: IAdminResponseDTO }> {
        const existingAdmin = await this.adminRepository.findByEmail(adminData.email);
        if (existingAdmin) {
            throw new Error("Admin already exist in this email")
        }
        const hashedPass = await bcrypt.hash(adminData.password, 10);
        adminData.password = hashedPass;
        const newAdmin = await this.adminRepository.create(adminData);

        const admin = await mapAdminToDTO(newAdmin);
        const token = await generateToken(admin._id.toString(), admin.role);

        return { token, admin };
    }

    async login(adminData: Partial<IAdmin>): Promise<{ token: string, admin: IAdminResponseDTO }> {
        const existingAdmin = await this.adminRepository.findByEmail(adminData.email!);
        if (!existingAdmin) {
            throw new Error("Can't find the admin with this email.");
        }

        const matchPass = await bcrypt.compare(adminData.password!, existingAdmin.password);
        if (!matchPass) {
            throw new Error("Invalid Password");
        }

        const token = await generateToken(existingAdmin._id.toString(), existingAdmin.role);
        const admin = await mapAdminToDTO(existingAdmin);

        return { token, admin };
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

    async getUserById(id: string): Promise<IAdmin | null> {
        const user = this.adminRepository.findById(id);
        return user
    }

    async getUserByEmail(email: string): Promise<IAdmin | null> {
        const user = this.adminRepository.findByEmail(email);
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
        await this.adminRepository.resetPassword(email, hashedPass);
    }


}