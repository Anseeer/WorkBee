import { IServiceDTO } from "../../mappers/service/service.map.DTO.interface";
import { IServices } from "../../model/service/service.interface";

export interface IServiceService {
    create(service: IServices): Promise<IServiceDTO>;
    getAllServices(currentPage: string, pageSize: string): Promise<{ services: IServiceDTO[], totalPage: number }>;
    getByCategories(categoryIds: string[]): Promise<IServiceDTO[]>;
    setIsActive(serviceId: string): Promise<boolean>;
    update(service: IServices, serviceId: string): Promise<boolean>;
    delete(serviceId: string): Promise<boolean>;
    getByWorker(serviceIds: string[]): Promise<IServiceDTO[]>;
    getBySearch(searchKey: string): Promise<IServiceDTO[]>;
    getById(serviceId: string): Promise<IServiceDTO | null>;
}