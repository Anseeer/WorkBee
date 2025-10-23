import { IAvailabilitEntity } from "../../mappers/availability/availability.map.DTO.interface";
import { IAvailability } from "../../model/availablity/availablity.interface";

export interface IAvailabilityRepository {
    create(user: Partial<IAvailabilitEntity>): Promise<IAvailability>;
    findById(id: string): Promise<IAvailability | null>;
    findByWorkerId(id: string): Promise<IAvailability | null>;
    findByEmail(email: string): Promise<IAvailability | null>;
    resetPassword(email: string, hashedPass: string): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    update(availability: Partial<IAvailabilitEntity>): Promise<boolean>;
    markBookedSlot(availability: IAvailability): Promise<IAvailability | null>;
    removeExpiredDates(): Promise<number>;
}