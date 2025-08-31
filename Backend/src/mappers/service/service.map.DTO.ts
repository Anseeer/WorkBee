import { IServices } from "../../model/service/service.interface";
import { IServiceDTO, IServiceEntity } from "./service.map.DTO.interface";

export const mapServiceToDTO = (service: IServices): IServiceDTO => {
    return {
        name: service.name,
        description: service.description,
        wage: service.wage,
        category: service.category,
        isActive: service.isActive
    }
}

export const mapServiceToEntity = (service: IServices): IServiceEntity => {
    return {
        name: service.name,
        description: service.description,
        wage: service.wage,
        category: service.category,
        isActive: service.isActive
    }
}