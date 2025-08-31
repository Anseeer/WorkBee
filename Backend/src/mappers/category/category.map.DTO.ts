import { ICategory } from "../../model/category/category.interface"
import { ICategoryDTO, ICategoryEntity } from "./category.map.DTO.interface"

export const mapCategoryToDTO = (category: ICategory): ICategoryDTO => {
    return {
        _id: category.id,
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
        isActive: category.isActive
    }
}

export const mapCategoryToEntity = (category: ICategory): ICategoryEntity => {
    return {
        _id: category.id,
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
        isActive: category.isActive,
    }
}