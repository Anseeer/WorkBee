import { ISubscriptionDTO } from "../../mappers/subscription/subscription.map.DTO.interface";
import { ISubscription } from "../../model/subscription/subscription.interface";

export interface ISubscriptionService {
    create(item: ISubscription): Promise<boolean>;
    find(): Promise<ISubscriptionDTO[]>;
    findByName(name: string): Promise<ISubscriptionDTO>;
}