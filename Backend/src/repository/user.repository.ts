import { Iuser } from "../domain/entities/IUser";
import BaseRepository from "./base.repostitory";
import UserModel from "../infastructure/models/userSchema";

export class UserRepository extends BaseRepository<Iuser>{
    constructor(){
        super(UserModel);
    }
}