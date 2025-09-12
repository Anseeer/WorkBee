"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.WorkerService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../../utilities/generateToken");
const worker_map_DTO_1 = __importStar(require("../../mappers/worker/worker.map.DTO"));
const generateOtp_1 = require("../../utilities/generateOtp");
const emailService_1 = require("../../utilities/emailService");
const otpStore_1 = require("../../utilities/otpStore");
const inversify_1 = require("inversify");
const inversify_types_1 = __importDefault(require("../../inversify/inversify.types"));
const messages_1 = require("../../constants/messages");
const google_auth_library_1 = require("google-auth-library");
const map_wallet_DTO_1 = require("../../mappers/wallet/map.wallet.DTO");
const availability_map_DTO_1 = require("../../mappers/availability/availability.map.DTO");
const mongoose_1 = require("mongoose");
const client = new google_auth_library_1.OAuth2Client();
let WorkerService = class WorkerService {
    constructor(workerRepo, availibilityRepo, walletRepo) {
        this._workerRepository = workerRepo;
        this._availabilityRepository = availibilityRepo;
        this._walletRepository = walletRepo;
    }
    async loginWorker(credentials) {
        const existingWorker = await this._workerRepository.findByEmail(credentials.email);
        if (!existingWorker || existingWorker.role !== "Worker") {
            throw new Error(messages_1.WORKER_MESSAGE.CANT_FIND_WORKER);
        }
        if (existingWorker.isActive == false) {
            throw new Error(messages_1.WORKER_MESSAGE.WORKER_BLOCKED);
        }
        let existingAvailability;
        let availability = null;
        if (existingWorker.isAccountBuilt) {
            existingAvailability = await this._availabilityRepository.findByWorkerId(existingWorker.id);
            if (!existingAvailability) {
                throw new Error(messages_1.WORKER_MESSAGE.CANT_FIND_AVAILABILITY);
            }
            availability = (0, availability_map_DTO_1.mapAvailabilityToDTO)(existingAvailability);
        }
        const matchPass = await bcrypt_1.default.compare(credentials.password, existingWorker.password);
        if (!matchPass) {
            throw new Error(messages_1.WORKER_MESSAGE.INVALID_PASS);
        }
        const accessToken = (0, generateToken_1.generate_Access_Token)(existingWorker.id.toString(), existingWorker.role);
        const refreshToken = (0, generateToken_1.generate_Refresh_Token)(existingWorker.id.toString(), existingWorker.role);
        const walletData = await this._walletRepository.findByUser(existingWorker.id);
        const wallet = (0, map_wallet_DTO_1.mapWalletToDTO)(walletData);
        const worker = (0, worker_map_DTO_1.default)(existingWorker);
        return {
            accessToken,
            refreshToken,
            worker,
            wallet,
            availability: availability ?? undefined
        };
    }
    async registerWorker(workerData) {
        if (!workerData.name || !workerData.email || !workerData.password || !workerData.phone || !workerData.categories || !workerData.location) {
            throw new Error(messages_1.WORKER_MESSAGE.ALL_FIELDS_ARE_REQUIRED);
        }
        const existingWorker = await this._workerRepository.findByEmail(workerData.email);
        if (existingWorker) {
            throw new Error(messages_1.WORKER_MESSAGE.WORKER_ALREADY_EXIST);
        }
        const hashedPass = await bcrypt_1.default.hash(workerData.password, 10);
        workerData.password = hashedPass;
        const workerEntity = await (0, worker_map_DTO_1.mapWorkerToEntity)(workerData);
        const newWorker = await this._workerRepository.create(workerEntity);
        const worker = (0, worker_map_DTO_1.default)(newWorker);
        const initializeWallet = {
            userId: new mongoose_1.Types.ObjectId(newWorker?._id?.toString()),
            balance: 0,
            currency: "INR",
            transactions: []
        };
        const walletEntity = (0, map_wallet_DTO_1.mapWalletToEntity)(initializeWallet);
        await this._walletRepository.create(walletEntity);
        const newWallet = await this._walletRepository.findByUser(newWorker.id);
        const wallet = (0, map_wallet_DTO_1.mapWalletToDTO)(newWallet);
        const accessToken = (0, generateToken_1.generate_Access_Token)(newWorker.id.toString(), newWorker.role);
        const refreshToken = (0, generateToken_1.generate_Refresh_Token)(newWorker.id.toString(), newWorker.role);
        return { accessToken, refreshToken, worker, wallet };
    }
    async buildAccount(workerId, availability, workerData) {
        const existingWorker = await this._workerRepository.findById(workerId);
        if (!existingWorker)
            throw new Error(messages_1.WORKER_MESSAGE.CANT_FIND_WORKER);
        const updatedFields = {
            profileImage: workerData.profileImage,
            bio: workerData.bio,
            age: workerData.age,
            services: workerData.services,
            workType: workerData.workType,
            radius: workerData.radius,
            preferredSchedule: workerData.preferredSchedule,
            govId: workerData.govId,
            isAccountBuilt: true
        };
        const updatedWorkerEntity = await this._workerRepository.findByIdAndUpdate(workerId, updatedFields);
        if (!updatedWorkerEntity)
            throw new Error(messages_1.WORKER_MESSAGE.UPDATE_WORKER_SUCCESSFULLY);
        let updatedAvailability = null;
        const existingAvailability = await this._workerRepository.findAvailabilityByWorkerId(workerId);
        if (existingAvailability) {
            const updatedFields = (0, availability_map_DTO_1.mapAvailabilityToEntity)(availability);
            const updatedValue = await this._workerRepository.updateAvailability(workerId, updatedFields);
            if (!updatedValue)
                throw new Error(messages_1.WORKER_MESSAGE.FAILDTO_UPDATE_AVAILABILITY);
            updatedAvailability = (0, availability_map_DTO_1.mapAvailabilityToDTO)(updatedValue);
        }
        else {
            const createdValue = await this._workerRepository.setAvailability(availability);
            if (!createdValue)
                throw new Error(messages_1.WORKER_MESSAGE.FAILDTO_CREATE_AVAILABILITY);
            updatedAvailability = (0, availability_map_DTO_1.mapAvailabilityToDTO)(createdValue);
        }
        const updatedWorker = (0, worker_map_DTO_1.default)(updatedWorkerEntity);
        return { updatedWorker, updatedAvailability };
    }
    async forgotPass(email) {
        const otp = (0, generateOtp_1.generateOTP)();
        await (0, emailService_1.emailService)(email, otp);
        (0, otpStore_1.saveOtp)(email, otp);
        return otp;
    }
    async resendOtp(email) {
        (0, otpStore_1.deleteOtp)(email);
        return this.forgotPass(email);
    }
    async getUserById(id) {
        const findUser = await this._workerRepository.findById(id);
        if (!findUser) {
            throw new Error(messages_1.WORKER_MESSAGE.CANT_FIND_WORKER);
        }
        const user = (0, worker_map_DTO_1.default)(findUser);
        return user;
    }
    async getUserByEmail(email) {
        const findUser = await this._workerRepository.findByEmail(email);
        if (!findUser) {
            throw new Error(messages_1.WORKER_MESSAGE.CANT_FIND_WORKER);
        }
        const user = (0, worker_map_DTO_1.default)(findUser);
        return user;
    }
    async verifyOtp(email, otp) {
        const record = (0, otpStore_1.getOtp)(email);
        if (!record)
            throw new Error(messages_1.WORKER_MESSAGE.NO_OTP_FOUND);
        if (Date.now() > record.expiresAt) {
            (0, otpStore_1.deleteOtp)(email);
            throw new Error(messages_1.WORKER_MESSAGE.OTP_EXPIRED);
        }
        if (record.otp !== otp.toString()) {
            throw new Error(messages_1.WORKER_MESSAGE.INVALID_OTP);
        }
        (0, otpStore_1.deleteOtp)(email);
        return true;
    }
    async resetPass(email, password) {
        const hashedPass = await bcrypt_1.default.hash(password, 10);
        await this._workerRepository.resetPassword(email, hashedPass);
    }
    async updateWorker(workerData) {
        if (!workerData || !workerData._id) {
            throw new Error(messages_1.WORKER_MESSAGE.WORKER_DATA_OR_ID_NOT_GET);
        }
        const workerEntity = await (0, worker_map_DTO_1.mapWorkerToEntity)(workerData);
        await this._workerRepository.update(workerEntity);
        return true;
    }
    async searchWorker(serachTerm) {
        if (!serachTerm) {
            throw new Error("Search term not get");
        }
        if (!serachTerm.location?.lat || !serachTerm.location.lng || !serachTerm.workType || !serachTerm.serviceId || !serachTerm.categoryId) {
            throw new Error("All terms are required for search ");
        }
        const filteredWorkers = await this._workerRepository.search(serachTerm);
        const workers = filteredWorkers.map(worker_map_DTO_1.default);
        return workers;
    }
    async findWorkersByIds(workerIds) {
        if (!workerIds || workerIds.length === 0) {
            throw new Error(messages_1.WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID);
        }
        const workers = await this._workerRepository.findWorkersByIds(workerIds);
        return workers.map((worker) => (0, worker_map_DTO_1.default)(worker));
    }
    async googleLogin(credential) {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log("Worker Payload :", payload);
        if (!payload?.email)
            throw new Error(messages_1.WORKER_MESSAGE.GOOGLE_LOGIN_FAILED);
        const existingWorker = await this._workerRepository.findByEmail(payload.email);
        if (!existingWorker || existingWorker.role !== "Worker") {
            throw new Error(messages_1.WORKER_MESSAGE.CANT_FIND_WORKER);
        }
        if (existingWorker.isActive === false) {
            throw new Error(messages_1.WORKER_MESSAGE.WORKER_BLOCKED);
        }
        let existingAvailability;
        let existingvalue;
        if (existingWorker.isAccountBuilt) {
            existingvalue = await this._availabilityRepository.findByWorkerId(existingWorker.id);
            existingAvailability = (0, availability_map_DTO_1.mapAvailabilityToDTO)(existingvalue);
            if (!existingAvailability) {
                throw new Error(messages_1.WORKER_MESSAGE.CANT_FIND_AVAILABILITY);
            }
        }
        const accessToken = (0, generateToken_1.generate_Access_Token)(existingWorker.id.toString(), existingWorker.role);
        const refreshToken = (0, generateToken_1.generate_Refresh_Token)(existingWorker.id.toString(), existingWorker.role);
        const findWallet = await this._walletRepository.findByUser(existingWorker.id);
        const wallet = (0, map_wallet_DTO_1.mapWalletToDTO)(findWallet);
        const worker = (0, worker_map_DTO_1.default)(existingWorker);
        return {
            accessToken,
            refreshToken,
            worker,
            wallet,
            availability: existingAvailability ?? undefined,
        };
    }
    async findWallet(workerId) {
        const wallet = await this._walletRepository.findByUser(workerId);
        return await (0, map_wallet_DTO_1.mapWalletToDTO)(wallet);
    }
};
exports.WorkerService = WorkerService;
exports.WorkerService = WorkerService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_types_1.default.workerRepository)),
    __param(1, (0, inversify_1.inject)(inversify_types_1.default.availabilityRepository)),
    __param(2, (0, inversify_1.inject)(inversify_types_1.default.walletRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], WorkerService);
