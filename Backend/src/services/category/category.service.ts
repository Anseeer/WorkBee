import { inject, injectable } from "inversify";
import { ICategory } from "../../model/category/category.interface";
import { CategoryRepository } from "../../repositories/category/category.repo";
import TYPES from "../../inversify/inversify.types";

@injectable()
export class CategoryService {
    private _categoryRepository: CategoryRepository;

    constructor(@inject(TYPES.categoryRepository) categoryRepo: CategoryRepository) {
        this._categoryRepository = categoryRepo;
    }

    getAllCategories = async (): Promise<ICategory[]> => {
        const categories = await this._categoryRepository.getAllCategories();
        return categories;
    };
}
