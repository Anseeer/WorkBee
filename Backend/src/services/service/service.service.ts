import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { IServiceService } from "./service.service.interface";
import { IServices } from "../../model/service/service.interface";
import { IServiceRepository } from "../../repositories/services/service.repo.interface";
import { SERVICE_MESSAGE } from "../../constants/messages";

@injectable()
export class ServiceService implements IServiceService {
    private _serviceRepository: IServiceRepository;
    constructor(@inject(TYPES.serviceRepository) serviceRepo: IServiceRepository) {
        this._serviceRepository = serviceRepo;
    }

    create = async (service: IServices): Promise<IServices> => {
        const existingService = await this._serviceRepository.findByName(service.name);
        if (existingService) {
            throw new Error(SERVICE_MESSAGE.SERVICE_ALREADY_EXIST);
        }
        return await this._serviceRepository.create(service);
    }

    getAllServices = async (currentPage:string,pageSize:string): Promise<{services:IServices[],totalPage:number}> => {
        const page = parseInt(currentPage);
        const size = parseInt(pageSize);
        const startIndex = (page-1) * size;
        const endIndex = page * size;
        const service = await this._serviceRepository.getAllService();
        const services = service.slice(startIndex,endIndex);
        const totalPage = Math.ceil(service.length/size);
        return {services,totalPage}
    };

    setIsActive = async (serviceId: string): Promise<boolean> => {
        await this._serviceRepository.setIsActive(serviceId);
        return true;
    }

    update = async (service: IServices, serviceId: string): Promise<boolean> => {
        await this._serviceRepository.update(service, serviceId);
        return true;
    }

    delete = async (serviceId: string): Promise<boolean> => {
        const existingService = await this._serviceRepository.findById(serviceId);
        if (!existingService) {
            throw new Error(SERVICE_MESSAGE.SERVICE_NOT_EXIST);
        }
        await this._serviceRepository.delete(serviceId);
        return true;
    }

    getByCategories = async (categoryIds: string[]): Promise<IServices[]> => {
        return await this._serviceRepository.getByCategories(categoryIds);
    }

    getByWorker = async (serviceIds: string[]): Promise<IServices[]> => {
        return await this._serviceRepository.getByWorker(serviceIds);
    }

    getBySearch = async (searchKey: string): Promise<IServices[]> => {
        return await this._serviceRepository.getBySearch(searchKey);
    };

    getById = async (id: string): Promise<IServices | null> => {
        return await this._serviceRepository.findById(id);
    };


} 