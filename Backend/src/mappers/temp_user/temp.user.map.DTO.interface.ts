
export interface ITempUserDTO {
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
    otp: string,
}

export interface ITempUserEntity {
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
    otp: string;
}


