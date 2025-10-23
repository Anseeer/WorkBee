import { ISubscriptionDTO } from "../../mappers/subscription/subscription.map.DTO.interface";
import { ISubscription } from "../../model/subscription/subscription.interface";

export interface ISubscriptionService {
    create(item: ISubscription): Promise<boolean>;
    find(currentPage: string, pageSize: string, status?: boolean): Promise<{ subscription: ISubscriptionDTO[], totalPage: number }>;
    findByName(name: string): Promise<ISubscriptionDTO>;
    delete(subscriptionId: string): Promise<boolean>;
    toggleStatus(subscriptionId: string): Promise<void>;
    update(subscriptionId: string, subscriptionData: Partial<ISubscription>): Promise<ISubscriptionDTO>;
    activateSubscriptionPlan(workerId: string, planId: string, transactionId: string | null): Promise<void>;
}