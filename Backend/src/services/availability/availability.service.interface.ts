import { IAvailabilityDTO } from "../../mappers/availability/availability.map.DTO.interface";
import { IAvailability } from "../../model/availablity/availablity.interface";

export interface IAvailabilityService {
  getAvailabilityByworkerId(id: string): Promise<IAvailabilityDTO>;
  updateAvailability(availability: IAvailability): Promise<boolean>;
}
