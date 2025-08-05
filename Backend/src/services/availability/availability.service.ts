import { inject, injectable } from "inversify";
import { AvailabilityRepository } from "../../repositories/availability/availability.repo";
import TYPES from "../../inversify/inversify.types";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { IAvailabilityService } from "./availability.service.interface";

@injectable()
export class AvailabilityService implements IAvailabilityService {
    private _availabilityRepository: AvailabilityRepository;

    constructor(@inject(TYPES.availabilityRepository) availabilityRepo: AvailabilityRepository) {
        this._availabilityRepository = availabilityRepo;
    }

    getAvailabilityByworkerId = async (id: string): Promise<IAvailability[]> => {
        const availability = await this._availabilityRepository.findByWorkerId(id);
        return availability as IAvailability[];
    };

    updateAvailability = async (availability: IAvailability): Promise<boolean> => {
        console.log("Availability :", availability);
        const existingAvailability = await this._availabilityRepository.findByWorkerId(
            availability.workerId.toString()
        );

        if (!existingAvailability) {
            console.warn(`Availability not found for worker ID: ${availability.workerId}`);
            throw new Error("Cannot find availability for this worker");
        }

        const updated = await this._availabilityRepository.update(availability);

        if (!updated) {
            throw new Error("Failed to update availability");
        }

        return true;

    };

}
