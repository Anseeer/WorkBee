import { IServiceEntity } from "../../mappers/service/service.map.DTO.interface";
import { IServices } from "../../model/service/service.interface";

export interface IServiceRepository {
    create(category: Partial<IServiceEntity>): Promise<IServices>;
    findById(id: string): Promise<IServices | null>;
    findByName(name: string): Promise<IServices | null>;
    delete(id: string): Promise<boolean>;
    setIsActive(id: string): Promise<boolean>;
    update(category: IServiceEntity, serviceId: string): Promise<boolean>;
    getAllService(): Promise<IServices[]>
    getByCategories(categoryIds: string[]): Promise<IServices[]>
    getByWorker(serviceIds: string[]): Promise<IServices[]>
    getBySearch(searchKey: string): Promise<IServices[]>
}
