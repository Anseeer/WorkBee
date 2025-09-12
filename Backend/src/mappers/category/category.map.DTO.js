"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapCategoryToEntity = exports.mapCategoryToDTO = void 0;
const mapCategoryToDTO = (category) => {
    return {
        _id: category.id,
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
        isActive: category.isActive
    };
};
exports.mapCategoryToDTO = mapCategoryToDTO;
const mapCategoryToEntity = (category) => {
    return {
        _id: category.id,
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl,
        isActive: category.isActive,
    };
};
exports.mapCategoryToEntity = mapCategoryToEntity;
