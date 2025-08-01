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

    async getAllService(): Promise<IServices[]> {
        return await this.model.find({ isActive: true });
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

    update = async (service: IServices): Promise<boolean> => {
        const result = await this.model.updateOne(
            { _id: service._id },
            { $set: { name: service.name, description: service.description } }
        );
        return result.modifiedCount > 0;
    };

    delete = async (id: string): Promise<boolean> => {
        const result = await this.model.deleteOne({ _id: id });
        return result.deletedCount > 0;
    };


}