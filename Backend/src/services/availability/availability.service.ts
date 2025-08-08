import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { IAvailabilityService } from "./availability.service.interface";
import { IAvailabilityRepository } from "../../repositories/availability/availability.repo.interface";

@injectable()
export class AvailabilityService implements IAvailabilityService {
    private _availabilityRepository: IAvailabilityRepository;

    constructor(@inject(TYPES.availabilityRepository) availabilityRepo: IAvailabilityRepository) {
        this._availabilityRepository = availabilityRepo;
    }

    getAvailabilityByworkerId = async (id: string): Promise<IAvailability[]> => {
        const availability = await this._availabilityRepository.findByWorkerId(id);
        return availability as IAvailability[];
    };

    updateAvailability = async (availability: IAvailability): Promise<boolean> => {
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
