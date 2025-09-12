"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async create(item) {
        try {
            const newItem = new this.model(item);
            return await newItem.save();
        }
        catch (error) {
            console.error('Error in create:', error);
            throw new Error('Error in create');
        }
    }
    async findById(id) {
        try {
            return await this.model.findById(id);
        }
        catch (error) {
            console.error('Error in findById:', error);
            throw new Error('Error in findById');
        }
    }
    async findByEmail(email) {
        try {
            return await this.model.findOne({ email });
        }
        catch (error) {
            console.error('Error in findByEmail:', error);
            throw new Error('Error in findByIdEmail');
        }
    }
    async resetPassword(email, hashedPass) {
        try {
            const result = await this.model.updateOne({ email }, { $set: { password: hashedPass } });
            return result.modifiedCount > 0;
        }
        catch (error) {
            console.error('Error in resetPassword:', error);
            throw new Error('Error in resetPassword');
        }
    }
    async delete(id) {
        try {
            const result = await this.model.deleteOne({ _id: id });
            return result.deletedCount > 0;
        }
        catch (error) {
            console.error('Error in delete:', error);
            throw new Error('Error in delete');
        }
    }
}
exports.default = BaseRepository;
