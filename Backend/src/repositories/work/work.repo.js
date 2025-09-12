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
exports.WorkRepository = void 0;
const inversify_1 = require("inversify");
const base_repo_1 = __importDefault(require("../base/base.repo"));
const work_model_1 = __importDefault(require("../../model/work/work.model"));
const messages_1 = require("../../constants/messages");
let WorkRepository = class WorkRepository extends base_repo_1.default {
    constructor() {
        super(work_model_1.default);
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
    async findByUser(userId) {
        try {
            return await this.model.find({ userId }).sort({ createdAt: -1 });
        }
        catch (error) {
            console.error('Error in findByUser:', error);
            throw new Error('Error in findByUser');
        }
    }
    async findByWorker(workerId) {
        try {
            return await this.model.find({ workerId }).sort({ createdAt: -1 });
        }
        catch (error) {
            console.error('Error in findByWorker:', error);
            throw new Error('Error in findByWorker');
        }
    }
    async cancel(workId) {
        try {
            const res = await this.model.updateOne({ _id: workId }, { $set: { status: "Canceled" } });
            return res.modifiedCount > 0;
        }
        catch (error) {
            console.error('Error in cancel:', error);
            throw new Error('Error in cancel');
        }
    }
    async accept(workId) {
        try {
            const res = await this.model.updateOne({ _id: workId }, { $set: { status: "Accepted" } });
            return res.modifiedCount > 0;
        }
        catch (error) {
            console.error('Error in accept:', error);
            throw new Error('Error in accept');
        }
    }
    async findById(workId) {
        try {
            const workDetails = await this.model.findById(workId);
            if (!workDetails) {
                throw new Error(messages_1.WORK_MESSAGE.CANT_GET_WORK_DETAILS);
            }
            return workDetails;
        }
        catch (error) {
            console.error('Error in findById:', error);
            throw new Error('Error in findById');
        }
    }
    async setIsWorkCompleted(workId) {
        try {
            const work = await this.model.findById(workId);
            if (!work) {
                throw new Error(messages_1.WORK_MESSAGE.CANT_GET_WORK_DETAILS);
            }
            if (work.isCompleted) {
                throw new Error(messages_1.WORK_MESSAGE.WORK_ALREADY_MARK_COMPLETED);
            }
            work.isCompleted = true;
            work.status = "Completed";
            work.paymentStatus = "Pending";
            await work.save();
            return true;
        }
        catch (error) {
            console.error('Error in setIsWorkCompleted:', error);
            throw new Error('Error in setIsWorkCompleted');
        }
    }
    async getAllWorks() {
        try {
            return await this.model.find().sort({ createdAt: -1 });
        }
        catch (error) {
            console.error('Error in getAllWorks:', error);
            throw new Error('Error in getAllWorks');
        }
    }
};
exports.WorkRepository = WorkRepository;
exports.WorkRepository = WorkRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], WorkRepository);
