import { injectable } from "inversify";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { Availability } from "../../model/availablity/availablity.model";
import BaseRepository from "../base/base.repo";
import { IAvailabilityRepository } from "./availability.repo.interface";
import mongoose from "mongoose";

@injectable()
export class AvailabilityRepository extends BaseRepository<IAvailability> implements IAvailabilityRepository {
    constructor() {
        super(Availability)
    }

    findByWorkerId = async (workerId: string | mongoose.Types.ObjectId): Promise<IAvailability | null> => {
        try {
            return await this.model.findOne({ workerId });
        } catch (error) {
            console.log('Error in findByWorkerId', error);
            throw new Error('Error in findByWorkerId');
        }
    }

    update = async (availability: IAvailability): Promise<boolean> => {
        try {
            const result = await this.model.updateOne(
                { workerId: availability.workerId },
                { $set: { availableDates: availability.availableDates } }
            );

            return result.modifiedCount > 0;
        } catch (error) {
            console.error('Error in update:', error);
            throw new Error('Error in update');
        }
    }

    markBookedSlot = async (availability: IAvailability): Promise<IAvailability | null> => {
        try {
            return await availability.save();
        } catch (error) {
            console.error('Error in markBookedSlot:', error);
            throw new Error('Error in markBookedSlot');
        }
    }

    removeExpiredDates = async (): Promise<number> => {
        const today = new Date();
        const result = await this.model.updateMany(
            {},
            {
                $pull: {
                    availableDates: { date: { $lt: today } },
                },
            }
        );
        return result.modifiedCount;
    }

}