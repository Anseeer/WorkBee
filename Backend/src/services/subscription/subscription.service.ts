import { inject, injectable } from "inversify";
import { ISubscriptionRepository } from "../../repositories/subscription/subscription.repo.interface";
import TYPES from "../../inversify/inversify.types";
import { ISubscriptionService } from "./subscription.service.interface";
import { ISubscription } from "../../model/subscription/subscription.interface";
import { mapSubscriptionToDTO, mapSubscriptionToEntity } from "../../mappers/subscription/subscription.map.DTO";
import { ISubscriptionDTO } from "../../mappers/subscription/subscription.map.DTO.interface";
import { SUBSCRIPTION_MESSAGE } from "../../constants/messages";

@injectable()
export class SubscriptionService implements ISubscriptionService {
    private _subscriptionRepository: ISubscriptionRepository;
    constructor(@inject(TYPES.subscriptionRepository) subscriptionRepo: ISubscriptionRepository) {
        this._subscriptionRepository = subscriptionRepo;
    }

    async find(): Promise<ISubscriptionDTO[]> {
        try {
            const subscriptions = await this._subscriptionRepository.find();
            return subscriptions.map((sub) => mapSubscriptionToDTO(sub));
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async findByName(name: string): Promise<ISubscriptionDTO> {
        try {
            if (!name) throw new Error(SUBSCRIPTION_MESSAGE.NAME_MISSING);
            const subscription = await this._subscriptionRepository.findByName(name);
            if (!subscription) throw new Error("Subscription not found");
            return mapSubscriptionToDTO(subscription);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async create(item: ISubscription): Promise<boolean> {
        try {
            if (!item) throw new Error("Subscription data missing");
            const mapToEntityData = await mapSubscriptionToEntity(item);
            const created = await this._subscriptionRepository.create(mapToEntityData)
            return created ? true : false;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }
}