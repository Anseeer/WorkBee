import { inject, injectable } from "inversify";
import TYPES from "../../inversify/inversify.types";
import { IWorkerRepository } from "../../repositories/worker/worker.repo.interface";
import { IUserRepository } from "../../repositories/user/user.repo.interface";
import { IServiceRepository } from "../../repositories/services/service.repo.interface";
import { ICategoryRepository } from "../../repositories/category/category.repo.interface";
import { IWorkService } from "./work.service.interface";
import { IWorkRepository } from "../../repositories/work/work.repo.interface";
import { IWork } from "../../model/work/work.interface";
import { CATEGORY_MESSAGE, SERVICE_MESSAGE, USERS_MESSAGE, WORK_MESSAGE, WORKER_MESSAGE } from "../../constants/messages";
import { IAvailabilityRepository } from "../../repositories/availability/availability.repo.interface";
import mongoose, { Types } from "mongoose";
import { IWorkDTO } from "../../mappers/work/work.map.DTO.interface";
import { mapWorkToDTO, mapWorkToEntity } from "../../mappers/work/work.map.DTO";
import { IChatRepositoy } from "../../repositories/chat/chat.repo.interface";
import { mapChatToEntity } from "../../mappers/chatMessage/chat.map.DTO";
import { IChat } from "../../model/chatMessage/IChat";
import { toISTDateOnly } from "../../utilities/toISTDate";
import { Role } from "../../constants/role";
import { TopThreeResult } from "../../utilities/topThreeTypes";
import { INotification } from "../../model/notification/notification.interface";
import { getIO } from "../../socket/socket";
import { mapNotificationToEntity } from "../../mappers/notification/mapNotificationToEntity";
import { INotificationRepository } from "../../repositories/notification/notification.repo.interface";
import { Server } from "socket.io";


@injectable()
export class WorkService implements IWorkService {
    private _workRepositoy: IWorkRepository;
    private _workerRepositoy: IWorkerRepository;
    private _userRepositoy: IUserRepository;
    private _serviceRepositoy: IServiceRepository;
    private _availabilityRepositoy: IAvailabilityRepository;
    private _categoryRepositoy: ICategoryRepository;
    private _chatRepositoy: IChatRepositoy;
    private _notificationRepositoy: INotificationRepository;
    constructor(
        @inject(TYPES.workRepository) workRepo: IWorkRepository,
        @inject(TYPES.workerRepository) workerRepo: IWorkerRepository,
        @inject(TYPES.userRepository) userRepo: IUserRepository,
        @inject(TYPES.serviceRepository) serviceRepo: IServiceRepository,
        @inject(TYPES.availabilityRepository) availabilityRepo: IAvailabilityRepository,
        @inject(TYPES.categoryRepository) categoryRepo: ICategoryRepository,
        @inject(TYPES.chatRepository) chatRepo: IChatRepositoy,
        @inject(TYPES.notificationRepository) notificationRepo: INotificationRepository,
    ) {
        this._workRepositoy = workRepo;
        this._workerRepositoy = workerRepo;
        this._userRepositoy = userRepo;
        this._serviceRepositoy = serviceRepo;
        this._availabilityRepositoy = availabilityRepo;
        this._categoryRepositoy = categoryRepo;
        this._chatRepositoy = chatRepo;
        this._notificationRepositoy = notificationRepo;
    }

