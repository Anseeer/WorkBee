import { Iuser } from "../../model/user/user.interface"
import { IUserDTO, IUserEntity } from "./user.map.DTO.interface"


export const mapUserToDTO = (user: Iuser): IUserDTO => {
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
    }
}


export const mapToUserEntity = (user: Partial<Iuser>): IUserEntity => {
    return {
        id: user._id as string,
        name: user.name as string,
        email: user.email as string,
        phone: user.phone as string,
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
        isActive: user.isActive as boolean,
        role: user.role as string,
    };
};
