import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { IServiceService } from "./service.service.interface";
import { IServices } from "../../model/service/service.interface";
import { IServiceRepository } from "../../repositories/services/service.repo.interface";
import { SERVICE_MESSAGE } from "../../constants/messages";
import { IServiceDTO } from "../../mappers/service/service.map.DTO.interface";
import { mapServiceToDTO, mapServiceToEntity } from "../../mappers/service/service.map.DTO";

@injectable()
export class ServiceService implements IServiceService {
    private _serviceRepository: IServiceRepository;
    constructor(@inject(TYPES.serviceRepository) serviceRepo: IServiceRepository) {
        this._serviceRepository = serviceRepo;
    }

    create = async (service: IServices): Promise<IServiceDTO> => {
        const existingService = await this._serviceRepository.findByName(service.name);
        if (existingService) {
            throw new Error(SERVICE_MESSAGE.SERVICE_ALREADY_EXIST);
        }
        const serviceEntity = mapServiceToEntity(service);
        const newService = await this._serviceRepository.create(serviceEntity);
        const serv = mapServiceToDTO(newService);
        return serv;
    }

    getAllServices = async (currentPage: string, pageSize: string): Promise<{ services: IServiceDTO[], totalPage: number }> => {
        const page = parseInt(currentPage);
        const size = parseInt(pageSize);
        const startIndex = (page - 1) * size;
        const endIndex = page * size;
        const service = await this._serviceRepository.getAllService();
        const serv = service.slice(startIndex, endIndex);
        const services = serv.map((serv) => mapServiceToDTO(serv))
        const totalPage = Math.ceil(service.length / size);
        return { services, totalPage }
    };

    setIsActive = async (serviceId: string): Promise<boolean> => {
        await this._serviceRepository.setIsActive(serviceId);
        return true;
    }

    update = async (service: IServices, serviceId: string): Promise<boolean> => {
        const serviceEntity = mapServiceToEntity(service);
        await this._serviceRepository.update(serviceEntity, serviceId);
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

    getByCategories = async (categoryIds: string[]): Promise<IServiceDTO[]> => {
        const serv = await this._serviceRepository.getByCategories(categoryIds);
        const services = serv.map((serv) => mapServiceToDTO(serv));
        return services;
    }

    getByWorker = async (serviceIds: string[]): Promise<IServiceDTO[]> => {
        const serv = await this._serviceRepository.getByWorker(serviceIds);
        const services = serv.map((serv) => mapServiceToDTO(serv));
        return services;
    }

    getBySearch = async (searchKey: string): Promise<IServiceDTO[]> => {
        const serv = await this._serviceRepository.getBySearch(searchKey);
        const services = serv.map((serv) => mapServiceToDTO(serv));
        return services;
    };

    getById = async (id: string): Promise<IServiceDTO | null> => {
        const serv = await this._serviceRepository.findById(id);
        const services = mapServiceToDTO(serv as IServices);
        return services;
    };

}