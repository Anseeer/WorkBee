import { ICategoryEntity } from "../../mappers/category/category.map.DTO.interface";
import { ICategory } from "../../model/category/category.interface";

export interface ICategoryRepository {
    create(category: Partial<ICategory>): Promise<ICategory>;
    findById(id: string): Promise<ICategory | null>;
    findByName(name: string): Promise<ICategory | null>;
    delete(id: string): Promise<boolean>;
    setIsActive(id: string): Promise<boolean>;
    update(category: ICategoryEntity, categoryId: string): Promise<boolean>;
    getAll(): Promise<ICategory[]>;
    getByWorker(categoryIds: string[]): Promise<ICategory[]>;
}
