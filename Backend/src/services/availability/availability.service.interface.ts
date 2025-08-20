import { IAvailability } from "../../model/availablity/availablity.interface";

export interface IAvailabilityService {
  getAvailabilityByworkerId(id: string): Promise<IAvailability>;
  updateAvailability(availability: IAvailability): Promise<boolean>;
}
