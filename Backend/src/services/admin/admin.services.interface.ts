import { IAdminDTO } from "../../mappers/admin/admin.map.DTO.interface";
import { IAdmin } from "../../model/admin/admin.interface";

export interface IAdminService {
    register(adminData: Partial<IAdmin>): Promise<{ admin: IAdminDTO, token: string }>;
    login(adminData: Partial<IAdmin>): Promise<{ admin: IAdminDTO, token: string }>;
    forgotPass(email: string): Promise<string>;
    resendOtp(email: string): Promise<string>;
    getUserById(id: string): Promise<IAdmin | null>;
    getUserByEmail(email: string): Promise<IAdmin | null>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    resetPass(email: string, password: string): Promise<void>;
}
