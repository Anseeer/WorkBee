import { IAvailability } from "../../model/availablity/availablity.interface";
import { IAvailabilitEntity, IAvailabilityDTO } from "./availability.map.DTO.interface";

export const mapAvailabilityToDTO = (availability: IAvailability | null): IAvailabilityDTO | null => {
    if (!availability) return null;

    return {
        _id: availability.id,
        workerId: availability.workerId,
        availableDates: availability.availableDates
    };
};

export const mapAvailabilityToEntity = (availability: IAvailability): IAvailabilitEntity => {
    return {
        workerId: availability.workerId,
        availableDates: availability.availableDates
    }
}