
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
    preferredSchedule: string[],
    isVerified: boolean,
    status: string,
    isActive: boolean,
    location: {
        address: string,
        pincode: string,
        lat: number | null,
        lng: number | null
    },
    govId: string | string[],
    services: string[],
    categories: string[],
    subscription: {
        plan: string;
        startDate: Date;
        endDate: Date;
        isActive: boolean;
    },
    isAccountBuilt: boolean,
    createdAt: Date | string,
    updatedAt: Date
}
