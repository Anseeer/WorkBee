import { IUserEntity } from "../../mappers/user/user.map.DTO.interface";
import { Iuser } from "../../model/user/user.interface";

export interface IUserRepository {
    create(user: IUserEntity): Promise<Iuser>;
    findById(id: string): Promise<Iuser | null>;
    findByEmail(email: string): Promise<Iuser | null>;
    resetPassword(email: string, hashedPass: string): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    getAllUsers(): Promise<Iuser[] | null>;
    setIsActive(id: string): Promise<boolean>;
    fetchData(userId: string): Promise<Iuser>;
    update(userDetails: IUserEntity, userId: string): Promise<boolean>;
    findUsersByIds(userIds: string[]): Promise<Iuser[]>;
}
