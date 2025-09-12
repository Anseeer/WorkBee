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
exports.ServiceService = void 0;
const inversify_1 = require("inversify");
const inversify_types_1 = __importDefault(require("../../inversify/inversify.types"));
const messages_1 = require("../../constants/messages");
const service_map_DTO_1 = require("../../mappers/service/service.map.DTO");
let ServiceService = class ServiceService {
    constructor(serviceRepo) {
        this.create = async (service) => {
            const existingService = await this._serviceRepository.findByName(service.name);
            if (existingService) {
                throw new Error(messages_1.SERVICE_MESSAGE.SERVICE_ALREADY_EXIST);
            }
            const serviceEntity = (0, service_map_DTO_1.mapServiceToEntity)(service);
            const newService = await this._serviceRepository.create(serviceEntity);
            const serv = (0, service_map_DTO_1.mapServiceToDTO)(newService);
            return serv;
        };
        this.getAllServices = async (currentPage, pageSize) => {
            const page = parseInt(currentPage);
            const size = parseInt(pageSize);
            const startIndex = (page - 1) * size;
            const endIndex = page * size;
            const service = await this._serviceRepository.getAllService();
            const serv = service.slice(startIndex, endIndex);
            const services = serv.map((serv) => (0, service_map_DTO_1.mapServiceToDTO)(serv));
            const totalPage = Math.ceil(service.length / size);
            return { services, totalPage };
        };
        this.setIsActive = async (serviceId) => {
            await this._serviceRepository.setIsActive(serviceId);
            return true;
        };
        this.update = async (service, serviceId) => {
            const existingCategory = await this._serviceRepository.findByName(service.name);
            if (existingCategory && existingCategory.id !== serviceId) {
                throw new Error(messages_1.SERVICE_MESSAGE.SERVICE_ALREADY_EXIST);
            }
            const serviceEntity = (0, service_map_DTO_1.mapServiceToEntity)(service);
            await this._serviceRepository.update(serviceEntity, serviceId);
            return true;
        };
        this.delete = async (serviceId) => {
            const existingService = await this._serviceRepository.findById(serviceId);
            if (!existingService) {
                throw new Error(messages_1.SERVICE_MESSAGE.SERVICE_NOT_EXIST);
            }
            await this._serviceRepository.delete(serviceId);
            return true;
        };
        this.getByCategories = async (categoryIds) => {
            const serv = await this._serviceRepository.getByCategories(categoryIds);
            const services = serv.map((serv) => (0, service_map_DTO_1.mapServiceToDTO)(serv));
            return services;
        };
        this.getByWorker = async (serviceIds) => {
            const serv = await this._serviceRepository.getByWorker(serviceIds);
            const services = serv.map((serv) => (0, service_map_DTO_1.mapServiceToDTO)(serv));
            return services;
        };
        this.getBySearch = async (searchKey) => {
            const serv = await this._serviceRepository.getBySearch(searchKey);
            const services = serv.map((serv) => (0, service_map_DTO_1.mapServiceToDTO)(serv));
            return services;
        };
        this.getById = async (id) => {
            const serv = await this._serviceRepository.findById(id);
            const services = (0, service_map_DTO_1.mapServiceToDTO)(serv);
            return services;
        };
        this._serviceRepository = serviceRepo;
    }
};
exports.ServiceService = ServiceService;
exports.ServiceService = ServiceService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_types_1.default.serviceRepository)),
    __metadata("design:paramtypes", [Object])
], ServiceService);
