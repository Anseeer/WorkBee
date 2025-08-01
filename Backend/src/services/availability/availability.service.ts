import { inject, injectable } from "inversify";
import { AvailabilityRepository } from "../../repositories/availability/availability.repo";
import TYPES from "../../inversify/inversify.types";
import { IAvailability } from "../../model/availablity/availablity.interface";
import { IAvailabilityService } from "./availability.service.interface";

@injectable()
export class AvailabilityService implements IAvailabilityService{
    private _availabilityRepository: AvailabilityRepository;

    constructor(@inject(TYPES.availabilityRepository) availabilityRepo: AvailabilityRepository) {
        this._availabilityRepository = availabilityRepo;
    }

    getWorkerById = async (id:string): Promise<IAvailability[]> => {
        const availability = await this._availabilityRepository.findByWorkerId(id);
        return availability as IAvailability[];
    };
}
