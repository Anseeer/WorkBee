import { ICategoryEntity } from "../../mappers/category/category.map.DTO.interface";
import { ICategory } from "../../model/category/category.interface";

export interface ICategoryRepository {
    create(category: Partial<ICategory>): Promise<ICategory>;
    findById(categoryId: string): Promise<ICategory | null>;
    findByName(name: string): Promise<ICategory | null>;
    delete(categoryId: string): Promise<boolean>;
    setIsActive(categoryId: string): Promise<boolean>;
    update(category: ICategoryEntity, categoryId: string): Promise<boolean>;
    getAll(): Promise<ICategory[]>;
    getByWorker(categoryIds: string[]): Promise<ICategory[]>;
}