    createWork = async (workDetails: IWork): Promise<IWorkDTO> => {
        try {
            const io = getIO();

            const { workerId, userId, serviceId, categoryId } = workDetails;
            if (!workDetails) {
                throw new Error(WORK_MESSAGE.CANT_GET_WORK_DETAILS);
            }

            const workerExist = await this._workerRepositoy.findById(workerId.toString());
            if (!workerExist || workerExist.isActive === false) {
                throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER);
            }

            const userExist = await this._userRepositoy.findById(userId.toString());
            if (!userExist || userExist.isActive === false) {
                throw new Error(USERS_MESSAGE.CANT_FIND_USER);
            }

            const servieExist = await this._serviceRepositoy.findById(serviceId.toString());
            if (!servieExist || servieExist.isActive === false) {
                throw new Error(SERVICE_MESSAGE.SERVICE_NOT_EXIST);
            }

            const categoryExist = await this._categoryRepositoy.findById(categoryId.toString());
            if (!categoryExist || categoryExist.isActive === false) {
                throw new Error(CATEGORY_MESSAGE.CATEGORY_NOT_EXIST);
            }

            const workEntity = mapWorkToEntity(workDetails);
            const newWork = await this._workRepositoy.create(workEntity);
            const work = mapWorkToDTO(newWork);

            const notification = {
                recipient: new mongoose.Types.ObjectId(workerId.toString()),
                recipientModel: "Worker",
                actor: new mongoose.Types.ObjectId(userId.toString()),
                actorModel: "User",
                type: "job_request",
                title: work.service,
                body: `A new job has been assigned to you by ${userExist.name}.
            Date: ${work.sheduleDate} at ${work.sheduleTime}
            Job description: ${work.description}`,
                read: false,
            };

            const notificationEntity = mapNotificationToEntity(notification);
            const newNotification = await this._notificationRepositoy.create(notificationEntity);
            if (!newNotification) throw new Error("Failed to create notification");
            io.to(workerId.toString()).emit("new-notification", newNotification);

            return work;

        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    };

