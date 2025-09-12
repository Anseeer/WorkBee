"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapServiceToEntity = exports.mapServiceToDTO = void 0;
const mapServiceToDTO = (service) => {
    return {
        _id: service.id,
        name: service.name,
        description: service.description,
        wage: service.wage,
        category: service.category,
        isActive: service.isActive
    };
};
exports.mapServiceToDTO = mapServiceToDTO;
const mapServiceToEntity = (service) => {
    return {
        _id: service.id,
        name: service.name,
        description: service.description,
        wage: service.wage,
        category: service.category,
        isActive: service.isActive
    };
};
exports.mapServiceToEntity = mapServiceToEntity;
