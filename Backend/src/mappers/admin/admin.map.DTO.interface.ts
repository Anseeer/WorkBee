import { Types } from "mongoose";

export interface IAdminDTO {
    _id: Types.ObjectId,
    name: string,
    phone: string,
    email: string,
    role: string,
}