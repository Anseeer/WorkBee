import { IAvailabilitEntity } from "../../mappers/availability/availability.map.DTO.interface";
import { IAvailability } from "../../model/availablity/availablity.interface";

export interface IAvailabilityRepository {
    create(user: Partial<IAvailabilitEntity>): Promise<IAvailability>;
    findById(workerId: string): Promise<IAvailability | null>;
    findAvailabilityByWorkerId(workerId: string): Promise<IAvailability | null>;
    setAvailability(availability: IAvailability): Promise<IAvailability | null>;
    updateAvailability(iworkerIdd: string, availability: IAvailabilitEntity): Promise<IAvailability | null>;
    findByWorkerId(workerID: string): Promise<IAvailability | null>;
    findByEmail(email: string): Promise<IAvailability | null>;
    resetPassword(email: string, hashedPass: string): Promise<boolean>;
    update(availability: Partial<IAvailabilitEntity>): Promise<boolean>;
    markBookedSlot(availability: IAvailability): Promise<IAvailability | null>;
    removeExpiredDates(): Promise<number>;
}