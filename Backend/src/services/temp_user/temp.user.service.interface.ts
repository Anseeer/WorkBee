import { ITempUser } from "../../model/temp_user/temp.user.interface";

export interface ITempUserService {
    register(userData: ITempUser): Promise<string>;
    resendOtp(userId: string): Promise<string>;
}
