import { IAvailability } from "../../model/availablity/availablity.interface";
import { IAvailabilitEntity, IAvailabilityDTO } from "./availability.map.DTO.interface";

export const mapAvailabilityToDTO = (availability: IAvailability): IAvailabilityDTO => {
    return {
        _id: availability.id,
        workerId: availability.workerId,
        availableDates: availability.availableDates
    }
}

export const mapAvailabilityToEntity = (availability: IAvailability): IAvailabilitEntity => {
    return {
        _id: availability.id,
        workerId: availability.workerId,
        availableDates: availability.availableDates
    }
}