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
exports.CategoryRepository = void 0;
const inversify_1 = require("inversify");
const category_model_1 = __importDefault(require("../../model/category/category.model"));
const base_repo_1 = __importDefault(require("../base/base.repo"));
let CategoryRepository = class CategoryRepository extends base_repo_1.default {
    constructor() {
        super(category_model_1.default);
        this.update = async (category, categoryId) => {
            try {
                const result = await this.model.updateOne({ _id: categoryId }, {
                    $set: {
                        name: category.name,
                        description: category.description,
                        imageUrl: category.imageUrl
                    }
                });
                return result.modifiedCount > 0;
            }
            catch (error) {
                console.error('Error in update:', error);
                throw new Error('Error in update');
            }
        };
        this.delete = async (id) => {
            try {
                const result = await this.model.deleteOne({ _id: id });
                return result.deletedCount > 0;
            }
            catch (error) {
                console.error('Error in delete:', error);
                throw new Error('Error in delete');
            }
        };
        this.getByWorker = async (categoryIds) => {
            try {
                return await this.model.find({ _id: { $in: categoryIds } });
            }
            catch (error) {
                console.error('Error in getByWorker:', error);
                throw new Error('Error in getByWorker');
            }
        };
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
    async getAll() {
        try {
            return await this.model.find().sort({ createdAt: -1 });
        }
        catch (error) {
            console.error('Error in getAll:', error);
            throw new Error('Error in getAll');
        }
    }
    async findByName(name) {
        try {
            return await this.model.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
        }
        catch (error) {
            console.error('Error in findByName:', error);
            throw new Error('Error in findByName');
        }
    }
    async setIsActive(id) {
        try {
            const category = await this.model.findById(id);
            if (!category)
                return false;
            const updatedStatus = !category.isActive;
            await this.model.updateOne({ _id: id }, { $set: { isActive: updatedStatus } });
            return true;
        }
        catch (error) {
            console.error('Error in setIsActive:', error);
            throw new Error('Error in setIsActive');
        }
    }
};
exports.CategoryRepository = CategoryRepository;
exports.CategoryRepository = CategoryRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], CategoryRepository);
