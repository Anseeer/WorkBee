export interface Iuser {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    profileImage: string;
    location: {
        address: string;
        pincode: string;
        lat: number | null;
        lng: number | null;
    };
    isActive: boolean
}