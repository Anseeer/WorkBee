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
exports.AvailabilityRepository = void 0;
const inversify_1 = require("inversify");
const availablity_model_1 = require("../../model/availablity/availablity.model");
const base_repo_1 = __importDefault(require("../base/base.repo"));
let AvailabilityRepository = class AvailabilityRepository extends base_repo_1.default {
    constructor() {
        super(availablity_model_1.Availability);
        this.findByWorkerId = async (workerId) => {
            try {
                return await this.model.findOne({ workerId });
            }
            catch (error) {
                console.log('Error in findByWorkerId', error);
                throw new Error('Error in findByWorkerId');
            }
        };
        this.update = async (availability) => {
            try {
                const result = await this.model.updateOne({ workerId: availability.workerId }, { $set: { availableDates: availability.availableDates } });
                return result.modifiedCount > 0;
            }
            catch (error) {
                console.error('Error in update:', error);
                throw new Error('Error in update');
            }
        };
        this.markBookedSlot = async (availability) => {
            try {
                return await availability.save();
            }
            catch (error) {
                console.error('Error in markBookedSlot:', error);
                throw new Error('Error in markBookedSlot');
            }
        };
    }
};
exports.AvailabilityRepository = AvailabilityRepository;
exports.AvailabilityRepository = AvailabilityRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], AvailabilityRepository);
