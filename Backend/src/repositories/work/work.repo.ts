import { injectable } from "inversify";
import BaseRepository from "../base/base.repo";
import { IWork } from "../../model/work/work.interface";
import { IWorkRepository } from "./work.repo.interface";
import Work from "../../model/work/work.model";
import { WORK_MESSAGE } from "../../constants/messages";
import { IWorkEntity } from "../../mappers/work/work.map.DTO.interface";

@injectable()
export class WorkRepository extends BaseRepository<IWork> implements IWorkRepository {
    constructor() {
        super(Work);
    }

    async create(item: Partial<IWorkEntity>): Promise<IWork> {
        const newItem = new this.model(item);
        return await newItem.save();
    }

    async findByUser(userId: string): Promise<IWork[]> {
        return await this.model.find({ userId }).sort({ createdAt: -1 });
    }
    async findByWorker(workerId: string): Promise<IWork[]> {
        return await this.model.find({ workerId }).sort({ createdAt: -1 });
    }

    async cancel(workId: string): Promise<boolean> {
        const res = await this.model.updateOne({ _id: workId }, { $set: { status: "Canceled" } });
        return res.modifiedCount > 0;
    }

    async accept(workId: string): Promise<boolean> {
        const res = await this.model.updateOne({ _id: workId }, { $set: { status: "Accepted" } });
        return res.modifiedCount > 0;
    }

    async findById(workId: string): Promise<IWork> {
        const workDetails = await this.model.findById(workId);
        if (!workDetails) {
            throw new Error(WORK_MESSAGE.CANT_GET_WORK_DETAILS);
        }
        return workDetails;
    }

    async setIsWorkCompleted(workId: string): Promise<boolean> {
        const work = await this.model.findById(workId);
        if (!work) {
            throw new Error(WORK_MESSAGE.CANT_GET_WORK_DETAILS);
        }

        if (work.isCompleted) {
            throw new Error(WORK_MESSAGE.WORK_ALREADY_MARK_COMPLETED);
        }

        work.isCompleted = true;
        work.status = "Completed";

        work.paymentStatus = "Pending";

        await work.save();
        return true;
    }

    async getAllWorks(): Promise<IWork[]> {
        return await this.model.find().sort({ createdAt: -1 });
    }

}