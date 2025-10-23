export interface IService {
  _id?: string | undefined;
  id: string;
  category: string;
  categoryName?: string;
  name: string;
  description: string;
  wage: string;
  image: string;
  isActive: boolean;
}
