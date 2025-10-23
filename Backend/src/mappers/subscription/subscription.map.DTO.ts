import { ISubscription } from "../../model/subscription/subscription.interface";
import { ISubscriptionDTO, ISubscriptionEntity } from "./subscription.map.DTO.interface";


export const mapSubscriptionToDTO = (subscription: ISubscription): ISubscriptionDTO => {
    return {
        id: subscription?._id.toString(),
        planName: subscription.planName,
        description: subscription.description,
        amount: subscription.amount?.toString() ?? "0",
        durationInDays: subscription.durationInDays?.toString() ?? "0",
        comission: subscription.comission?.toString() ?? "0",
        paymentId: subscription.paymentId?.toString() ?? "",
        isActive: subscription.isActive ?? false,
    };
};

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