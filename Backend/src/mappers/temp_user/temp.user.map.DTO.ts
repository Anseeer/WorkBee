import { ITempUser } from "../../model/temp_user/temp.user.interface";
import { ITempUserDTO, ITempUserEntity } from "./temp.user.map.DTO.interface";

export const mapTempUserToDTO = (user: ITempUser): ITempUserDTO => {
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
        otp: user.otp
    }
}

export const mapToTempUserEntity = (user: Partial<ITempUser>): ITempUserEntity => {
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
        otp: user.otp as string
    };
};
