import { injectable } from "inversify";
import { IAvailability } from "../../model/availablity/availablity.interface";
import Availability from "../../model/availablity/availablity.model";
import { IWorker } from "../../model/worker/worker.interface";
import Worker from "../../model/worker/worker.model";
import BaseRepository from "../base/base.repo";
import { IWorkerRepository } from "./worker.repo.interface";

@injectable()
export class WorkerRepository extends BaseRepository<IWorker> implements IWorkerRepository {
    constructor() {
        super(Worker);
    }

    async findByIdAndUpdate(id: string, updatedFields: Partial<IWorker>) {
        return await this.model.findByIdAndUpdate(
            id,
            { $set: updatedFields },
        );
    }

    async findAvailablityByWorkerId(id: string) {
        return await Availability.findOne({ workerId: id });
    }

    async setAvailablity(availablity: IAvailability) {
        return await Availability.create(availablity);
    }

    async updateAvailablity(id: string, availability: IAvailability) {
        return await Availability.updateOne(
            { workerId: id },
            { $set: { availableSlots: availability.availableSlots } }
        );
    }

    async getAllWorkers(): Promise<IWorker[]> {
        let allWorker = await this.model.find({ role: "worker" });
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
