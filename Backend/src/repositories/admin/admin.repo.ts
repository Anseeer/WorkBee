import BaseRepository from "../base/base.repo";
import Admin from "../../model/admin/admin.model";
import { IAdmin } from "../../model/admin/admin.interface";
import { IAdminRepository } from "./admin.repo.interface";

export class AdminRepository extends BaseRepository<IAdmin> implements IAdminRepository {
    constructor() {
        super(Admin)
    }
}