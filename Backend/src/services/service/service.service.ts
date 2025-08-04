import { inject, injectable } from "inversify";
import { ServiceRepository } from "../../repositories/services/service.repo";
import TYPES from "../../inversify/inversify.types";
import { IServiceService } from "./service.service.interface";
import { IServices } from "../../model/service/service.interface";

@injectable()
export class ServiceService implements IServiceService {
    private _serviceRepository: ServiceRepository;
    constructor(@inject(TYPES.serviceRepository) serviceRepo: ServiceRepository) {
        this._serviceRepository = serviceRepo;
    }

    create = async (service: IServices): Promise<IServices> => {
        const existingService = await this._serviceRepository.findByName(service.name);
        if (existingService) {
            throw new Error("Already Exist The Service");
        }
        return await this._serviceRepository.create(service);
    }

    getAllServices = async (): Promise<IServices[]> => {
        return await this._serviceRepository.getAllService();
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
            throw new Error("Service Not Exist");
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


} 