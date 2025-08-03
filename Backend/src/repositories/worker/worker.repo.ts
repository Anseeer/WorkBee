import { injectable } from "inversify";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { IWorker } from "../../model/worker/worker.interface";
import Worker from "../../model/worker/worker.model";
import BaseRepository from "../base/base.repo";
import { IWorkerRepository } from "./worker.repo.interface";
import { Availability } from "../../model/availablity/availablity.model";
import { ICategory } from "../../model/category/category.interface";

@injectable()
export class WorkerRepository extends BaseRepository<IWorker> implements IWorkerRepository {
    constructor() {
        super(Worker);
    }

    async findByIdAndUpdate(id: string, updatedFields: Partial<IWorker>): Promise<IWorker | null> {
        return await this.model.findByIdAndUpdate(
            id,
            { $set: updatedFields },
            { new: true }
        );
    }

    async findAvailabilityByWorkerId(id: string): Promise<IAvailability | null> {
        return await Availability.findOne({ workerId: id });
    }

    async setAvailability(availability: IAvailability): Promise<IAvailability> {
        return await Availability.create(availability);
    }

    async updateAvailability(workerId: string, availability: IAvailability): Promise<IAvailability | null> {
        return await Availability.findOneAndUpdate(
            { workerId },
            { $set: availability },
            { new: true }
        );
    }


    async getAllWorkers(): Promise<IWorker[]> {
        let allWorker = await this.model.find({ role: "Worker", isVerified: true }).sort({createdAt:-1});
        return allWorker;
    }

    async getAllNonVerifiedWorkers(): Promise<IWorker[]> {
        let allWorker = await this.model.find({ role: "Worker", isVerified: false }).sort({createdAt:-1});
        return allWorker;
    }

    async setIsActive(id: string): Promise<boolean> {
        let worker = await this.model.findById(id);
        if (!worker) {
            throw new Error("user not find in the id");
        }
        let newStatus = !worker.isActive;

        await this.model.updateOne({ _id: id }, { $set: { isActive: newStatus } });
        return true;
    }

    async approveWorker(id: string): Promise<boolean> {
        let worker = await this.model.findById(id);
        if (!worker) {
            throw new Error("worker not find in the id");
        }

        await this.model.updateOne({ _id: id }, { $set: { isVerified: true, status: "Approved" } });
        return true;
    }

    async rejectedWorker(id: string): Promise<boolean> {
        let worker = await this.model.findById(id);
        if (!worker) {
            throw new Error("worker not find in the id");
        }

        await this.model.updateOne({ _id: id }, { $set: { isVerified: false, status: "Rejected" } });
        return true;
    }
}
