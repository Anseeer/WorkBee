import { injectable } from "inversify";
import { Iuser } from "../../model/user/user.interface";
import User from "../../model/user/user.model";
import BaseRepository from "../base/base.repo";
import { IUserRepository } from "./user.repo.interface";
import { IUserEntity } from "../../mappers/user/user.map.DTO.interface";
import { USERS_MESSAGE } from "../../constants/messages";

@injectable()
export class UserRepository extends BaseRepository<Iuser> implements IUserRepository {
    constructor() {
        super(User);
    }
    getAllUsers(): Promise<Iuser[] | null> {
        const users = User.find({ role: "User" }).sort({ createdAt: -1 });
        return users;
    }

    async setIsActive(id: string): Promise<boolean> {
        const user = await User.findById(id);
        if (!user) {
            throw new Error(USERS_MESSAGE.CANT_FIND_USER);
        }
        const newStatus = !user.isActive;

        await User.updateOne({ _id: id }, { $set: { isActive: newStatus } });
        return true;
    }

    async fetchData(userId: string): Promise<Iuser> {
        const user = await this.model.findById(userId);
        if (!user) {
            throw new Error(USERS_MESSAGE.CANT_FIND_USER);
        }
        return user;
    }

    async update(userDetails: IUserEntity, userId: string): Promise<boolean> {
        const existingUser = await this.model.findById(userId);
        if (!existingUser) {
            throw new Error(USERS_MESSAGE.CANT_FIND_USER);
        }
        const updatedFields = {
            name: userDetails.name,
            phone: userDetails.phone,
            profileImage: userDetails.profileImage,
            location: userDetails.location
        };

        const res = await this.model.updateOne({ _id: existingUser.id }, { $set: updatedFields });

        return res.modifiedCount > 0;
    }

    async findUsersByIds(userIds: string[]): Promise<Iuser[]> {
        const users = await this.model.find({ _id: { $in: userIds } });
        return users;
    }

}