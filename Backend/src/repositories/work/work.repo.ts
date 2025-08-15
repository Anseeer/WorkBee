import { injectable } from "inversify";
import BaseRepository from "../base/base.repo";
import { IWork } from "../../model/work/work.interface";
import { IWorkRepository } from "./work.repo.interface";
import Work from "../../model/work/work.model";
import Payment from "../../model/payment/payment.model";

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
            throw new Error("Work not found");
        }
        return workDetails;
    }

    async setIsWorkCompleted(workId: string): Promise<boolean> {
        const work = await this.model.findById(workId);
        if (!work) {
            throw new Error("Work not found for the given ID");
        }

        if (work.isCompleted) {
            throw new Error("Work is already marked as completed");
        }

        work.isCompleted = true;
        work.status = "Completed";

        work.paymentStatus = "Pending";

        await work.save();
        return true;
    }

}