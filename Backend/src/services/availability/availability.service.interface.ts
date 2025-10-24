import { IAvailabilityDTO } from "../../mappers/availability/availability.map.DTO.interface";
import { IAvailability } from "../../model/availablity/availablity.interface";

export interface IAvailabilityService {
  getAvailabilityByworkerId(workerId: string): Promise<IAvailabilityDTO | null>;
  updateAvailability(availability: IAvailability): Promise<boolean>;
}
