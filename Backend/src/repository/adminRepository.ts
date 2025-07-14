import BaseRepository from "./baseRepostitory";
import AdminModel from "../infastructure/models/adminSchema";
import { IAdmin } from "../domain/entities/IAdmin";

export class adminRepository extends BaseRepository<IAdmin> {
    constructor() {
        super(AdminModel)
    }
}