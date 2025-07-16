import { IAdmin } from "../../model/admin/admin.interface";

export interface IAdminRepository {
    create(user: Partial<IAdmin>): Promise<IAdmin>;
    findById(id: string): Promise<IAdmin | null>;
    findByEmail(email: string): Promise<IAdmin | null>;
    resetPassword(email: string, hashedPass: string): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}
