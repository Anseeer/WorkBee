import { injectable } from "inversify";
import { ISubscription } from "../../model/subscription/subscription.interface";
import Subscription from "../../model/subscription/subscription.model";
import BaseRepository from "../base/base.repo";
import { ISubscriptionRepository } from "./subscription.repo.interface";
import { SUBSCRIPTION_MESSAGE } from "../../constants/messages";

@injectable()
export class SubscriptionRepository extends BaseRepository<ISubscription> implements ISubscriptionRepository {
    constructor() {
        super(Subscription)
    }

    async find(): Promise<ISubscription[]> {
        return await this.model.find();
    }

    async findByName(name: string): Promise<ISubscription> {
        if (!name) {
            throw new Error(SUBSCRIPTION_MESSAGE.NAME_MISSING)
        }

        const sub = await this.model.findOne({ planName: name });
        if (!sub) {
            throw new Error(SUBSCRIPTION_MESSAGE.CANT_FIND)
        }

        return sub;

    }


}