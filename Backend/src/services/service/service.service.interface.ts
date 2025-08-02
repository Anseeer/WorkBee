import { IServices } from "../../model/service/service.interface";

export interface IServiceService {
    create(service: IServices): Promise<IServices>;
    getAllServices(): Promise<IServices[]>;
    setIsActive(service: string): Promise<boolean>;
    update(service: IServices,serviceId:string): Promise<boolean>;
    delete(serviceId: string): Promise<boolean>;
}