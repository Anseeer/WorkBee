import { ICategory } from "../../model/category/category.interface";

export interface ICategoryService {
    getAll(): Promise<ICategory[]>;
    createCategory(category:ICategory):Promise<ICategory>;
    setIsActive(category:string):Promise<boolean>;
    update(category:ICategory,categoryId:string):Promise<boolean>;
    delete(categoryId:string):Promise<boolean>;
    getByWorker(categoryIds:string[]):Promise<ICategory[]>;
}
