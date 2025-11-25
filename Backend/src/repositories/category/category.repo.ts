import { injectable } from "inversify";
import { ICategory } from "../../model/category/category.interface";
import Category from "../../model/category/category.model";
import BaseRepository from "../base/base.repo";
import { ICategoryRepository } from "./category.repo.interface";
import { ICategoryEntity } from "../../mappers/category/category.map.DTO.interface";
import logger from "../../utilities/logger";

@injectable()
export class CategoryRepository extends BaseRepository<ICategory> implements ICategoryRepository {
    constructor() {
        super(Category)
    }

    async create(item: Partial<ICategory>): Promise<ICategory> {
        try {
            const newItem = new this.model(item);
            return await newItem.save();
        } catch (error) {
            logger.error('Error in create:', error);
            throw new Error('Error in create');
        }
    }

    async findById(categoryId: string): Promise<ICategory> {
        try {
            return await this.model.findById(categoryId) as ICategory;
        } catch (error) {
            logger.error('Error in findById:', error);
            throw new Error('Error in findById');
        }
    }

    async getAll(): Promise<ICategory[]> {
        try {
            return await this.model.find().sort({ createdAt: -1 });
        } catch (error) {
            logger.error('Error in getAll:', error);
            throw new Error('Error in getAll');
        }
    }

    async findByName(name: string): Promise<ICategory | null> {
        try {
            return await this.model.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
        } catch (error) {
            logger.error('Error in findByName:', error);
            throw new Error('Error in findByName');
        }
    }

    async setIsActive(categoryId: string): Promise<boolean> {
        try {
            const category = await this.model.findById(categoryId);
            if (!category) return false;

            const updatedStatus = !category.isActive;
            await this.model.updateOne(
                { _id: categoryId },
                { $set: { isActive: updatedStatus } }
            );

            return true;
        } catch (error) {
            logger.error('Error in setIsActive:', error);
            throw new Error('Error in setIsActive');
        }
    }

    update = async (category: ICategoryEntity, categoryId: string): Promise<boolean> => {
        try {
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
        } catch (error) {
            logger.error('Error in update:', error);
            throw new Error('Error in update');
        }
    };

    delete = async (categoryId: string): Promise<boolean> => {
        try {
            const result = await this.model.deleteOne({ _id: categoryId });
            return result.deletedCount > 0;
        } catch (error) {
            logger.error('Error in delete:', error);
            throw new Error('Error in delete');
        }
    };

    getByWorker = async (categoryIds: string[]): Promise<ICategory[]> => {
        try {
            return await this.model.find({ _id: { $in: categoryIds } });
        } catch (error) {
            logger.error('Error in getByWorker:', error);
            throw new Error('Error in getByWorker');
        }
    };

}