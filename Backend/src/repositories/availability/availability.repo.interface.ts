import { IAvailability } from "../../model/availablity/availablity.interface";

export interface IAvailabilityRepository {
    create(user: Partial<IAvailability>): Promise<IAvailability>;
    findById(id: string): Promise<IAvailability | null>;
    findByWorkerId(id: string): Promise<IAvailability | null>;
    findByEmail(email: string): Promise<IAvailability | null>;
    resetPassword(email: string, hashedPass: string): Promise<boolean>;
    delete(id: string): Promise<boolean>;
    update(availability: IAvailability): Promise<boolean>;
}
