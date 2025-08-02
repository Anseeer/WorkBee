import { injectable } from "inversify";
import { ICategory } from "../../model/category/category.interface";
import Category from "../../model/category/category.model";
import BaseRepository from "../base/base.repo";
import { ICategoryRepository } from "./category.repo.interface";

@injectable()
export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository {
    constructor() {
        super(Category)
    }

    async create(item: Partial<ICategory>): Promise<ICategory> {
        const newItem = new this.model(item);
        return await newItem.save();
    }

    async getAllCategories(): Promise<ICategory[]> {
        return await this.model.find({ isActive: true });
    }

    async getAll(): Promise<ICategory[]> {
        return await this.model.find();
    }

    async findByName(name: string): Promise<ICategory | null> {
        return await this.model.findOne({ name })
    }

    async setIsActive(id: string): Promise<boolean> {
        const category = await this.model.findById(id);
        if (!category) return false;
        const updatedStatus = !category.isActive;
        await this.model.updateOne(
            { _id: id },
            { $set: { isActive: updatedStatus } }
        );
        return true;
    }

    update = async (category: ICategory,categoryId:string): Promise<boolean> => {
        const result = await this.model.updateOne(
            { _id: categoryId },
            { $set: { name: category.name, description: category.description } }
        );
        return result.modifiedCount > 0;
    };

    delete = async (id: string): Promise<boolean> => {
        const result = await this.model.deleteOne({ _id: id });
        return result.deletedCount > 0;
    };

}