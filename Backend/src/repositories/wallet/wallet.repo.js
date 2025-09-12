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
exports.WalletRepository = void 0;
const inversify_1 = require("inversify");
const base_repo_1 = __importDefault(require("../base/base.repo"));
const wallet_model_1 = require("../../model/wallet/wallet.model");
const mongoose_1 = require("mongoose");
let WalletRepository = class WalletRepository extends base_repo_1.default {
    constructor() {
        super(wallet_model_1.Wallet);
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
            console.log("WorkerID :", userId);
            if (!(0, mongoose_1.isValidObjectId)(userId)) {
                throw new Error('Invalid Wallet ID provided.');
            }
            const wallet = await this.model.findOne({ userId }).lean();
            if (wallet) {
                wallet.transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            }
            return wallet;
        }
        catch (error) {
            console.error('Error in findByUser:', error);
            throw new Error('Error in findByUser');
        }
    }
};
exports.WalletRepository = WalletRepository;
exports.WalletRepository = WalletRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], WalletRepository);
