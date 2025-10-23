import { ObjectId } from "mongoose";
import { IServices } from "../../model/service/service.interface";
import { IServiceDTO, IServiceEntity } from "./service.map.DTO.interface";

export const mapServiceToDTO = (service: Partial<IServices>): IServiceDTO => {
    return {
        _id: service.id || service._id,
        name: service.name as string,
        description: service.description as string,
        wage: service.wage as string,
        image: service.image as string,
        category: service.category as ObjectId || undefined,
        categoryName: service.categoryName as string | undefined,
        categoryIcon: service.categoryIcon as string || undefined,
        categoryId: service.categoryId as string || undefined,
        isActive: service.isActive as boolean
    }
}

export const mapServiceToEntity = (service: IServices): IServiceEntity => {
    return {
        _id: service.id,
        name: service.name,
        description: service.description,
        wage: service.wage,
        image: service.image,
        category: service.category,
        isActive: service.isActive
    }
}