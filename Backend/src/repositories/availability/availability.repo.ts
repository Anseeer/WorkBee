import { injectable } from "inversify";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { Availability } from "../../model/availablity/availablity.model";
import BaseRepository from "../base/base.repo";
import { IAvailabilityRepository } from "./availability.repo.interface";
import mongoose from "mongoose";
import { IAvailabilitEntity } from "../../mappers/availability/availability.map.DTO.interface";

@injectable()
export class AvailabilityRepository extends BaseRepository<IAvailability> implements IAvailabilityRepository {
    constructor() {
        super(Availability)
    }

    findByWorkerId = async (workerId: string | mongoose.Types.ObjectId): Promise<IAvailability | null> => {
        return await this.model.findOne({ workerId });
    }

    update = async (availability: IAvailabilitEntity): Promise<boolean> => {
        const result = await this.model.updateOne(
            { workerId: availability.workerId },
            { $set: { availableDates: availability.availableDates } }
        );

        return result.modifiedCount > 0;
    }

    markBookedSlot = async (availability: IAvailability): Promise<IAvailability> => {
        return await availability.save();
    }



}