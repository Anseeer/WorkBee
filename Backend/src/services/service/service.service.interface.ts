import { IServiceDTO } from "../../mappers/service/service.map.DTO.interface";
import { IServices } from "../../model/service/service.interface";

export interface IServiceService {
    create(service: IServices): Promise<IServiceDTO>;
    getAllServices(currentPage:string,pageSize:string): Promise<{services:IServiceDTO[],totalPage:number}>;
    getByCategories(categoryIds: string[]): Promise<IServiceDTO[]>;
    setIsActive(service: string): Promise<boolean>;
    update(service: IServices, serviceId: string): Promise<boolean>;
    delete(serviceId: string): Promise<boolean>;
    getByWorker(serviceIds: string[]): Promise<IServiceDTO[]>;
    getBySearch(searchKey: string): Promise<IServiceDTO[]>;
    getById(id: string): Promise<IServiceDTO | null>;
}