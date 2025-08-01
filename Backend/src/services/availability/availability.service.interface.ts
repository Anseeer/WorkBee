import { IAvailability } from "../../model/availablity/availablity.interface";

export interface IAvailabilityService {
  getWorkerById(id: string): Promise<IAvailability[]>;
}
