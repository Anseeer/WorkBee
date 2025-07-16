import { ICategory } from "../../model/category/category.interface";

export interface ICategoryRepository {
    create(user: Partial<ICategory>): Promise<ICategory>;
    findById(id: string): Promise<ICategory | null>;
    findByEmail(email: string): Promise<ICategory | null>;
    resetPassword(email: string, hashedPass: string): Promise<boolean>;
    delete(id: string): Promise<boolean>;
}
