import { IAdmin } from "../../model/admin/admin.interface";
import { IAdminDTO } from "./admin.map.DTO.interface";

export const mapAdminToDTO = (admin: IAdmin): IAdminDTO => {
    return {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        phone: admin.phone
    }
}