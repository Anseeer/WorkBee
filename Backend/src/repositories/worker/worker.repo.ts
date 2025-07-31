import { injectable } from "inversify";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { IWorker } from "../../model/worker/worker.interface";
import Worker from "../../model/worker/worker.model";
import BaseRepository from "../base/base.repo";
import { IWorkerRepository } from "./worker.repo.interface";
import { Availability } from "../../model/availablity/availablity.model";

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
        let allWorker = await this.model.find({ role: "Worker" });
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

}
