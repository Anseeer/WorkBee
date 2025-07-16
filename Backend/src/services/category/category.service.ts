import { ICategory } from "../../model/category/category.interface";
import { CategoryRepository } from "../../repositories/category/category.repo";

export class CategoryService {
    private _categoryRepository: CategoryRepository;

    constructor(_categoryRepository: CategoryRepository) {
        this._categoryRepository = _categoryRepository;
    }

    getAllCategories = async (): Promise<ICategory[]> => {
        const categories = await this._categoryRepository.getAllCategories();
        return categories;
    };
}
