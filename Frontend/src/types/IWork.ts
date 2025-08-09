
export interface IWork {
    userId: string,
    workerId: string,
    serviceId: string,
    categoryId: string,
    wage:string,
    location:{
        address:string,
        pincode:string,
        lat:number,
        lng:number
    },
    workType:string,
    size:string,
    description:string,
    sheduleDate:string,
    sheduleTime:string,
    status:string,
    paymentStatus:string,
    createdAt:Date,
    updatedAt:Date,
}