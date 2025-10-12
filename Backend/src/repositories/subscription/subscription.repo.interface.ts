import { ISubscription } from "../../model/subscription/subscription.interface";
import { Iwrite } from "../base/base.repo.interface";

export interface ISubscriptionRepository extends Iwrite<ISubscription> {
    find(): Promise<ISubscription[]>;
    findByName(name: string): Promise<ISubscription | null>;
    toggleStatus(subscriptionId: string): Promise<void>;
    update(subscriptionId: string,subscriptionData:Partial<ISubscription>): Promise<ISubscription>;
}