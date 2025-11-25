import { injectable } from "inversify";
import BaseRepository from "../base/base.repo";
import { ITempUser } from "../../model/temp_user/temp.user.interface";
import TempUser from "../../model/temp_user/temp.user.model";
import { ITempUserRepository } from "./temp.user.interface.repo";
import { USERS_MESSAGE } from "../../constants/messages";
import logger from "../../utilities/logger";


@injectable()
export class TempUserRepository extends BaseRepository<ITempUser> implements ITempUserRepository {
    constructor() {
        super(TempUser);
    }

    async findUserById(id: string): Promise<ITempUser | null> {
        try {
            return await this.model.findById(id);
        } catch (error) {
            logger.error('Error in findById:', error);
            throw new Error('Error in findById');
        }
    }

    async findTempUserByEmail(email: string): Promise<ITempUser | null> {
        try {
            return await this.model.findOne({ email });
        } catch (error) {
            logger.error("Error in findByEmail:", error);
            throw new Error('Error in findByEmail');
        }
    }

    async updateById(userId: string, updateData: Partial<ITempUser>): Promise<ITempUser | null> {
        try {
            const updatedUser = await this.model.findByIdAndUpdate(userId, updateData, { new: true }).exec();
            if (!updatedUser) {
                throw new Error(USERS_MESSAGE.CANT_FIND_USER);
            }
            return updatedUser;
        } catch (error) {
            logger.error("Error in updateById:", error);
            throw new Error('Error in updateById');
        }
    }

}