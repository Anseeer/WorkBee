import { inject, injectable } from "inversify";
import { ICategory } from "../../model/category/category.interface";
import TYPES from "../../inversify/inversify.types";
import { ICategoryService } from "./category.service.interface";
import { ICategoryRepository } from "../../repositories/category/category.repo.interface";
import { CATEGORY_MESSAGE } from "../../constants/messages";
import { ICategoryDTO } from "../../mappers/category/category.map.DTO.interface";
import { mapCategoryToDTO, mapCategoryToEntity } from "../../mappers/category/category.map.DTO";

@injectable()
export class CategoryService implements ICategoryService {
    private _categoryRepository: ICategoryRepository;

    constructor(@inject(TYPES.categoryRepository) categoryRepo: ICategoryRepository) {
        this._categoryRepository = categoryRepo;
    }

    getAll = async (currentPage: string, pageSize: string): Promise<{ category: ICategoryDTO[], totalPage: number }> => {
        const page = parseInt(currentPage);
        const size = parseInt(pageSize);
        const startIndex = (page - 1) * size;
        const endIndex = page * size;
        const categories = await this._categoryRepository.getAll();
        const findCategory = categories.slice(startIndex, endIndex);
        if (!findCategory) {
            throw new Error(CATEGORY_MESSAGE.GET_ALL_CATEGORIES_FAILED)
        }
        const category = findCategory.map((cat) => mapCategoryToDTO(cat));
        const totalPage = Math.ceil(categories.length / size);
        return { category, totalPage };
    };

    createCategory = async (category: ICategory): Promise<ICategoryDTO> => {
        const existingCategory = await this._categoryRepository.findByName(category.name);
        if (existingCategory) {
            throw new Error(CATEGORY_MESSAGE.CATEGORY_ALREADY_EXISTS);
        }
        const categoryEntity = mapCategoryToEntity(category);
        const newCategory = await this._categoryRepository.create(categoryEntity);
        const cat = mapCategoryToDTO(newCategory);
        return cat;
    };

    update = async (category: ICategory, categoryId: string): Promise<boolean> => {
        const existingCategory = await this._categoryRepository.findByName(category.name);

        if (existingCategory && existingCategory.id !== categoryId) {
            throw new Error(CATEGORY_MESSAGE.CATEGORY_ALREADY_EXISTS);
        }
        const categoryEntity = mapCategoryToEntity(category);
        await this._categoryRepository.update(categoryEntity, categoryId);
        return true;
    };

    setIsActive = async (categoryId: string): Promise<boolean> => {
        await this._categoryRepository.setIsActive(categoryId);
        return true;
    }

    delete = async (categoryId: string): Promise<boolean> => {
        const existingCategory = await this._categoryRepository.findById(categoryId);
        if (!existingCategory) {
            throw new Error(CATEGORY_MESSAGE.CATEGORY_NOT_EXIST);
        }
        await this._categoryRepository.delete(categoryId);
        return true;
    }

    getByWorker = async (categoryIds: string[]): Promise<ICategoryDTO[]> => {
        const cat = await this._categoryRepository.getByWorker(categoryIds);
        const category = cat.map((cat) => mapCategoryToDTO(cat));
        return category;
    }

    getById = async (categoryId: string): Promise<ICategoryDTO | null> => {
        const cat = await this._categoryRepository.findById(categoryId);
        const category = mapCategoryToDTO(cat as ICategory);
        return category;
    };

}
