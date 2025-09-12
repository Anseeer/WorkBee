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
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../../utilities/generateToken");
const user_map_DTO_1 = require("../../mappers/user/user.map.DTO");
const generateOtp_1 = require("../../utilities/generateOtp");
const emailService_1 = require("../../utilities/emailService");
const otpStore_1 = require("../../utilities/otpStore");
const inversify_1 = require("inversify");
const inversify_types_1 = __importDefault(require("../../inversify/inversify.types"));
const google_auth_library_1 = require("google-auth-library");
const messages_1 = require("../../constants/messages");
const availability_map_DTO_1 = require("../../mappers/availability/availability.map.DTO");
const map_wallet_DTO_1 = require("../../mappers/wallet/map.wallet.DTO");
const mongoose_1 = require("mongoose");
const role_1 = require("../../constants/role");
const client = new google_auth_library_1.OAuth2Client();
let UserService = class UserService {
    constructor(userRepo, availabilityRepo, walletRepo) {
        this._userRepository = userRepo;
        this._availabilityRepository = availabilityRepo;
        this._walletRepository = walletRepo;
    }
    async registerUser(userData) {
        if (!userData.email || !userData.password || !userData.name || !userData.location || !userData.phone) {
            throw new Error(messages_1.USERS_MESSAGE.ALL_FIELDS_REQUIRED_FOR_REGISTRATION);
        }
        const userExist = await this._userRepository.findByEmail(userData.email);
        if (userExist) {
            throw new Error(messages_1.USERS_MESSAGE.USER_ALREADY_EXISTS_WITH_EMAIL);
        }
        const hashedPass = await bcrypt_1.default.hash(userData.password, 10);
        userData.password = hashedPass;
        const userEntity = await (0, user_map_DTO_1.mapToUserEntity)(userData);
        const newUser = await this._userRepository.create(userEntity);
        const initializeWallet = {
            userId: new mongoose_1.Types.ObjectId(newUser?._id),
            balance: 0,
            currency: "INR",
            transactions: []
        };
        const walletEntity = (0, map_wallet_DTO_1.mapWalletToEntity)(initializeWallet);
        await this._walletRepository.create(walletEntity);
        const walletData = await this._walletRepository.findByUser(newUser.id);
        const accessToken = (0, generateToken_1.generate_Access_Token)(newUser._id.toString(), newUser.role);
        const refreshToken = (0, generateToken_1.generate_Refresh_Token)(newUser._id.toString(), newUser.role);
        const user = (0, user_map_DTO_1.mapUserToDTO)(newUser);
        const wallet = (0, map_wallet_DTO_1.mapWalletToDTO)(walletData);
        return { user, accessToken, refreshToken, wallet };
    }
    async loginUser(email, password) {
        let findUser = await this._userRepository.findByEmail(email);
        if (!findUser || findUser.role !== role_1.Role.USER) {
            throw new Error(messages_1.USERS_MESSAGE.CANT_FIND_USER);
        }
        const isMatch = await bcrypt_1.default.compare(password, findUser.password);
        if (!isMatch) {
            throw new Error(messages_1.USERS_MESSAGE.INVALID_CREDENTIALS);
        }
        if (findUser.isActive == false) {
            throw new Error(messages_1.USERS_MESSAGE.USER_BLOCKED);
        }
        const walletData = await this._walletRepository.findByUser(findUser.id);
        const accessToken = (0, generateToken_1.generate_Access_Token)(findUser._id.toString(), findUser.role);
        const refreshToken = (0, generateToken_1.generate_Refresh_Token)(findUser._id.toString(), findUser.role);
        const user = (0, user_map_DTO_1.mapUserToDTO)(findUser);
        const wallet = (0, map_wallet_DTO_1.mapWalletToDTO)(walletData);
        return { user, accessToken, refreshToken, wallet };
    }
    async forgotPass(email) {
        const otp = await (0, generateOtp_1.generateOTP)();
        await (0, emailService_1.emailService)(email, otp);
        (0, otpStore_1.saveOtp)(email, otp);
        return otp;
    }
    async resendOtp(email) {
        (0, otpStore_1.deleteOtp)(email);
        return this.forgotPass(email);
    }
    async getUserById(id) {
        const userData = await this._userRepository.findById(id);
        const user = (0, user_map_DTO_1.mapUserToDTO)(userData);
        return user;
    }
    async getUserByEmail(email) {
        const userData = await this._userRepository.findByEmail(email);
        const user = (0, user_map_DTO_1.mapUserToDTO)(userData);
        return user;
    }
    async verifyOtp(email, otp) {
        const record = await (0, otpStore_1.getOtp)(email);
        if (!record)
            throw new Error(messages_1.USERS_MESSAGE.NO_OTP_FOUND_FOR_THIS_EMAIL);
        if (Date.now() > record.expiresAt) {
            (0, otpStore_1.deleteOtp)(email);
            throw new Error(messages_1.USERS_MESSAGE.OTP_EXPIRED);
        }
        if (record.otp !== otp.toString()) {
            throw new Error(messages_1.USERS_MESSAGE.INVALID_OTP);
        }
        (0, otpStore_1.deleteOtp)(email);
        return true;
    }
    async resetPass(email, password) {
        const hashedPass = await bcrypt_1.default.hash(password, 10);
        await this._userRepository.resetPassword(email, hashedPass);
    }
    async googleLogin(credential) {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload?.email)
            throw new Error(messages_1.USERS_MESSAGE.GOOGLE_LOGIN_FAILED);
        const existingUser = await this._userRepository.findByEmail(payload.email);
        if (!existingUser || existingUser.role !== role_1.Role.USER) {
            throw new Error(messages_1.USERS_MESSAGE.CANT_FIND_USER);
        }
        if (existingUser.isActive === false) {
            throw new Error(messages_1.USERS_MESSAGE.USER_BLOCKED);
        }
        const walletData = await this._walletRepository.findByUser(existingUser.id);
        const jwtAccessToken = (0, generateToken_1.generate_Access_Token)(existingUser._id.toString(), existingUser.role);
        const jwtRefreshToken = (0, generateToken_1.generate_Refresh_Token)(existingUser._id.toString(), existingUser.role);
        const userDTO = (0, user_map_DTO_1.mapUserToDTO)(existingUser);
        const walletDTO = (0, map_wallet_DTO_1.mapWalletToDTO)(walletData);
        return {
            accessToken: jwtAccessToken,
            refreshToken: jwtRefreshToken,
            user: userDTO,
            wallet: walletDTO
        };
    }
    async fetchAvailability(id) {
        const availabilityData = await this._availabilityRepository.findByWorkerId(id);
        const availability = (0, availability_map_DTO_1.mapAvailabilityToDTO)(availabilityData);
        return availability;
    }
    async fetchData(userId) {
        const userData = await this._userRepository.fetchData(userId);
        const walletData = await this._walletRepository.findByUser(userId);
        const wallet = (0, map_wallet_DTO_1.mapWalletToDTO)(walletData);
        const user = (0, user_map_DTO_1.mapUserToDTO)(userData);
        return { user, wallet };
    }
    async update(userDetails, userId) {
        const userData = (0, user_map_DTO_1.mapToUserEntity)(userDetails);
        return await this._userRepository.update(userData, userId);
    }
    async findUsersByIds(userIds) {
        if (!userIds) {
            throw new Error(messages_1.USERS_MESSAGE.USER_ID_NOT_GET);
        }
        const users = await this._userRepository.findUsersByIds(userIds);
        return users.map((user) => (0, user_map_DTO_1.mapUserToDTO)(user));
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_types_1.default.userRepository)),
    __param(1, (0, inversify_1.inject)(inversify_types_1.default.availabilityRepository)),
    __param(2, (0, inversify_1.inject)(inversify_types_1.default.walletRepository)),
    __metadata("design:paramtypes", [Object, Object, Object])
], UserService);
