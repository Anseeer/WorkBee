import { Iuser } from "../../model/user/user.interface";
import { IUserDTO } from "../../mappers/user/user.map.DTO.interface";
import { IAvailabilityDTO } from "../../mappers/availability/availability.map.DTO.interface";
import { IWalletDTO } from "../../mappers/wallet/map.wallet.DTO.interface";

export interface IUserService {
    verifyRegister(verifyData: { userId: string, otp: string }): Promise<{ user: IUserDTO, accessToken: string, refreshToken: string, wallet: IWalletDTO | null }>;
    loginUser(email: string, password: string): Promise<{ user: IUserDTO, accessToken: string, refreshToken: string, wallet: IWalletDTO | null }>;
    forgotPass(email: string): Promise<string>;
    resendOtp(email: string): Promise<string>;
    getUserById(userId: string): Promise<IUserDTO | null>;
    getUserByEmail(email: string): Promise<IUserDTO | null>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    resetPass(email: string, password: string): Promise<void>;
    googleLogin(credential: string): Promise<{ user: IUserDTO, accessToken: string, refreshToken: string, wallet: IWalletDTO | null }>;
    fetchAvailability(workerId: string): Promise<IAvailabilityDTO | null>;
    fetchData(userId: string): Promise<{ user: IUserDTO, wallet: IWalletDTO | null }>;
    update(userDetails: Iuser, userId: string): Promise<boolean>;
    findUsersByIds(userIds: string[]): Promise<IUserDTO[]>;
}
