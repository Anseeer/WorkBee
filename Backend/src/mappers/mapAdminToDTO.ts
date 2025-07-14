import { IAdmin } from "../domain/entities/IAdmin";
import { IAdminResponseDTO } from "../domain/interfaces/IResponseDTO";

export const mapAdminToDTO = (admin:IAdmin):IAdminResponseDTO=>{
    return {
        _id:admin._id,
        name:admin.name,
        email:admin.email,
        role:admin.role,
        phone:admin.phone
    }
}