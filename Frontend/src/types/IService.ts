export interface IService {
  _id?: string | undefined;
  id: string;
  category: string;
  categoryName?: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
}

export interface ISelectedService {
  serviceId: string
  name: string
  price: number
  unit: "hour"
}
