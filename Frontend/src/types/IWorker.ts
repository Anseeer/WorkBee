import type { ISelectedService } from "./IService";

export interface IWorker {
    id: string,
    _id?: string,
    name: string,
    email: string,
    phone: string,
    password: string,
    age: number | string,
    bio: string,
    profileImage: string | File,
    role: string,
    completedWorks: number,
    radius: number,
    workType: string[],
    isVerified: boolean,
    status: string,
    rejectionReason: string,
    isActive: boolean,
    location: {
        address: string,
        pincode: string,
        lat: number | null,
        lng: number | null
    },
    govId: string | string[],
    ratings: {
        average: number,
        ratingsCount: number
    },
    services: ISelectedService[],
    categories: string[],
    subscription: {
        plan: string;
        startDate: Date;
        endDate: Date;
        commission: string;
    } | null,
    isAccountBuilt: boolean,
    createdAt: Date | string,
    updatedAt: Date
}
