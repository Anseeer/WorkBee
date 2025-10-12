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

    async find(currentPage: string, pageSize: string): Promise<{ subscription: ISubscriptionDTO[], totalPage: number }> {
        try {
            const page = parseInt(currentPage);
            const size = parseInt(pageSize);
            const startIndex = (page - 1) * size;
            const endIndex = page * size;
            const allSubscriptions = await this._subscriptionRepository.find();
            const pagedSub = allSubscriptions.slice(startIndex, endIndex);
            const subscription = pagedSub.map((sub) => mapSubscriptionToDTO(sub));
            const totalPage = Math.ceil(allSubscriptions.length / size);
            return { subscription, totalPage }
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
            let subData = await this._subscriptionRepository.find();
            if (subData.length >= 3) {
                throw SUBSCRIPTION_MESSAGE.LIMIT_WARNING;
            }
            const existingSub = await this._subscriptionRepository.findByName(item.planName);
            if (existingSub) {
                throw SUBSCRIPTION_MESSAGE.ALREADY_EXIST
            }
            const mapToEntityData = await mapSubscriptionToEntity(item);
            const created = await this._subscriptionRepository.create(mapToEntityData)
            return created ? true : false;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async delete(subscriptionId: string): Promise<boolean> {
        try {
            if (!subscriptionId) throw new Error(SUBSCRIPTION_MESSAGE.ID_NOT_FOUND);
            return await this._subscriptionRepository.delete(subscriptionId);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async toggleStatus(subscriptionId: string): Promise<void> {
        try {
            if (!subscriptionId) throw new Error(SUBSCRIPTION_MESSAGE.ID_NOT_FOUND);
            await this._subscriptionRepository.toggleStatus(subscriptionId);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }

    async update(subscriptionId: string, subscriptionData: Partial<ISubscription>): Promise<ISubscriptionDTO> {
        try {
            if (!subscriptionId) throw new Error(SUBSCRIPTION_MESSAGE.ID_NOT_FOUND);
            if (!subscriptionData) throw new Error(SUBSCRIPTION_MESSAGE.MISSING_DATA);
            let sameName = await this._subscriptionRepository.findByName(subscriptionData.planName as string);
            if (sameName) {
                throw new Error(SUBSCRIPTION_MESSAGE.ALREADY_EXIST);
            }
            const sub = await this._subscriptionRepository.update(subscriptionId, subscriptionData);
            return mapSubscriptionToDTO(sub);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    }
}