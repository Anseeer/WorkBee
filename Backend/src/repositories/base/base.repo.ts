import { Model, Document } from "mongoose";
import { Iread, Iwrite } from "./base.repo.interface";

export default class BaseRepository<T extends Document> implements Iread<T>, Iwrite<T> {
    protected model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async create(item: Partial<T>): Promise<T> {
        const newItem = new this.model(item);
        return await newItem.save();
    }

    async findById(id: string): Promise<T> {
        return await this.model.findById(id) as T;
    }

    async findByEmail(email: string): Promise<T> {
        return await this.model.findOne({ email }) as T;
    }

    async resetPassword(email: string, hashedPass: string): Promise<boolean> {
        const result = await this.model.updateOne(
            { email },
            { $set: { password: hashedPass } }
        );
        return result.modifiedCount > 0;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.model.deleteOne({ _id: id });
        return result.deletedCount > 0;
    }
}
