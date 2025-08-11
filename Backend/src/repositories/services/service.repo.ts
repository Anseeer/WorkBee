import { injectable } from "inversify";
import { IServices } from "../../model/service/service.interface";
import Services from "../../model/service/service.model";
import BaseRepository from "../base/base.repo";
import { IServiceRepository } from "./service.repo.interface";

@injectable()
export class ServiceRepository extends BaseRepository<IServices> implements IServiceRepository {
    constructor() {
        super(Services);
    }

    async create(item: Partial<IServices>): Promise<IServices> {
        const newItem = await new this.model(item);
        return await newItem.save();
    }

    async findByName(name: string): Promise<IServices | null> {
        return await this.model.findOne({ name })
    }

    async findById(id: string): Promise<IServices> {
        return await this.model.findById(id) as IServices;
    }

    async getAllService(): Promise<IServices[]> {
        return await this.model.find().sort({ createdAt: 1 });
    }


    async setIsActive(id: string): Promise<boolean> {
        const service = await this.model.findById(id);
        if (!service) return false;
        const updatedStatus = !service.isActive;
        await this.model.updateOne(
            { _id: id },
            { $set: { isActive: updatedStatus } }
        );
        return true;
    }

    update = async (service: IServices, serviceId: string): Promise<boolean> => {
        const result = await this.model.updateOne(
            { _id: serviceId },
            { $set: { name: service.name, wage: service.wage, category: service.category } }
        );
        return result.modifiedCount > 0;
    };

    delete = async (id: string): Promise<boolean> => {
        const result = await this.model.deleteOne({ _id: id });
        return result.deletedCount > 0;
    };

    getByCategories = async (categoryIds: string[]): Promise<IServices[]> => {
        const services = await this.model.find({ category: { $in: categoryIds } });
        return services;
    }

    getByWorker = async (serviceIds: string[]): Promise<IServices[]> => {
        const services = await this.model.find({ _id: { $in: serviceIds } });
        return services;
    }

    getBySearch = async (searchKey: string): Promise<IServices[]> => {
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
    };






}