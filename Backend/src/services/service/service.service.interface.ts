import { IServices } from "../../model/service/service.interface";

export interface IServiceService {
    create(service: IServices): Promise<IServices>;
    getAllServices(currentPage:string,pageSize:string): Promise<{services:IServices[],totalPage:number}>;
    getByCategories(categoryIds: string[]): Promise<IServices[]>;
    setIsActive(service: string): Promise<boolean>;
    update(service: IServices, serviceId: string): Promise<boolean>;
    delete(serviceId: string): Promise<boolean>;
    getByWorker(serviceIds: string[]): Promise<IServices[]>;
    getBySearch(searchKey: string): Promise<IServices[]>;
    getById(id: string): Promise<IServices | null>;
}