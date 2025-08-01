import { IServices } from "../../model/service/service.interface";

export interface IServiceRepository {
    create(category: Partial<IServices>): Promise<IServices>;
    findById(id: string): Promise<IServices | null>;
    findByName(name: string): Promise<IServices | null>;
    delete(id: string): Promise<boolean>;
    setIsActive(id: string): Promise<boolean>;
    update(category:IServices):Promise<boolean>;
    getAllService():Promise<IServices[]>
}
