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
exports.AdminService = void 0;
const generateToken_1 = require("../../utilities/generateToken");
const bcrypt_1 = __importDefault(require("bcrypt"));
const inversify_1 = require("inversify");
const inversify_types_1 = __importDefault(require("../../inversify/inversify.types"));
const user_map_DTO_1 = require("../../mappers/user/user.map.DTO");
const worker_map_DTO_1 = __importDefault(require("../../mappers/worker/worker.map.DTO"));
const messages_1 = require("../../constants/messages");
const availability_map_DTO_1 = require("../../mappers/availability/availability.map.DTO");
const role_1 = require("../../constants/role");
let AdminService = class AdminService {
    constructor(userRepo, workerRepo, availabilityRepo) {
        this._userRepository = userRepo;
        this._workerRepository = workerRepo;
        this._availabilityRepository = availabilityRepo;
    }
    async login(adminData) {
        const existingAdmin = await this._userRepository.findByEmail(adminData.email);
        if (!existingAdmin) {
            throw new Error(messages_1.ADMIN_MESSAGES.CANT_FIND_ADMIN);
        }
        if (existingAdmin.role !== role_1.Role.ADMIN) {
            throw new Error(messages_1.ADMIN_MESSAGES.CANT_FIND_ADMIN);
        }
        const matchPass = await bcrypt_1.default.compare(adminData.password, existingAdmin.password);
        if (!matchPass) {
            throw new Error(messages_1.ADMIN_MESSAGES.INVALID_PASSWORD);
        }
        const accessToken = (0, generateToken_1.generate_Access_Token)(existingAdmin._id.toString(), existingAdmin.role);
        const refreshToken = (0, generateToken_1.generate_Refresh_Token)(existingAdmin._id.toString(), existingAdmin.role);
        const admin = (0, user_map_DTO_1.mapUserToDTO)(existingAdmin);
        return { accessToken, refreshToken, admin };
    }
    async fetchUsers(currentPage, pageSize) {
        const page = parseInt(currentPage);
        const size = parseInt(pageSize);
        const startIndex = (page - 1) * size;
        const endIndex = page * size;
        const allUsers = await this._userRepository.getAllUsers();
        const user = allUsers?.slice(startIndex, endIndex);
        const users = user?.map((item) => (0, user_map_DTO_1.mapUserToDTO)(item));
        const totalPage = Math.ceil(allUsers?.length / size);
        return { users, totalPage };
    }
    async setIsActiveUsers(id) {
        if (!id) {
            throw new Error(messages_1.ADMIN_MESSAGES.ID_NOT_RECEIVED);
        }
        return await this._userRepository.setIsActive(id);
    }
    async setIsActiveWorkers(id) {
        if (!id) {
            throw new Error(messages_1.ADMIN_MESSAGES.ID_NOT_RECEIVED);
        }
        return await this._workerRepository.setIsActive(id);
    }
    async fetchWorkers(currentPage, pageSize) {
        const page = parseInt(currentPage);
        const size = parseInt(pageSize);
        const startIndex = (page - 1) * size;
        const endIndex = page * size;
        const allWorkers = await this._workerRepository.getAllWorkers();
        const worker = allWorkers.slice(startIndex, endIndex);
        const workers = worker.map((item) => (0, worker_map_DTO_1.default)(item));
        const totalPage = Math.ceil(allWorkers.length / size);
        return { workers, totalPage };
    }
    async fetchWorkersNonVerified() {
        const allWorkers = await this._workerRepository.getAllNonVerifiedWorkers();
        const workers = allWorkers.map((item) => (0, worker_map_DTO_1.default)(item));
        return workers;
    }
    async fetchAvailability(id) {
        const findAvailability = await this._availabilityRepository.findByWorkerId(id);
        const availability = (0, availability_map_DTO_1.mapAvailabilityToDTO)(findAvailability);
        return availability;
    }
    async approveWorker(id) {
        await this._workerRepository.approveWorker(id);
    }
    async rejectedWorker(id) {
        await this._workerRepository.rejectedWorker(id);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_types_1.default.userRepository)),
    __param(1, (0, inversify_1.inject)(inversify_types_1.default.workerRepository)),
    __param(2, (0, inversify_1.inject)(inversify_types_1.default.availabilityRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], AdminService);
