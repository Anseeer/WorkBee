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
exports.ServiceRepository = void 0;
const inversify_1 = require("inversify");
const service_model_1 = __importDefault(require("../../model/service/service.model"));
const base_repo_1 = __importDefault(require("../base/base.repo"));
let ServiceRepository = class ServiceRepository extends base_repo_1.default {
    constructor() {
        super(service_model_1.default);
        this.update = async (service, serviceId) => {
            try {
                const result = await this.model.updateOne({ _id: serviceId }, { $set: { name: service.name, wage: service.wage, category: service.category } });
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
        this.getByCategories = async (categoryIds) => {
            try {
                return await this.model.find({ category: { $in: categoryIds } });
            }
            catch (error) {
                console.error('Error in getByCategories:', error);
                throw new Error('Error in getByCategories');
            }
        };
        this.getByWorker = async (serviceIds) => {
            try {
                return await this.model.find({ _id: { $in: serviceIds } });
            }
            catch (error) {
                console.error('Error in getByWorker:', error);
                throw new Error('Error in getByWorker');
            }
        };
        this.getBySearch = async (searchKey) => {
            try {
                const terms = searchKey.trim().split(/\s+/);
                const regexArray = terms.map(term => new RegExp(term, "i"));
                return await this.model.aggregate([
                    {
                        $match: {
                            $or: [
                                { name: { $in: regexArray } },
                                { description: { $in: regexArray } },
                                { _id: { $in: regexArray } }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            matchScore: {
                                $add: [
                                    {
                                        $size: {
                                            $filter: {
                                                input: regexArray,
                                                as: "term",
                                                cond: { $regexMatch: { input: "$name", regex: "$$term" } }
                                            }
                                        }
                                    },
                                    {
                                        $size: {
                                            $filter: {
                                                input: regexArray,
                                                as: "term",
                                                cond: { $regexMatch: { input: "$description", regex: "$$term" } }
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    },
                    { $sort: { matchScore: -1 } },
                    { $limit: 12 }
                ]);
            }
            catch (error) {
                console.error('Error in getBySearch:', error);
                throw new Error('Error in getBySearch');
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
    async findByName(name) {
        try {
            return await this.model.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
        }
        catch (error) {
            console.error('Error in findByName:', error);
            throw new Error('Error in findByName');
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
    async getAllService() {
        try {
            return await this.model.find().sort({ createdAt: 1 });
        }
        catch (error) {
            console.error('Error in getAllService:', error);
            throw new Error('Error in getAllServices');
        }
    }
    async setIsActive(id) {
        try {
            const service = await this.model.findById(id);
            if (!service)
                return false;
            const updatedStatus = !service.isActive;
            await this.model.updateOne({ _id: id }, { $set: { isActive: updatedStatus } });
            return true;
        }
        catch (error) {
            console.error('Error in setIsActive:', error);
            throw new Error('Error in setISActive');
        }
    }
};
exports.ServiceRepository = ServiceRepository;
exports.ServiceRepository = ServiceRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], ServiceRepository);