    fetchWorkHistoryByUser = async (
        userId: string,
        currentPage: string,
        pageSize: string
    ): Promise<{ paginatedWorks: IWorkDTO[]; totalPages: number }> => {
        try {
            if (!userId) {
                throw new Error(WORK_MESSAGE.USER_ID_NOT_GET);
            }

            const page = parseInt(currentPage);
            const size = parseInt(pageSize);
            const startIndex = (page - 1) * size;
            const endIndex = page * size;

            const findWorks = await this._workRepositoy.findByUser(userId);
            const works = findWorks.map((work) => mapWorkToDTO(work));
            const paginatedWorks = works.slice(startIndex, endIndex);
            const totalPages = Math.ceil(works.length / size);

            return { paginatedWorks, totalPages };
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    };

    fetchWorkHistoryByWorker = async (
        workerId: string,
        currentPage: string,
        pageSize: string
    ): Promise<{ paginatedWorkHistory: IWorkDTO[]; totalPage: number }> => {
        try {
            if (!workerId) {
                throw new Error(WORK_MESSAGE.WORKER_ID_NOT_GET);
            }

            const page = parseInt(currentPage);
            const size = parseInt(pageSize);
            const startIndex = (page - 1) * size;
            const endIndex = page * size;

            const findWorkHistory = await this._workRepositoy.findByWorker(workerId);
            const workHistory = findWorkHistory.map((work) => mapWorkToDTO(work));
            const paginatedWorkHistory = workHistory.slice(startIndex, endIndex);
            const totalPage = Math.ceil(workHistory.length / size);

            return { paginatedWorkHistory, totalPage };
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    };

    cancel = async (workId: string, id: string): Promise<boolean> => {
        try {
            const io = getIO();

            if (!workId) throw new Error(WORK_MESSAGE.WORK_ID_NOT_GET);
            if (!id) throw new Error(WORKER_MESSAGE.WORKER_ID_MISSING_OR_INVALID);

            const worker = await this._workerRepositoy.findById(id);
            const user = await this._userRepositoy.findById(id);

            if (!worker && !user) {
                throw new Error("Can't find a worker or user with this id");
            }

            const canceller = worker ?? user;

            const work = await this._workRepositoy.findById(workId);
            if (!work) throw new Error(WORK_MESSAGE.CANT_GET_WORK_DETAILS);

            // Build notification
            const recipientIsWorker = canceller?.id.toString() !== work.workerId?.toString();

            const notification: Partial<INotification> = {
                recipient: new mongoose.Types.ObjectId(
                    recipientIsWorker ? work.workerId.toString() : work.userId.toString()
                ),
                recipientModel: recipientIsWorker ? "Worker" : "User",
                actor: new mongoose.Types.ObjectId(canceller?.id.toString()),
                actorModel: worker ? "Worker" : "User",
                type: "job_cancelled",
                title: work?.service,
                body: `The job "${work?.service}" has been cancelled by ${canceller?.name}.
      Date: ${work.sheduleDate} on ${work.sheduleTime}.
      Job description: ${work?.description}`,
                read: false,
            };

            const notificationEntity = mapNotificationToEntity(notification);
            const newNotification = await this._notificationRepositoy.create(notificationEntity);
            if (!newNotification) throw new Error("Failed to create notification");

            const recipientId = notification.recipient?.toString();
            if (recipientId) {
                io.to(recipientId).emit("new-notification", newNotification);
                console.log("✅ Emitted new-notification to:", recipientId);
            } else {
                console.log("⚠️ No recipient ID found for notification");
            }

            return await this._workRepositoy.cancel(workId);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.error("Cancel error:", errMsg);
            throw error;
        }
    };


    accept = async (workId: string): Promise<boolean> => {
        try {
            const io = getIO()

            if (!workId) throw new Error(WORK_MESSAGE.WORK_ID_NOT_GET);
            const work = await this._workRepositoy.findById(workId);
            if (!work) throw new Error(WORK_MESSAGE.WORK_NOT_EXIST);

            const workerId = work.workerId;
            const date = work.sheduleDate;
            const time = work.sheduleTime;

            if (!workerId) throw new Error(WORK_MESSAGE.WORKER_ID_NOT_GET);
            if (!date || !time) throw new Error("Work must have both date and time");

            const availability = await this._availabilityRepositoy.findByWorkerId(workerId.toString());
            if (!availability) throw new Error("Availability not found for worker");

            const targetDateStr = toISTDateOnly(new Date(date));
            const dateEntry = availability.availableDates.find(d => {
                const dbDateStr = toISTDateOnly(new Date(d.date));
                return dbDateStr === targetDateStr;
            });

            if (!dateEntry) throw new Error("No availability on this date");

            if (!Array.isArray(dateEntry.bookedSlots)) {
                dateEntry.bookedSlots = [];
            }

            const bookedSlots = dateEntry.bookedSlots as { slot: string; jobId?: mongoose.Types.ObjectId }[];

            if (bookedSlots.some(slotObj => slotObj.slot === time)) {
                throw new Error("Slot already booked");
            }

            bookedSlots.push({
                slot: time,
                jobId: work._id as mongoose.Types.ObjectId
            });

            await this._availabilityRepositoy.markBookedSlot(availability);

            const chatExisting = await this._chatRepositoy.findChat([work.userId.toString(), work.workerId.toString()]);
            if (!chatExisting || chatExisting.length < 1) {
                const chat: Partial<IChat> = {
                    participants: [
                        { participantId: new Types.ObjectId(work.userId.toString()), participantModel: Role.USER },
                        { participantId: new Types.ObjectId(work.workerId.toString()), participantModel: Role.WORKER }
                    ],
                    unreadCounts: new Map<string, number>([
                        [work.userId.toString(), 0],
                        [work.workerId.toString(), 0]
                    ])
                };
                const chatEntity = mapChatToEntity(chat);
                await this._chatRepositoy.create(chatEntity);
            }

            const notification = {
                recipient: new mongoose.Types.ObjectId(work?.userId.toString()),
                recipientModel: "User",
                actor: new mongoose.Types.ObjectId(workerId.toString()),
                actorModel: "Worker",
                type: "job_accepted",
                title: work?.service,
                body: `The job ${work?.service} has been accepted by ${work?.workerName}.
         Date: ${work.sheduleDate} on ${work.sheduleTime}.
         Job description: ${work?.description}`,
                read: false,
            };

            const notificationEntity = mapNotificationToEntity(notification);
            const newNotification = await this._notificationRepositoy.create(notificationEntity);
            if (!newNotification) throw new Error("Failed to create notification");
            io.to(work.userId.toString()).emit("new-notification", newNotification);

            return await this._workRepositoy.accept(workId);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    };

    completed = async (workId: string, workerId: string): Promise<boolean> => {
        try {
            const io = getIO()

            if (!workId) throw new Error(WORK_MESSAGE.WORK_ID_NOT_GET);
            if (!workerId) throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER);

            const worker = await this._workerRepositoy.findById(workerId);
            if (!worker) throw new Error(WORKER_MESSAGE.WORKER_NOT_EXIST);

            worker.completedWorks += 1;
            await worker.save();

            const work = await this._workRepositoy.findById(workId);
            if (!work) throw new Error(WORK_MESSAGE.CANT_GET_WORK_DETAILS);

            const notification = {
                recipient: new mongoose.Types.ObjectId(work?.userId.toString()),
                recipientModel: "User",
                actor: new mongoose.Types.ObjectId(workerId.toString()),
                actorModel: "Worker",
                type: "job_completed",
                title: work?.service,
                body: `The job ${work?.service} has been completed by ${work?.workerName}.
            Job description: ${work?.description}`,
                read: false,
            };

            const notificationEntity = mapNotificationToEntity(notification);
            const newNotification = await this._notificationRepositoy.create(notificationEntity);
            if (!newNotification) throw new Error("Failed to create notification");
            io.to(work.userId.toString()).emit("new-notification", newNotification);

            return await this._workRepositoy.setIsWorkCompleted(workId);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    };

    workDetails = async (workId: string): Promise<IWorkDTO> => {
        try {
            if (!workId) throw new Error(WORK_MESSAGE.WORK_ID_NOT_GET);

            const work = await this._workRepositoy.findById(workId as string);
            const workDetails = mapWorkToDTO(work as IWork);
            if (!workDetails) throw new Error(WORK_MESSAGE.CANT_GET_WORK_DETAILS);

            return workDetails;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    };

    getAllWorks = async (currentPage: string, pageSize: string): Promise<{ paginatedWorks: IWorkDTO[], totalPage: number }> => {
        try {
            const page = parseInt(currentPage);
            const size = parseInt(pageSize);
            const startIndex = (page - 1) * size;
            const endIndex = page * size;

            const allWorks = await this._workRepositoy.getAllWorks();
            const works = allWorks.map((work) => mapWorkToDTO(work));
            const paginatedWorks = works.slice(startIndex, endIndex);
            const totalPage = Math.ceil(works.length / size);

            return { paginatedWorks, totalPage };
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw error;
        }
    };

    getAssignedWorks = async (workerId: string): Promise<IWorkDTO[] | undefined> => {
        try {
            const response = await this._workRepositoy.getAssignedWorks(workerId);
            const res = response.map((work) => mapWorkToDTO(work));
            return res;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw new Error(errMsg);
        }
    }

    getRequestedWorks = async (workerId: string): Promise<IWorkDTO[] | undefined> => {
        try {
            const response = await this._workRepositoy.getRequestedWorks(workerId);
            const res = response.map((work) => mapWorkToDTO(work));
            return res;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw new Error(errMsg);
        }
    }

    getTopThree = async (): Promise<TopThreeResult[] | undefined> => {
        try {
            const response = await this._workRepositoy.getTopThree();
            return response;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw new Error(errMsg);
        }
    }

    findById = async (workId: string): Promise<IWorkDTO | null> => {
        try {
            const response = await this._workRepositoy.findById(workId);
            const work = await mapWorkToDTO(response as IWork);
            return work as IWorkDTO;
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw new Error(errMsg);
        }
    }

    updatePaymentStatus = async (workId: string, status: string): Promise<void> => {
        try {
            await this._workRepositoy.updatePaymentStatus(workId, status);
        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            console.log(errMsg);
            throw new Error(errMsg);
        }
    }
}
