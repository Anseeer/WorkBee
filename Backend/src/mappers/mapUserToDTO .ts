import { Iuser } from "../domain/entities/IUser"
import { IUserResponseDTO } from "../domain/interfaces/IResponseDTO"


export const mapUserToDTO = (user: Iuser): IUserResponseDTO => {
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