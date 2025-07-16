import { Iuser } from "../../model/user/user.interface"
import { IUserDTO } from "./user.map.DTO.interface"


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