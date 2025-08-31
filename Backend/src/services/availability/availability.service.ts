import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { IAvailabilityService } from "./availability.service.interface";
import { IAvailabilityRepository } from "../../repositories/availability/availability.repo.interface";
import { WORKER_MESSAGE } from "../../constants/messages";
import { IAvailabilityDTO } from "../../mappers/availability/availability.map.DTO.interface";
import { mapAvailabilityToDTO, mapAvailabilityToEntity } from "../../mappers/availability/availability.map.DTO";

@injectable()
export class AvailabilityService implements IAvailabilityService {
    private _availabilityRepository: IAvailabilityRepository;

    constructor(@inject(TYPES.availabilityRepository) availabilityRepo: IAvailabilityRepository) {
        this._availabilityRepository = availabilityRepo;
    }

    getAvailabilityByworkerId = async (id: string): Promise<IAvailabilityDTO> => {
        const findAvailability = await this._availabilityRepository.findByWorkerId(id);
        const availability = mapAvailabilityToDTO(findAvailability as IAvailability);
        return availability;
    };

    updateAvailability = async (availability: IAvailability): Promise<boolean> => {
        const existingAvailability = await this._availabilityRepository.findByWorkerId(
            availability.workerId.toString()
        );

        if (!existingAvailability) {
            throw new Error(WORKER_MESSAGE.CANT_FIND_AVAILABILITY);
        }

        const updatedFields = mapAvailabilityToEntity(availability);

        const updated = await this._availabilityRepository.update(updatedFields);

        if (!updated) {
            throw new Error("Failed to update availability");
        }
        return true;
    };

}
