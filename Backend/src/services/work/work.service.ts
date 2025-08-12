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

@injectable()
export class WorkService implements IWorkService {
    private _workRepositoy: IWorkRepository;
    private _workerRepositoy: IWorkerRepository;
    private _userRepositoy: IUserRepository;
    private _serviceRepositoy: IServiceRepository;
    private _categoryRepositoy: ICategoryRepository;
    constructor(
        @inject(TYPES.workRepository) workRepo: IWorkRepository,
        @inject(TYPES.workerRepository) workerRepo: IWorkerRepository,
        @inject(TYPES.userRepository) userRepo: IUserRepository,
        @inject(TYPES.serviceRepository) serviceRepo: IServiceRepository,
        @inject(TYPES.categoryRepository) categoryRepo: ICategoryRepository
    ) {
        this._workRepositoy = workRepo;
        this._workerRepositoy = workerRepo;
        this._userRepositoy = userRepo;
        this._serviceRepositoy = serviceRepo;
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
            throw new Error(USERS_MESSAGE.CAT_FIND_USER);
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
        if(!userId){
            throw new Error(WORK_MESSAGE.USER_ID_NOT_GET);
        }
        return await this._workRepositoy.findByUser(userId);
    }

}