import { ISubscription } from "../../model/subscription/subscription.interface";
import { ISubscriptionDTO, ISubscriptionEntity } from "./subscription.map.DTO.interface";


export const mapSubscriptionToDTO = (subscription: ISubscription): ISubscriptionDTO => {
    return {
        name: subscription.planName,
        description: subscription.description,
        amount: subscription.amount.toString(),
        durationInDays: subscription.durationInDays.toString(),
        comission: subscription.comission.toString(),
        paymentId: subscription.paymentId.toString(),
        isActive: subscription.isActive,
    }
}

export const mapSubscriptionToEntity = (subscription: ISubscription): ISubscriptionEntity => {
    return {
        planName: subscription.planName,
        description: subscription.description,
        amount: subscription.amount,
        durationInDays: subscription.durationInDays,
        comission: subscription.comission,
        paymentId: subscription.paymentId,
        isActive: subscription.isActive,
    }
}