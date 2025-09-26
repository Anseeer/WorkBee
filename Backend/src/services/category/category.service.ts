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
        try {
            const page = parseInt(currentPage);
            const size = parseInt(pageSize);
            const startIndex = (page - 1) * size;
            const endIndex = page * size;
            const categories = await this._categoryRepository.getAll();
            const findCategory = categories.slice(startIndex, endIndex);
            if (!findCategory) {
                throw new Error(CATEGORY_MESSAGE.GET_ALL_CATEGORIES_FAILED);
            }
            const category = findCategory.map((cat) => mapCategoryToDTO(cat));
            const totalPage = Math.ceil(categories.length / size);
            return { category, totalPage };
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    };

    createCategory = async (category: ICategory): Promise<ICategoryDTO> => {
        try {
            const existingCategory = await this._categoryRepository.findByName(category.name);
            if (existingCategory) {
                throw new Error(CATEGORY_MESSAGE.CATEGORY_ALREADY_EXISTS);
            }
            const categoryEntity = mapCategoryToEntity(category);
            const newCategory = await this._categoryRepository.create(categoryEntity);
            const cat = mapCategoryToDTO(newCategory);
            return cat;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    };

    update = async (category: ICategory, categoryId: string): Promise<boolean> => {
        try {
            const existingCategory = await this._categoryRepository.findByName(category.name);
            if (existingCategory && existingCategory.id !== categoryId) {
                throw new Error(CATEGORY_MESSAGE.CATEGORY_ALREADY_EXISTS);
            }
            const categoryEntity = mapCategoryToEntity(category);
            await this._categoryRepository.update(categoryEntity, categoryId);
            return true;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    };

    setIsActive = async (categoryId: string): Promise<boolean> => {
        try {
            await this._categoryRepository.setIsActive(categoryId);
            return true;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    };

    delete = async (categoryId: string): Promise<boolean> => {
        try {
            const existingCategory = await this._categoryRepository.findById(categoryId);
            if (!existingCategory) {
                throw new Error(CATEGORY_MESSAGE.CATEGORY_NOT_EXIST);
            }
            await this._categoryRepository.delete(categoryId);
            return true;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    };

    getByWorker = async (categoryIds: string[]): Promise<ICategoryDTO[]> => {
        try {
            const cat = await this._categoryRepository.getByWorker(categoryIds);
            const category = cat.map((cat) => mapCategoryToDTO(cat));
            return category;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    };

    getById = async (categoryId: string): Promise<ICategoryDTO | null> => {
        try {
            const cat = await this._categoryRepository.findById(categoryId);
            const category = mapCategoryToDTO(cat as ICategory);
            return category;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    };

}
