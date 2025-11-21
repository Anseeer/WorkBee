import { IUserEntity } from "../../mappers/user/user.map.DTO.interface";
import { Iuser } from "../../model/user/user.interface";

export interface IUserRepository {
    create(user: IUserEntity): Promise<Iuser>;
    findById(userId: string): Promise<Iuser | null>;
    findByEmail(email: string): Promise<Iuser | null>;
    resetPassword(userId: string, hashedPass: string): Promise<boolean>;
    delete(userId: string): Promise<boolean>;
    getAllUsers(): Promise<Iuser[] | null>;
    setIsActive(userId: string): Promise<boolean>;
    fetchData(userId: string): Promise<Iuser>;
    update(userDetails: IUserEntity, userId: string): Promise<boolean>;
    findUsersByIds(userIds: string[]): Promise<Iuser[]>;
}
