import BaseRepository from "./baseRepostitory";
import WorkerModel from "../infastructure/models/workerSchema";
import { IWorker } from "../domain/entities/IWorker";
import { IAvailability } from "../domain/entities/IAvailability";
import Availability from "../infastructure/models/availabilitySchema";

export class workerRepository extends BaseRepository<IWorker> {
    constructor() {
        super(WorkerModel);
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

}
