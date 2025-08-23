import { ICategory } from "../../model/category/category.interface";

export interface ICategoryService {
    getAll(currentPage:string,pageSize:string): Promise<{category:ICategory[],totalPage:number}>;
    createCategory(category: ICategory): Promise<ICategory>;
    getById(categoryId: string): Promise<ICategory | null>;
    setIsActive(category: string): Promise<boolean>;
    update(category: ICategory, categoryId: string): Promise<boolean>;
    delete(categoryId: string): Promise<boolean>;
    getByWorker(categoryIds: string[]): Promise<ICategory[]>;
}
