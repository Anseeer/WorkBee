export interface IService {
  _id?:string|undefined;
  id: string;               
  category: string;         
  categoryName?: string;         
  name: string;
  description: string;
  wage: string;
  isActive: boolean;
}
