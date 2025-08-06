import { Iuser } from "../../model/user/user.interface";
import { IUserDTO } from "../../mappers/user/user.map.DTO.interface";

export interface IUserService {
    registerUser(userData: Partial<Iuser>): Promise<{ user: IUserDTO, token: string }>;
    loginUser(email: string, password: string): Promise<{ user: IUserDTO, token: string }>;
    forgotPass(email: string): Promise<string>;
    resendOtp(email: string): Promise<string>;
    getUserById(id: string): Promise<Iuser | null>;
    getUserByEmail(email: string): Promise<Iuser | null>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    resetPass(email: string, password: string): Promise<void>;
    googleLogin(token: string): Promise<{user: IUserDTO, token: string }>;
}
