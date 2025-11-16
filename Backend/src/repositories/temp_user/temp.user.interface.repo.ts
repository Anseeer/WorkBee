import { ITempUserEntity } from "../../mappers/temp_user/temp.user.map.DTO.interface";
import { ITempUser } from "../../model/temp_user/temp.user.interface";

export interface ITempUserRepository {
    create(user: ITempUserEntity): Promise<ITempUser>;
    findById(userId: string): Promise<ITempUser | null>;
    findTempUserByEmail(email: string): Promise<ITempUser | null>;
    updateById(userId: string, updateData: Partial<ITempUser>): Promise<ITempUser | null>;
    delete(userId: string): Promise<boolean>;
}
