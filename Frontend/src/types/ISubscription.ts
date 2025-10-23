

export interface ISubscription {
    id: string,
    planName: string,
    description: string,
    comission: number | string,
    amount: number | string,
    isActive: boolean,
    durationInDays: number | string,
    paymentId?: string
}