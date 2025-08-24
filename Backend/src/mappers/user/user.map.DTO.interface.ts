
export interface IUserDTO {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: {
        address: string,
        pincode: string,
        lat: number,
        lng: number
    },
    profileImage: string,
    isActive: boolean,
    role: string
}


export interface IUserEntity {
    id: string;
    name: string;
    email: string;
    phone: string;
    password?: string;
    location?: {
        address: string;
        pincode: string;
        lat: number;
        lng: number;
    };
    profileImage?: string;
    isActive: boolean;
    role: string;
}


