import { Iuser } from "../../model/user/user.interface";

export interface IUserRepository {
    create(user: Partial<Iuser>): Promise<Iuser>;
    findById(id: string): Promise<Iuser | null>;
    findByEmail(email: string): Promise<Iuser | null>;
    resetPassword(email: string, hashedPass: string): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    getAllUsers(): Promise<Iuser[] | null>;
    setIsActive(id: string): Promise<boolean>;
}
