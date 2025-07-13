import { Iuser } from "../domain/entities/IUser";
import BaseRepository from "./baseRepostitory";
import UserModel from "../infastructure/models/userSchema";

export class UserRepository extends BaseRepository<Iuser> {
    constructor() {
        super(UserModel);
    }
}