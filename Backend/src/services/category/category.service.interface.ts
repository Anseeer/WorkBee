import { ICategory } from "../../model/category/category.interface";

export interface ICategoryService {
    getAllCategories(): Promise<ICategory[]>;
}
