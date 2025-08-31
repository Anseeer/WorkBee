import { injectable } from "inversify";
import { ICategory } from "../../model/category/category.interface";
import Category from "../../model/category/category.model";
import BaseRepository from "../base/base.repo";
import { ICategoryRepository } from "./category.repo.interface";
import { ICategoryEntity } from "../../mappers/category/category.map.DTO.interface";

@injectable()
export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository {
    constructor() {
        super(Category)
    }

    async create(item: Partial<ICategoryEntity>): Promise<ICategory> {
        const newItem = new this.model(item);
        return await newItem.save();
    }

    async findById(id: string): Promise<ICategory> {
        return await this.model.findById(id) as ICategory;
    }

    async getAll(): Promise<ICategory[]> {
        return await this.model.find().sort({ createdAt: -1 });
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

    update = async (category: ICategoryEntity, categoryId: string): Promise<boolean> => {
        const result = await this.model.updateOne(
            { _id: categoryId },
            {
                $set: {
                    name: category.name,
                    description: category.description,
                    imageUrl: category.imageUrl
                }
            }
        );
        return result.modifiedCount > 0;
    };

    delete = async (id: string): Promise<boolean> => {
        const result = await this.model.deleteOne({ _id: id });
        return result.deletedCount > 0;
    };

    getByWorker = async (categoryIds: string[]): Promise<ICategory[]> => {
        return await this.model.find({ _id: { $in: categoryIds } })
    }

}