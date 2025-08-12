import { injectable } from "inversify";
import BaseRepository from "../base/base.repo";
import { IWork } from "../../model/work/work.interface";
import { IWorkRepository } from "./work.repo.interface";
import Work from "../../model/work/work.model";

@injectable()
export class WorkRepository extends BaseRepository<IWork> implements IWorkRepository {
    constructor() {
        super(Work);
    }

    async create(item: Partial<IWork>): Promise<IWork> {
        const newItem = new this.model(item);
        return await newItem.save();
    }

    async findByUser(userId: string): Promise<IWork[]> {
        return await this.model.find({userId});
    }

}