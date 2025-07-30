export interface IWorker {
    id: string,
    name: string,
    email: string,
    phone: string,
    password: string,
    age: number,
    bio: string,
    profileImage: string,
    role: string,
    minHours: string,
    workType: string[],
    preferredSchedule: string[],
    isVerified: boolean,
    isActive: boolean,
    location: {
        address: string,
        pincode: string,
        lat: number | null,
        lng: number | null
    },
    govId: string,
    services: string[],
    categories: string[],
    subscription: {
        plan: string;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    },
    isAccountBuilt:boolean,
    createdAt: Date,
    updatedAt: Date
}