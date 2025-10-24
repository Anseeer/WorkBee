import { IServiceEntity } from "../../mappers/service/service.map.DTO.interface";
import { IServices } from "../../model/service/service.interface";

export interface IServiceRepository {
    getBySearch(searchKey: string): unknown;
    create(category: Partial<IServices>): Promise<IServices>;
    findById(serviceId: string): Promise<IServices | null>;
    findByName(name: string): Promise<IServices | null>;
    delete(serviceId: string): Promise<boolean>;
    setIsActive(serviceId: string): Promise<boolean>;
    update(category: IServiceEntity, serviceId: string): Promise<boolean>;
    getAllService(): Promise<IServices[]>
    getByCategories(categoryIds: string[]): Promise<IServices[]>
    getByWorker(serviceIds: string[]): Promise<IServices[]>
}
