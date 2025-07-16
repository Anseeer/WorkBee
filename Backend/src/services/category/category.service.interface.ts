import { ICategory } from "../../model/category/category.interface";

export interface IAdminService {
    getAllCategories(): Promise<ICategory[]>;
}
