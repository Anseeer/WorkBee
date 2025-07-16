import { ICategory } from "../../model/category/category.interface";
import Category from "../../model/category/category.model";
import BaseRepository from "../base/base.repo";
import { ICategoryRepository } from "./category.repo.interface";

export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository {
    constructor() {
        super(Category)
    }

    async getAllCategories(): Promise<ICategory[]> {
        return await this.model.find({ isActive: true });
    }
}