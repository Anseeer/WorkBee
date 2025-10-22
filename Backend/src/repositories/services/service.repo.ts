import { injectable } from "inversify";
import { IServices } from "../../model/service/service.interface";
import Services from "../../model/service/service.model";
import BaseRepository from "../base/base.repo";
import { IServiceRepository } from "./service.repo.interface";
import { IServiceEntity } from "../../mappers/service/service.map.DTO.interface";

@injectable()
export class ServiceRepository extends BaseRepository<IServices> implements IServiceRepository {
    constructor() {
        super(Services);
    }

    async create(item: Partial<IServices>): Promise<IServices> {
        try {
            const newItem = new this.model(item);
            return await newItem.save();
        } catch (error) {
            console.error('Error in create:', error);
            throw new Error('Error in create');
        }
    }

    async findByName(name: string): Promise<IServices | null> {
        try {
            return await this.model.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
        } catch (error) {
            console.error('Error in findByName:', error);
            throw new Error('Error in findByName');
        }
    }

    async findById(id: string): Promise<IServices> {
        try {
            if (!id) {
                throw new Error("Service ID is required");
            }

            const service = await this.model.findById(id);
            if (!service) {
                throw new Error("Service not found");
            }

            return service as IServices;
        } catch (error) {
            console.error('Error in findById:', error);
            throw error;
        }
    }

    async getAllService(): Promise<IServices[]> {
        try {
            return await this.model.find().sort({ createdAt: 1 });
        } catch (error) {
            console.error('Error in getAllService:', error);
            throw new Error('Error in getAllServices');
        }
    }

    async setIsActive(id: string): Promise<boolean> {
        try {
            const service = await this.model.findById(id);
            if (!service) return false;

            const updatedStatus = !service.isActive;
            await this.model.updateOne(
                { _id: id },
                { $set: { isActive: updatedStatus } }
            );

            return true;
        } catch (error) {
            console.error('Error in setIsActive:', error);
            throw new Error('Error in setISActive');
        }
    }

    update = async (service: IServiceEntity, serviceId: string): Promise<boolean> => {
        try {
            const result = await this.model.updateOne(
                { _id: serviceId },
                { $set: { name: service.name, wage: service.wage, category: service.category, image:service.image || "" } }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            console.error('Error in update:', error);
            throw new Error('Error in update');
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await this.model.deleteOne({ _id: id });
            return result.deletedCount > 0;
        } catch (error) {
            console.error('Error in delete:', error);
            throw new Error('Error in delete');
        }
    };

    getByCategories = async (categoryIds: string[]): Promise<IServices[]> => {
        try {
            return await this.model.find({ category: { $in: categoryIds } });
        } catch (error) {
            console.error('Error in getByCategories:', error);
            throw new Error('Error in getByCategories');
        }
    };

    getByWorker = async (serviceIds: string[]): Promise<IServices[]> => {
        try {
            return await this.model.find({ _id: { $in: serviceIds } });
        } catch (error) {
            console.error('Error in getByWorker:', error);
            throw new Error('Error in getByWorker');
        }
    };

    getBySearch = async (searchKey: string): Promise<IServices[]> => {
        try {
            const terms = searchKey.trim().split(/\s+/);
            const regexArray = terms.map(term => new RegExp(term, "i"));

            return await this.model.aggregate([
                {
                    $match: {
                        $or: [
                            { name: { $in: regexArray } },
                            { description: { $in: regexArray } },
                            { _id: { $in: regexArray } }
                        ]
                    }
                },
                {
                    $addFields: {
                        matchScore: {
                            $add: [
                                {
                                    $size: {
                                        $filter: {
                                            input: regexArray,
                                            as: "term",
                                            cond: { $regexMatch: { input: "$name", regex: "$$term" } }
                                        }
                                    }
                                },
                                {
                                    $size: {
                                        $filter: {
                                            input: regexArray,
                                            as: "term",
                                            cond: { $regexMatch: { input: "$description", regex: "$$term" } }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                },
                { $sort: { matchScore: -1 } },
                { $limit: 12 }
            ]);
        } catch (error) {
            console.error('Error in getBySearch:', error);
            throw new Error('Error in getBySearch');
        }
    };


}