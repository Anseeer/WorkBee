import { injectable } from "inversify";
import { Iuser } from "../../model/user/user.interface";
import User from "../../model/user/user.model";
import BaseRepository from "../base/base.repo";
import { IUserRepository } from "./user.repo.interface";
import { USERS_MESSAGE } from "../../constants/messages";
import { IUserEntity } from "../../mappers/user/user.map.DTO.interface";
import logger from "../../utilities/logger";

@injectable()
export class UserRepository extends BaseRepository<Iuser> implements IUserRepository {
    constructor() {
        super(User);
    }

    async getAllUsers(): Promise<Iuser[] | null> {
        try {
            return await User.find({ role: "User" }).sort({ createdAt: -1 });
        } catch (error) {
            logger.error('Error in getAllUsers:', error);
            throw new Error('Error in getAllUsers');
        }
    }

    async setIsActive(userId: string): Promise<boolean> {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error(USERS_MESSAGE.CANT_FIND_USER);
            }

            const newStatus = !user.isActive;
            await User.updateOne({ _id: userId }, { $set: { isActive: newStatus } });

            return true;
        } catch (error) {
            logger.error('Error in setIsActive:', error);
            throw new Error('Error in setIsActive');
        }
    }

    async fetchData(userId: string): Promise<Iuser> {
        try {
            const user = await this.model.findById(userId);
            if (!user) {
                throw new Error(USERS_MESSAGE.CANT_FIND_USER);
            }

            return user;
        } catch (error) {
            logger.error('Error in fetchData:', error);
            throw new Error('Error in fetchData');
        }
    }

    async findById(userId: string): Promise<Iuser> {
        try {
            const user = await this.model.findById(userId);
            if (!user) {
                throw new Error(USERS_MESSAGE.CANT_FIND_USER);
            }

            return user;
        } catch (error) {
            logger.error('Error in findById:', error);
            throw new Error('Error in findById');
        }
    }

    async update(userDetails: IUserEntity, userId: string): Promise<boolean> {
        try {
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

            const res = await this.model.updateOne(
                { _id: existingUser.id },
                { $set: updatedFields }
            );

            return res.modifiedCount > 0;
        } catch (error) {
            logger.error('Error in update:', error);
            throw new Error('Error in update');
        }
    }

    async findUsersByIds(userIds: string[]): Promise<Iuser[]> {
        try {
            return await this.model.find({ _id: { $in: userIds } });
        } catch (error) {
            logger.error('Error in findUsersByIds:', error);
            throw new Error('Error in findUsersByIds');
        }
    }

}