"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const inversify_1 = require("inversify");
const user_model_1 = __importDefault(require("../../model/user/user.model"));
const base_repo_1 = __importDefault(require("../base/base.repo"));
const messages_1 = require("../../constants/messages");
let UserRepository = class UserRepository extends base_repo_1.default {
    constructor() {
        super(user_model_1.default);
    }
    async getAllUsers() {
        try {
            return await user_model_1.default.find({ role: "User" }).sort({ createdAt: -1 });
        }
        catch (error) {
            console.error('Error in getAllUsers:', error);
            throw new Error('Error in getAllUsers');
        }
    }
    async setIsActive(id) {
        try {
            const user = await user_model_1.default.findById(id);
            if (!user) {
                throw new Error(messages_1.USERS_MESSAGE.CANT_FIND_USER);
            }
            const newStatus = !user.isActive;
            await user_model_1.default.updateOne({ _id: id }, { $set: { isActive: newStatus } });
            return true;
        }
        catch (error) {
            console.error('Error in setIsActive:', error);
            throw new Error('Error in setIsActive');
        }
    }
    async fetchData(userId) {
        try {
            const user = await this.model.findById(userId);
            if (!user) {
                throw new Error(messages_1.USERS_MESSAGE.CANT_FIND_USER);
            }
            return user;
        }
        catch (error) {
            console.error('Error in fetchData:', error);
            throw new Error('Error in fetchData');
        }
    }
    async update(userDetails, userId) {
        try {
            const existingUser = await this.model.findById(userId);
            if (!existingUser) {
                throw new Error(messages_1.USERS_MESSAGE.CANT_FIND_USER);
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
        catch (error) {
            console.error('Error in update:', error);
            throw new Error('Error in update');
        }
    }
    async findUsersByIds(userIds) {
        try {
            return await this.model.find({ _id: { $in: userIds } });
        }
        catch (error) {
            console.error('Error in findUsersByIds:', error);
            throw new Error('Error in findUsersByIds');
        }
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], UserRepository);
