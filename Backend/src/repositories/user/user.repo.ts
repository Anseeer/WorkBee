
import { Iuser } from "../../model/user/user.interface";
import User from "../../model/user/user.model";
import BaseRepository from "../base/base.repo";
import { IUserRepository } from "./user.repo.interface";

export class UserRepository extends BaseRepository<Iuser> implements IUserRepository {
    constructor() {
        super(User);
    }
}