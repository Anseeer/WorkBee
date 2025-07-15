
export interface IState {
    name: string,
    email: string,
    password: string,
    phone: string,
    location: {
        address: string,
        pincode: string,
        lat: number | null;
        lng: number | null;

    },
    categories: string[]
}