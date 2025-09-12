"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToUserEntity = exports.mapUserToDTO = void 0;
const mapUserToDTO = (user) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: {
            address: user.location?.address,
            pincode: user.location?.pincode,
            lat: user.location?.lat,
            lng: user.location?.lng,
        },
        profileImage: user.profileImage,
        isActive: user.isActive,
        role: user.role,
    };
};
exports.mapUserToDTO = mapUserToDTO;
const mapToUserEntity = (user) => {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password,
        location: user.location
            ? {
                address: user.location.address,
                pincode: user.location.pincode,
                lat: user.location.lat,
                lng: user.location.lng,
            }
            : undefined,
        profileImage: user.profileImage,
        isActive: user.isActive,
        role: user.role,
    };
};
exports.mapToUserEntity = mapToUserEntity;
