

export interface ISubscription {
    id:string,
    planName: string,
    description: string,
    comission: number,
    amount: number,
    isActive: boolean,
    durationInDays: number,
    paymentId?: string
}