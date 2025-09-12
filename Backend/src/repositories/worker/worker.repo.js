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
exports.WorkerRepository = void 0;
const inversify_1 = require("inversify");
const worker_model_1 = __importDefault(require("../../model/worker/worker.model"));
const base_repo_1 = __importDefault(require("../base/base.repo"));
const availablity_model_1 = require("../../model/availablity/availablity.model");
const haversine_distance_1 = __importDefault(require("haversine-distance"));
const mongoose_1 = require("mongoose");
const messages_1 = require("../../constants/messages");
const role_1 = require("../../constants/role");
let WorkerRepository = class WorkerRepository extends base_repo_1.default {
    constructor() {
        super(worker_model_1.default);
    }
    async findByIdAndUpdate(id, updatedFields) {
        try {
            return await this.model.findByIdAndUpdate(id, { $set: updatedFields }, { new: true });
        }
        catch (error) {
            console.error('Error in findByIdAndUpdate:', error);
            throw new Error('Error in findByIdAndUpdate');
        }
    }
    async findAvailabilityByWorkerId(id) {
        try {
            return await availablity_model_1.Availability.findOne({ workerId: id });
        }
        catch (error) {
            console.error('Error in findAvailabilityByWorkerId:', error);
            throw new Error('Error in findAvailabilityByWorkerId');
        }
    }
    async setAvailability(availability) {
        try {
            return await availablity_model_1.Availability.create(availability);
        }
        catch (error) {
            console.error('Error in setAvailability:', error);
            throw new Error('Error in setAvailability');
        }
    }
    async updateAvailability(workerId, availability) {
        try {
            return await availablity_model_1.Availability.findOneAndUpdate({ workerId }, { $set: availability }, { new: true });
        }
        catch (error) {
            console.error('Error in updateAvailability:', error);
            throw new Error('Error in updateAvailability');
        }
    }
    async getAllWorkers() {
        try {
            return await this.model.find({ role: role_1.Role.WORKER, isVerified: true }).sort({ createdAt: -1 });
        }
        catch (error) {
            console.error('Error in getAllWorkers:', error);
            throw new Error('Error in getAllWorkers');
        }
    }
    async getAllNonVerifiedWorkers() {
        try {
            return await this.model.find({ role: role_1.Role.WORKER, isVerified: false, isAccountBuilt: true }).sort({ createdAt: -1 });
        }
        catch (error) {
            console.error('Error in getAllNonVerifiedWorkers:', error);
            throw new Error('Error in getAllNonVerifiedWorkers');
        }
    }
    async setIsActive(id) {
        try {
            const worker = await this.model.findById(id);
            if (!worker) {
                throw new Error(messages_1.WORKER_MESSAGE.WORKER_NOT_EXIST);
            }
            const newStatus = !worker.isActive;
            await this.model.updateOne({ _id: id }, { $set: { isActive: newStatus } });
            return true;
        }
        catch (error) {
            console.error('Error in setIsActive:', error);
            throw new Error('Error in setIsActive');
        }
    }
    async approveWorker(id) {
        try {
            const worker = await this.model.findById(id);
            if (!worker) {
                throw new Error(messages_1.WORKER_MESSAGE.WORKER_NOT_EXIST);
            }
            await this.model.updateOne({ _id: id }, { $set: { isVerified: true, status: "Approved" } });
            return true;
        }
        catch (error) {
            console.error('Error in approveWorker:', error);
            throw new Error('Error in approveWorker');
        }
    }
    async rejectedWorker(id) {
        try {
            const worker = await this.model.findById(id);
            if (!worker) {
                throw new Error(messages_1.WORKER_MESSAGE.WORKER_NOT_EXIST);
            }
            await this.model.updateOne({ _id: id }, { $set: { isVerified: false, status: "Rejected" } });
            return true;
        }
        catch (error) {
            console.error('Error in rejectedWorker:', error);
            throw new Error('Error in rejectdWorker');
        }
    }
    async update(workerData) {
        try {
            const worker = await this.model.findById(workerData.id);
            if (!worker) {
                throw new Error(messages_1.WORKER_MESSAGE.WORKER_NOT_EXIST);
            }
            const updatedFields = {
                name: workerData.name,
                phone: workerData.phone,
                age: workerData.age,
                bio: workerData.bio,
                profileImage: workerData.profileImage,
                radius: workerData.radius,
                workType: workerData.workType,
                preferredSchedule: workerData.preferredSchedule,
                location: workerData.location,
                govId: workerData.govId,
                services: workerData.services,
                categories: workerData.categories,
                updatedAt: new Date(),
            };
            const result = await this.model.updateOne({ _id: workerData.id }, { $set: updatedFields });
            return result.modifiedCount > 0;
        }
        catch (error) {
            console.error('Error in update:', error);
            throw new Error('Error in update');
        }
    }
    async search(searchTerms) {
        try {
            const query = {
                workType: { $in: searchTerms.workType },
                isAccountBuilt: true,
                isActive: true,
                isVerified: true,
            };
            if (searchTerms.categoryId) {
                query.categories = { $in: [new mongoose_1.Types.ObjectId(searchTerms.categoryId.toString())] };
            }
            if (searchTerms.serviceId) {
                query.services = { $in: [new mongoose_1.Types.ObjectId(searchTerms.serviceId.toString())] };
            }
            const workers = await this.model.find(query);
            if (!searchTerms.location) {
                return workers;
            }
            const { lat, lng } = searchTerms.location;
            const filteredWorkers = workers.filter(worker => {
                if (!worker.location || !worker.radius) {
                    return false;
                }
                const workerCoords = {
                    latitude: worker.location.lat,
                    longitude: worker.location.lng
                };
                const searchCoords = {
                    latitude: lat,
                    longitude: lng
                };
                const distanceKm = (0, haversine_distance_1.default)(workerCoords, searchCoords) / 1000;
                return distanceKm <= worker.radius;
            });
            return filteredWorkers;
        }
        catch (error) {
            console.error('Error in search:', error);
            throw new Error('Error in search');
        }
    }
    async findById(id) {
        try {
            const worker = await this.model.findById(id);
            if (!worker) {
                throw new Error(messages_1.WORKER_MESSAGE.CANT_FIND_WORKER);
            }
            return worker;
        }
        catch (error) {
            console.error('Error in findById:', error);
            throw new Error('Error in findById');
        }
    }
    async findWorkersByIds(workerIds) {
        try {
            return await this.model.find({ _id: { $in: workerIds } });
        }
        catch (error) {
            console.error('Error in findWorkersByIds:', error);
            throw new Error('Error in findWorkersByIds');
        }
    }
};
exports.WorkerRepository = WorkerRepository;
exports.WorkerRepository = WorkerRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], WorkerRepository);
