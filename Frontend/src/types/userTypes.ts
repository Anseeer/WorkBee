
export interface Iuser {
    name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  location:{
    address: string;
    pincode: string;
    lat: number | null;
    lng: number | null;
  },
}