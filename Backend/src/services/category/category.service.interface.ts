import { ICategoryDTO } from "../../mappers/category/category.map.DTO.interface";
import { ICategory } from "../../model/category/category.interface";

export interface ICategoryService {
    getAll(currentPage: string, pageSize: string): Promise<{ category: ICategoryDTO[], totalPage: number }>;
    createCategory(category: ICategory): Promise<ICategoryDTO>;
    getById(categoryId: string): Promise<ICategoryDTO | null>;
    setIsActive(category: string): Promise<boolean>;
    update(category: ICategory, categoryId: string): Promise<boolean>;
    delete(categoryId: string): Promise<boolean>;
    getByWorker(categoryIds: string[]): Promise<ICategoryDTO[]>;
}
