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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityService = void 0;
const inversify_1 = require("inversify");
const inversify_types_1 = __importDefault(require("../../inversify/inversify.types"));
const messages_1 = require("../../constants/messages");
const availability_map_DTO_1 = require("../../mappers/availability/availability.map.DTO");
let AvailabilityService = class AvailabilityService {
    constructor(availabilityRepo) {
        this.getAvailabilityByworkerId = async (id) => {
            const findAvailability = await this._availabilityRepository.findByWorkerId(id);
            const availability = (0, availability_map_DTO_1.mapAvailabilityToDTO)(findAvailability);
            return availability;
        };
        this.updateAvailability = async (availability) => {
            const existingAvailability = await this._availabilityRepository.findByWorkerId(availability.workerId.toString());
            if (!existingAvailability) {
                throw new Error(messages_1.WORKER_MESSAGE.CANT_FIND_AVAILABILITY);
            }
            const updatedFields = (0, availability_map_DTO_1.mapAvailabilityToEntity)(availability);
            const updated = await this._availabilityRepository.update(updatedFields);
            if (!updated) {
                throw new Error(messages_1.AVAILABILITY_MESSAGE.UPDATE_FAILD);
            }
            return true;
        };
        this._availabilityRepository = availabilityRepo;
    }
};
exports.AvailabilityService = AvailabilityService;
exports.AvailabilityService = AvailabilityService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_types_1.default.availabilityRepository)),
    __metadata("design:paramtypes", [Object])
], AvailabilityService);
