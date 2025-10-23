import { Model, Document } from "mongoose";
import { Iread, Iwrite } from "./base.repo.interface";
import logger from "../../utilities/logger";

export default class BaseRepository<T extends Document> implements Iread<T>, Iwrite<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(item: Partial<T>): Promise<T> {
        try {
            const newItem = new this.model(item);
            return await newItem.save();
        } catch (error) {
            logger.error('Error in create:', error);
            throw new Error('Error in create');
        }
    }

    async findById(id: string): Promise<T> {
        try {
            return await this.model.findById(id) as T;
        } catch (error) {
            logger.error('Error in findById:', error);
            throw new Error('Error in findById');
        }
    }

    async findByEmail(email: string): Promise<T> {
        try {
            return await this.model.findOne({ email }) as T;
        } catch (error) {
            logger.error('Error in findByEmail:', error);
            throw new Error('Error in findByIdEmail');
        }
    }

    async resetPassword(email: string, hashedPass: string): Promise<boolean> {
        try {
            const result = await this.model.updateOne(
                { email },
                { $set: { password: hashedPass } }
            );
            return result.modifiedCount > 0;
        } catch (error) {
            logger.error('Error in resetPassword:', error);
            throw new Error('Error in resetPassword');
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const result = await this.model.deleteOne({ _id: id });
            return result.deletedCount > 0;
        } catch (error) {
            logger.error('Error in delete:', error);
            throw new Error('Error in delete');
        }
    }

}
