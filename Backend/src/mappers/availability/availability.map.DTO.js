"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapAvailabilityToEntity = exports.mapAvailabilityToDTO = void 0;
const mapAvailabilityToDTO = (availability) => {
    if (!availability)
        return null;
    return {
        _id: availability.id,
        workerId: availability.workerId,
        availableDates: availability.availableDates
    };
};
exports.mapAvailabilityToDTO = mapAvailabilityToDTO;
const mapAvailabilityToEntity = (availability) => {
    return {
        workerId: availability.workerId,
        availableDates: availability.availableDates
    };
};
exports.mapAvailabilityToEntity = mapAvailabilityToEntity;
