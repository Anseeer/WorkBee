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

    async findByName(name: string): Promise<ISubscription | null> {
        if (!name) {
            throw new Error(SUBSCRIPTION_MESSAGE.NAME_MISSING)
        }

        return await this.model.findOne({ planName: { $regex: `^${name}$`, $options: 'i' } });
    }

    async toggleStatus(subscriptionId: string): Promise<void> {
        if (!subscriptionId) {
            throw new Error(SUBSCRIPTION_MESSAGE.ID_NOT_FOUND);
        }

        const sub = await this.model.findById(subscriptionId);
        if (!sub) {
            throw new Error(SUBSCRIPTION_MESSAGE.CANT_FIND);
        }

        const newStatus = !sub.isActive;

        await this.model.updateOne({ _id: subscriptionId }, { isActive: newStatus });
    }

    async update(subscriptionId: string, subscriptionData: Partial<ISubscription>): Promise<ISubscription> {
        if (!subscriptionData) throw new Error(SUBSCRIPTION_MESSAGE.MISSING_DATA);
        if (!subscriptionId) throw new Error(SUBSCRIPTION_MESSAGE.ID_NOT_FOUND);

        const sub = await this.model.findById(subscriptionId);
        if (!sub) throw new Error(SUBSCRIPTION_MESSAGE.CANT_FIND);

        const updatedData = {
            planName: subscriptionData.planName,
            description: subscriptionData.description,
            comission: subscriptionData.comission,
            amount: subscriptionData.amount,
            durationInDays: subscriptionData.durationInDays,
        };

        const updatedSub = await this.model.findByIdAndUpdate(
            subscriptionId,
            { $set: updatedData },
            { new: true }
        );

        if (!updatedSub) throw new Error(SUBSCRIPTION_MESSAGE.UPDATE_FAILD);
        return updatedSub;
    }


}