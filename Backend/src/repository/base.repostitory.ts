import { Model, Document } from "mongoose";
import { Iread, Iwrite } from "../domain/interfaces/IBaseRepo";

export default class BaseRepository<T extends Document> implements Iread<T>, Iwrite<T> {
  private model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(user: Partial<T>): Promise<T> {
    const newUser = new this.model(user);
    return await newUser.save();
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
