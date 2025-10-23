import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { IServiceService } from "./service.service.interface";
import { IServices } from "../../model/service/service.interface";
import { IServiceRepository } from "../../repositories/services/service.repo.interface";
import { SERVICE_MESSAGE } from "../../constants/messages";
import { IServiceDTO } from "../../mappers/service/service.map.DTO.interface";
import { mapServiceToDTO, mapServiceToEntity } from "../../mappers/service/service.map.DTO";
import logger from "../../utilities/logger";

@injectable()
export class ServiceService implements IServiceService {
    private _serviceRepository: IServiceRepository;
    constructor(@inject(TYPES.serviceRepository) serviceRepo: IServiceRepository) {
        this._serviceRepository = serviceRepo;
    }

    create = async (service: IServices): Promise<IServiceDTO> => {
        try {
            const existingService = await this._serviceRepository.findByName(service.name);
            if (existingService) {
                throw new Error(SERVICE_MESSAGE.SERVICE_ALREADY_EXIST);
            }
            const serviceEntity = mapServiceToEntity(service);
            const newService = await this._serviceRepository.create(serviceEntity);
            return mapServiceToDTO(newService);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    getAllServices = async (currentPage: string, pageSize: string): Promise<{ services: IServiceDTO[], totalPage: number }> => {
        try {
            const page = parseInt(currentPage);
            const size = parseInt(pageSize);
            const startIndex = (page - 1) * size;
            const endIndex = page * size;
            const allServices = await this._serviceRepository.getAllService();
            const paged = allServices.slice(startIndex, endIndex);
            const services = paged.map((serv) => mapServiceToDTO(serv));
            const totalPage = Math.ceil(allServices.length / size);
            return { services, totalPage };
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    setIsActive = async (serviceId: string): Promise<boolean> => {
        try {
            await this._serviceRepository.setIsActive(serviceId);
            return true;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    update = async (service: IServices, serviceId: string): Promise<boolean> => {
        try {
            const existingService = await this._serviceRepository.findByName(service.name);
            if (existingService && existingService.id !== serviceId) {
                throw new Error(SERVICE_MESSAGE.SERVICE_ALREADY_EXIST);
            }
            const serviceEntity = mapServiceToEntity(service);
            await this._serviceRepository.update(serviceEntity, serviceId);
            return true;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    delete = async (serviceId: string): Promise<boolean> => {
        try {
            const existingService = await this._serviceRepository.findById(serviceId);
            if (!existingService) {
                throw new Error(SERVICE_MESSAGE.SERVICE_NOT_EXIST);
            }
            await this._serviceRepository.delete(serviceId);
            return true;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    getByCategories = async (categoryIds: string[]): Promise<IServiceDTO[]> => {
        try {
            const serv = await this._serviceRepository.getByCategories(categoryIds);
            return serv.map((s) => mapServiceToDTO(s));
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    getByWorker = async (serviceIds: string[]): Promise<IServiceDTO[]> => {
        try {
            const serv = await this._serviceRepository.getByWorker(serviceIds);
            return serv.map((s) => mapServiceToDTO(s));
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

    getBySearch = async (searchKey: string): Promise<IServiceDTO[]> => {
        try {
            const serv = await this._serviceRepository.getBySearch(searchKey) as IServices[];
            return serv.map((s) => mapServiceToDTO(s));
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw new Error(errMsg);
        }
    };

    getById = async (id: string): Promise<IServiceDTO | null> => {
        try {
            const serv = await this._serviceRepository.findById(id);
            return mapServiceToDTO(serv as IServices);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            logger.error(errMsg);
            throw error;
        }
    }

}