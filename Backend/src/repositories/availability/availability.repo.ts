import { injectable } from "inversify";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { Availability } from "../../model/availablity/availablity.model";
import BaseRepository from "../base/base.repo";
import { IAvailabilityRepository } from "./availability.repo.interface";
import mongoose from "mongoose";
import logger from "../../utilities/logger";

@injectable()
export class AvailabilityRepository extends BaseRepository<IAvailability> implements IAvailabilityRepository {
    constructor() {
        super(Availability)
    }

    findByWorkerId = async (workerId: string | mongoose.Types.ObjectId): Promise<IAvailability | null> => {
        try {
            return await this.model.findOne({ workerId });
        } catch (error) {
            logger.error('Error in findByWorkerId', error);
            throw new Error('Error in findByWorkerId');
        }
    }


    async findAvailabilityByWorkerId(workerId: string): Promise<IAvailability | null> {
        try {
            return await this.model.findOne({ workerId });
        } catch (error) {
            logger.error('Error in findAvailabilityByWorkerId:', error);
            throw new Error('Error in findAvailabilityByWorkerId');
        }
    }

    async setAvailability(availability: IAvailability): Promise<IAvailability> {
        try {
            return await this.model.create(availability);
        } catch (error) {
            logger.error('Error in setAvailability:', error);
            throw new Error('Error in setAvailability');
        }
    }

    async updateAvailability(workerId: string, availability: IAvailability): Promise<IAvailability | null> {
        try {
            return await this.model.findOneAndUpdate(
                { workerId },
                { $set: availability },
                { new: true }
            );
        } catch (error) {
            logger.error('Error in updateAvailability:', error);
            throw new Error('Error in updateAvailability');
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
            logger.error('Error in update:', error);
            throw new Error('Error in update');
        }
    }

    markBookedSlot = async (availability: IAvailability): Promise<IAvailability | null> => {
        try {
            return await availability.save();
        } catch (error) {
            logger.error('Error in markBookedSlot:', error);
            throw new Error('Error in markBookedSlot');
        }
    }

    removeExpiredDates = async (): Promise<number> => {
        try {
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
        } catch (error) {
            logger.error('Error in removeExpiredDates:', error);
            throw new Error('Error in removeExpiredDates');
        }
    }

}