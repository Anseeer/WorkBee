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
import mongoose from "mongoose";

@injectable()
export class WorkService implements IWorkService {
    private _workRepositoy: IWorkRepository;
    private _workerRepositoy: IWorkerRepository;
    private _userRepositoy: IUserRepository;
    private _serviceRepositoy: IServiceRepository;
    private _availabilityRepositoy: IAvailabilityRepository;
    private _categoryRepositoy: ICategoryRepository;
    constructor(
        @inject(TYPES.workRepository) workRepo: IWorkRepository,
        @inject(TYPES.workerRepository) workerRepo: IWorkerRepository,
        @inject(TYPES.userRepository) userRepo: IUserRepository,
        @inject(TYPES.serviceRepository) serviceRepo: IServiceRepository,
        @inject(TYPES.availabilityRepository) availabilityRepo: IAvailabilityRepository,
        @inject(TYPES.categoryRepository) categoryRepo: ICategoryRepository
    ) {
        this._workRepositoy = workRepo;
        this._workerRepositoy = workerRepo;
        this._userRepositoy = userRepo;
        this._serviceRepositoy = serviceRepo;
        this._availabilityRepositoy = availabilityRepo;
        this._categoryRepositoy = categoryRepo;
    }

    createWork = async (workDetails: IWork): Promise<IWork> => {
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

        return await this._workRepositoy.create(workDetails);

    }

    fetchWorkHistoryByUser = async (userId: string): Promise<IWork[]> => {
        if (!userId) {
            throw new Error(WORK_MESSAGE.USER_ID_NOT_GET);
        }
        return await this._workRepositoy.findByUser(userId);
    }

    fetchWorkHistoryByWorker = async (workerId: string): Promise<IWork[]> => {
        if (!workerId) {
            throw new Error(WORK_MESSAGE.WORKER_ID_NOT_GET);
        }
        return await this._workRepositoy.findByWorker(workerId);
    }

    cancel = async (workId: string): Promise<boolean> => {
        if (!workId) {
            throw new Error(WORK_MESSAGE.WORK_ID_NOT_GET)
        }
        return await this._workRepositoy.cancel(workId);
    }

    accept = async (workId: string): Promise<boolean> => {
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

        const targetDate = new Date(date);
        targetDate.setUTCHours(0, 0, 0, 0);

        const dateEntry = availability.availableDates.find(d => {
            const dbDate = new Date(d.date);
            dbDate.setUTCHours(0, 0, 0, 0);
            return dbDate.getTime() === targetDate.getTime();
        });

        if (!dateEntry) throw new Error("No availability on this date");

        // ✅ Ensure bookedSlots array exists
        if (!Array.isArray(dateEntry.bookedSlots)) {
            dateEntry.bookedSlots = [];
        }

        const bookedSlots = dateEntry.bookedSlots as { slot: string; jobId?: mongoose.Types.ObjectId }[];

        // Check if slot already booked
        if (bookedSlots.some(slotObj => slotObj.slot === time)) {
            throw new Error("Slot already booked");
        }

        // Push new slot
        bookedSlots.push({
            slot: time,
            jobId: work._id as mongoose.Types.ObjectId
        });

        await availability.save();

        return await this._workRepositoy.accept(workId);
    };




    completed = async (workId: string, workerId: string): Promise<boolean> => {
        if (!workId) {
            throw new Error(WORK_MESSAGE.WORK_ID_NOT_GET);
        } else if (!workerId) {
            throw new Error(WORKER_MESSAGE.CANT_FIND_WORKER);
        }

        const worker = await this._workerRepositoy.findById(workerId);
        if (!worker) {
            throw new Error(WORKER_MESSAGE.WORKER_NOT_EXIST);
        }

        worker.completedWorks += 1;
        await worker.save();

        return await this._workRepositoy.setIsWorkCompleted(workId);
    };


    workDetails = async (workId: string): Promise<IWork> => {
        if (!workId) {
            throw new Error(WORK_MESSAGE.WORK_ID_NOT_GET);
        }

        const workDetails = await this._workRepositoy.findById(workId as string);
        if (!workDetails) {
            throw new Error(WORK_MESSAGE.CANT_GET_WORK_DETAILS)
        }
        return workDetails;
    }

    getAllWorks = async (): Promise<IWork[]> => {
        return await this._workRepositoy.getAllWorks();
    }

}