import { injectable } from "inversify";
import { Iuser } from "../../model/user/user.interface";
import User from "../../model/user/user.model";
import BaseRepository from "../base/base.repo";
import { IUserRepository } from "./user.repo.interface";

@injectable()
export class UserRepository extends BaseRepository<Iuser> implements IUserRepository {
    constructor() {
        super(User);
    }
    getAllUsers(): Promise<Iuser[] | null> {
        let users = User.find({ role: "User" }).sort({ createdAt: -1 });
        return users;
    }

    async setIsActive(id: string): Promise<boolean> {
        let user = await User.findById(id);
        if (!user) {
            throw new Error("user not find in the id");
        }
        let newStatus = !user.isActive;

        await User.updateOne({ _id: id }, { $set: { isActive: newStatus } });
        return true;
    }
}