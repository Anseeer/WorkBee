import { inject, injectable } from "inversify";
import { ICategory } from "../../model/category/category.interface";
import { CategoryRepository } from "../../repositories/category/category.repo";
import TYPES from "../../inversify/inversify.types";
import { ICategoryService } from "./category.service.interface";

@injectable()
export class CategoryService implements ICategoryService{
    private _categoryRepository: CategoryRepository;

    constructor(@inject(TYPES.categoryRepository) categoryRepo: CategoryRepository) {
        this._categoryRepository = categoryRepo;
    }

    getAllCategories = async (): Promise<ICategory[]> => {
        const categories = await this._categoryRepository.getAllCategories();
        return categories;
    };

    getAll = async (): Promise<ICategory[]> => {
        const categories = await this._categoryRepository.getAll();
        return categories;
    };

    createCategory  = async (category:ICategory):Promise<ICategory>=>{
        console.log("Category Constains:",category)
        const existingCategory = await this._categoryRepository.findByName(category.name);
        if(existingCategory){
            throw new Error("Already Exist The Category");
        }
        return await this._categoryRepository.create(category);
    }

    setIsActive = async (categoryId:string):Promise<boolean>=>{
        await this._categoryRepository.setIsActive(categoryId);
        return true;
    }

    update = async (category:ICategory,categoryId:string):Promise<boolean>=>{
        await this._categoryRepository.update(category,categoryId);
        return true;
    }

    delete = async (categoryId:string):Promise<boolean>=>{
        const existingCategory = await this._categoryRepository.findById(categoryId);
        if(!existingCategory){
            throw new Error("Category Not Exist");
        }
        await this._categoryRepository.delete(categoryId);
        return true;
    }

}
