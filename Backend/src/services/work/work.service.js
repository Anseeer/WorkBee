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
exports.WorkService = void 0;
const inversify_1 = require("inversify");
const inversify_types_1 = __importDefault(require("../../inversify/inversify.types"));
const messages_1 = require("../../constants/messages");
const mongoose_1 = require("mongoose");
const work_map_DTO_1 = require("../../mappers/work/work.map.DTO");
const chat_map_DTO_1 = require("../../mappers/chatMessage/chat.map.DTO");
const toISTDate_1 = require("../../utilities/toISTDate");
const role_1 = require("../../constants/role");
let WorkService = class WorkService {
    constructor(workRepo, workerRepo, userRepo, serviceRepo, availabilityRepo, categoryRepo, chatRepo) {
        this.createWork = async (workDetails) => {
            const { workerId, userId, serviceId, categoryId } = workDetails;
            if (!workDetails) {
                throw new Error(messages_1.WORK_MESSAGE.CANT_GET_WORK_DETAILS);
            }
            const workerExist = await this._workerRepositoy.findById(workerId.toString());
            if (!workerExist || workerExist.isActive === false) {
                throw new Error(messages_1.WORKER_MESSAGE.CANT_FIND_WORKER);
            }
            const userExist = await this._userRepositoy.findById(userId.toString());
            if (!userExist || userExist.isActive === false) {
                throw new Error(messages_1.USERS_MESSAGE.CANT_FIND_USER);
            }
            const servieExist = await this._serviceRepositoy.findById(serviceId.toString());
            if (!servieExist || servieExist.isActive === false) {
                throw new Error(messages_1.SERVICE_MESSAGE.SERVICE_NOT_EXIST);
            }
            const categoryExist = await this._categoryRepositoy.findById(categoryId.toString());
            if (!categoryExist || categoryExist.isActive === false) {
                throw new Error(messages_1.CATEGORY_MESSAGE.CATEGORY_NOT_EXIST);
            }
            const workEntity = (0, work_map_DTO_1.mapWorkToEntity)(workDetails);
            const newWork = await this._workRepositoy.create(workEntity);
            const work = (0, work_map_DTO_1.mapWorkToDTO)(newWork);
            return work;
        };
        this.fetchWorkHistoryByUser = async (userId, currentPage, pageSize) => {
            if (!userId) {
                throw new Error(messages_1.WORK_MESSAGE.USER_ID_NOT_GET);
            }
            const page = parseInt(currentPage);
            const size = parseInt(pageSize);
            const startIndex = (page - 1) * size;
            const endIndex = page * size;
            const findWorks = await this._workRepositoy.findByUser(userId);
            const works = findWorks.map((work) => (0, work_map_DTO_1.mapWorkToDTO)(work));
            const paginatedWorks = works.slice(startIndex, endIndex);
            const totalPages = Math.ceil(works.length / size);
            return { paginatedWorks, totalPages };
        };
        this.fetchWorkHistoryByWorker = async (workerId, currentPage, pageSize) => {
            if (!workerId) {
                throw new Error(messages_1.WORK_MESSAGE.WORKER_ID_NOT_GET);
            }
            const page = parseInt(currentPage);
            const size = parseInt(pageSize);
            const startIndex = (page - 1) * size;
            const endIndex = page * size;
            console.log(startIndex, endIndex);
            const findWorkHistory = await this._workRepositoy.findByWorker(workerId);
            const workHistory = findWorkHistory.map((work) => (0, work_map_DTO_1.mapWorkToDTO)(work));
            const paginatedWorkHistory = workHistory.slice(startIndex, endIndex);
            const totalPage = Math.ceil(workHistory.length / size);
            return { paginatedWorkHistory, totalPage };
        };
        this.cancel = async (workId) => {
            if (!workId) {
                throw new Error(messages_1.WORK_MESSAGE.WORK_ID_NOT_GET);
            }
            return await this._workRepositoy.cancel(workId);
        };
        this.accept = async (workId) => {
            if (!workId)
                throw new Error(messages_1.WORK_MESSAGE.WORK_ID_NOT_GET);
            const work = await this._workRepositoy.findById(workId);
            if (!work)
                throw new Error(messages_1.WORK_MESSAGE.WORK_NOT_EXIST);
            const workerId = work.workerId;
            const date = work.sheduleDate;
            const time = work.sheduleTime;
            if (!workerId)
                throw new Error(messages_1.WORK_MESSAGE.WORKER_ID_NOT_GET);
            if (!date || !time)
                throw new Error("Work must have both date and time");
            const availability = await this._availabilityRepositoy.findByWorkerId(workerId.toString());
            if (!availability)
                throw new Error("Availability not found for worker");
            const targetDateStr = (0, toISTDate_1.toISTDateOnly)(new Date(date));
            const dateEntry = availability.availableDates.find(d => {
                const dbDateStr = (0, toISTDate_1.toISTDateOnly)(new Date(d.date));
                return dbDateStr === targetDateStr;
            });
            if (!dateEntry)
                throw new Error("No availability on this date");
            if (!Array.isArray(dateEntry.bookedSlots)) {
                dateEntry.bookedSlots = [];
            }
            const bookedSlots = dateEntry.bookedSlots;
            if (bookedSlots.some(slotObj => slotObj.slot === time)) {
                throw new Error("Slot already booked");
            }
            bookedSlots.push({
                slot: time,
                jobId: work._id
            });
            await this._availabilityRepositoy.markBookedSlot(availability);
            const chatExisting = await this._chatRepositoy.findChat([work.userId.toString(), work.workerId.toString()]);
            console.log("ChatExisting :", chatExisting);
            if (!chatExisting || chatExisting.length < 1) {
                const chat = {
                    participants: [
                        { participantId: new mongoose_1.Types.ObjectId(work.userId.toString()), participantModel: role_1.Role.USER },
                        { participantId: new mongoose_1.Types.ObjectId(work.workerId.toString()), participantModel: role_1.Role.WORKER }
                    ],
                    unreadCounts: new Map([
                        [work.userId.toString(), 0],
                        [work.workerId.toString(), 0]
                    ])
                };
                const chatEntity = (0, chat_map_DTO_1.mapChatToEntity)(chat);
                await this._chatRepositoy.create(chatEntity);
            }
            return await this._workRepositoy.accept(workId);
        };
        this.completed = async (workId, workerId) => {
            if (!workId) {
                throw new Error(messages_1.WORK_MESSAGE.WORK_ID_NOT_GET);
            }
            else if (!workerId) {
                throw new Error(messages_1.WORKER_MESSAGE.CANT_FIND_WORKER);
            }
            const worker = await this._workerRepositoy.findById(workerId);
            if (!worker) {
                throw new Error(messages_1.WORKER_MESSAGE.WORKER_NOT_EXIST);
            }
            worker.completedWorks += 1;
            await worker.save();
            return await this._workRepositoy.setIsWorkCompleted(workId);
        };
        this.workDetails = async (workId) => {
            if (!workId) {
                throw new Error(messages_1.WORK_MESSAGE.WORK_ID_NOT_GET);
            }
            const work = await this._workRepositoy.findById(workId);
            const workDetails = (0, work_map_DTO_1.mapWorkToDTO)(work);
            if (!workDetails) {
                throw new Error(messages_1.WORK_MESSAGE.CANT_GET_WORK_DETAILS);
            }
            return workDetails;
        };
        this.getAllWorks = async (currentPage, pageSize) => {
            const page = parseInt(currentPage);
            const size = parseInt(pageSize);
            const startIndex = (page - 1) * size;
            const endIndex = page * size;
            const allWorks = await this._workRepositoy.getAllWorks();
            const works = allWorks.map((work) => (0, work_map_DTO_1.mapWorkToDTO)(work));
            const paginatedWorks = works.slice(startIndex, endIndex);
            const totalPage = Math.ceil(works.length / size);
            return { paginatedWorks, totalPage };
        };
        this._workRepositoy = workRepo;
        this._workerRepositoy = workerRepo;
        this._userRepositoy = userRepo;
        this._serviceRepositoy = serviceRepo;
        this._availabilityRepositoy = availabilityRepo;
        this._categoryRepositoy = categoryRepo;
        this._chatRepositoy = chatRepo;
    }
};
exports.WorkService = WorkService;
exports.WorkService = WorkService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(inversify_types_1.default.workRepository)),
    __param(1, (0, inversify_1.inject)(inversify_types_1.default.workerRepository)),
    __param(2, (0, inversify_1.inject)(inversify_types_1.default.userRepository)),
    __param(3, (0, inversify_1.inject)(inversify_types_1.default.serviceRepository)),
    __param(4, (0, inversify_1.inject)(inversify_types_1.default.availabilityRepository)),
    __param(5, (0, inversify_1.inject)(inversify_types_1.default.categoryRepository)),
    __param(6, (0, inversify_1.inject)(inversify_types_1.default.chatRepository)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object])
], WorkService);
