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
exports.CategoryService = void 0;
const inversify_1 = require("inversify");
const inversify_types_1 = __importDefault(require("../../inversify/inversify.types"));
const messages_1 = require("../../constants/messages");
const category_map_DTO_1 = require("../../mappers/category/category.map.DTO");
let CategoryService = class CategoryService {
    constructor(categoryRepo) {
        this.getAll = async (currentPage, pageSize) => {
            const page = parseInt(currentPage);
            const size = parseInt(pageSize);
            const startIndex = (page - 1) * size;
            const endIndex = page * size;
            const categories = await this._categoryRepository.getAll();
            const findCategory = categories.slice(startIndex, endIndex);
            if (!findCategory) {
                throw new Error(messages_1.CATEGORY_MESSAGE.GET_ALL_CATEGORIES_FAILED);
            }
            const category = findCategory.map((cat) => (0, category_map_DTO_1.mapCategoryToDTO)(cat));
            const totalPage = Math.ceil(categories.length / size);
            return { category, totalPage };
        };
        this.createCategory = async (category) => {
            const existingCategory = await this._categoryRepository.findByName(category.name);
            if (existingCategory) {
                throw new Error(messages_1.CATEGORY_MESSAGE.CATEGORY_ALREADY_EXISTS);
            }
            const categoryEntity = (0, category_map_DTO_1.mapCategoryToEntity)(category);
            const newCategory = await this._categoryRepository.create(categoryEntity);
            const cat = (0, category_map_DTO_1.mapCategoryToDTO)(newCategory);
            return cat;
        };
        this.update = async (category, categoryId) => {
            const existingCategory = await this._categoryRepository.findByName(category.name);
            if (existingCategory && existingCategory.id !== categoryId) {
                throw new Error(messages_1.CATEGORY_MESSAGE.CATEGORY_ALREADY_EXISTS);
            }
            const categoryEntity = (0, category_map_DTO_1.mapCategoryToEntity)(category);
            await this._categoryRepository.update(categoryEntity, categoryId);
            return true;
        };
        this.setIsActive = async (categoryId) => {
            await this._categoryRepository.setIsActive(categoryId);
            return true;
        };
        this.delete = async (categoryId) => {
            const existingCategory = await this._categoryRepository.findById(categoryId);
            if (!existingCategory) {
                throw new Error(messages_1.CATEGORY_MESSAGE.CATEGORY_NOT_EXIST);
            }
            await this._categoryRepository.delete(categoryId);
            return true;
        };
        this.getByWorker = async (categoryIds) => {
            const cat = await this._categoryRepository.getByWorker(categoryIds);
            const category = cat.map((cat) => (0, category_map_DTO_1.mapCategoryToDTO)(cat));
            return category;
        };
        this.getById = async (categoryId) => {
            const cat = await this._categoryRepository.findById(categoryId);
            const category = (0, category_map_DTO_1.mapCategoryToDTO)(cat);
            return category;
        };
        this._categoryRepository = categoryRepo;
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_types_1.default.categoryRepository)),
    __metadata("design:paramtypes", [Object])
], CategoryService);
