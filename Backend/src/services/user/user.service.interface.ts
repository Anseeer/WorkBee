import { Iuser } from "../../model/user/user.interface";
import { IUserDTO } from "../../mappers/user/user.map.DTO.interface";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { IWallet } from "../../model/wallet/wallet.interface.model";

export interface IUserService {
    registerUser(userData: Partial<Iuser>): Promise<{ user: IUserDTO, accessToken: string, refreshToken: string, wallet: IWallet | null }>;
    loginUser(email: string, password: string): Promise<{ user: IUserDTO, accessToken: string, refreshToken: string, wallet: IWallet | null }>;
    forgotPass(email: string): Promise<string>;
    resendOtp(email: string): Promise<string>;
    getUserById(id: string): Promise<Iuser | null>;
    getUserByEmail(email: string): Promise<Iuser | null>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
    resetPass(email: string, password: string): Promise<void>;
    googleLogin(credential: string): Promise<{ user: IUserDTO, accessToken: string, refreshToken: string, wallet: IWallet | null }>;
    fetchAvailability(id: string): Promise<IAvailability | null>;
    fetchData(userId: string): Promise<{ user: IUserDTO, wallet: IWallet | null }>;
    update(userDetails: Iuser, userId: string): Promise<boolean>;
    findUsersByIds(userIds: string[]): Promise<IUserDTO[]>;

}
