import { inject, injectable } from "inversify";
import { ICategory } from "../../model/category/category.interface";
import { CategoryRepository } from "../../repositories/category/category.repo";
import TYPES from "../../inversify/inversify.types";
import { ICategoryService } from "./category.service.interface";

@injectable()
export class CategoryService implements ICategoryService {
    private _categoryRepository: CategoryRepository;

    constructor(@inject(TYPES.categoryRepository) categoryRepo: CategoryRepository) {
        this._categoryRepository = categoryRepo;
    }

    getAll = async (): Promise<ICategory[]> => {
        const categories = await this._categoryRepository.getAll();
        return categories;
    };

    createCategory = async (category: ICategory): Promise<ICategory> => {
        const existingCategory = await this._categoryRepository.findByName(category.name);
        if (existingCategory) {
            throw new Error("Category already exists");
        }
        return await this._categoryRepository.create(category);
    };

    update = async (category: ICategory, categoryId: string): Promise<boolean> => {
        await this._categoryRepository.update(category, categoryId);
        return true;
    };

    setIsActive = async (categoryId: string): Promise<boolean> => {
        await this._categoryRepository.setIsActive(categoryId);
        return true;
    }

    delete = async (categoryId: string): Promise<boolean> => {
        const existingCategory = await this._categoryRepository.findById(categoryId);
        if (!existingCategory) {
            throw new Error("Category Not Exist");
        }
        await this._categoryRepository.delete(categoryId);
        return true;
    }

    getByWorker = async (categoryIds: string[]): Promise<ICategory[]> => {
        return await this._categoryRepository.getByWorker(categoryIds);
    }

}
