import { IServices } from "../../model/service/service.interface";
import { IServiceDTO, IServiceEntity } from "./service.map.DTO.interface";

export const mapServiceToDTO = (service: IServices): IServiceDTO => {
    return {
        _id: service.id || service._id,
        name: service.name,
        description: service.description,
        wage: service.wage,
        category: service.category,
        isActive: service.isActive
    }
}

export const mapServiceToEntity = (service: IServices): IServiceEntity => {
    return {
        _id: service.id,
        name: service.name,
        description: service.description,
        wage: service.wage,
        category: service.category,
        isActive: service.isActive
    }
}