import "reflect-metadata";
import { Container } from "inversify";
import TYPES from "./inversify.types";

// Classes
import { UserRepository } from "../repositories/user/user.repo";
import { UserService } from "../services/user/user.service";
import { UserController } from "../controllers/user/user.controller";
import { AdminController } from "../controllers/admin/admin.controller";
import { AdminService } from "../services/admin/admin.service";
import { WorkerRepository } from "../repositories/worker/worker.repo";
import { WorkerController } from "../controllers/worker/worker.controller";
import { WorkerService } from "../services/worker/worker.service";
import { CategoryController } from "../controllers/category/category.controller";
import { CategoryRepository } from "../repositories/category/category.repo";
import { CategoryService } from "../services/category/category.service";
import { AvailabilityRepository } from "../repositories/availability/availability.repo";
import { AvailabilityService } from "../services/availability/availability.service";


// Interfaces
import { IUserRepository } from "../repositories/user/user.repo.interface";
import { IUserService } from "../services/user/user.service.interface";
import { IUserController } from "../controllers/user/user.controller.interface";
import { IAdminController } from "../controllers/admin/admin.controller.interface";
import { IAdminService } from "../services/admin/admin.services.interface";
import { IWorkerService } from "../services/worker/worker.service.interface";
import { IWorkerRepository } from "../repositories/worker/worker.repo.interface";
import { IWorkerController } from "../controllers/worker/worker.controller.interface";
import { ICategoryController } from "../controllers/category/category.controller.interface";
import { ICategoryRepository } from "../repositories/category/category.repo.interface";
import { ICategoryService } from "../services/category/category.service.interface";
import { IAvailabilityService } from "../services/availability/availability.service.interface";
import { IAvailabilityRepository } from "../repositories/availability/availability.repo.interface";
import { IServiceRepository } from "../repositories/services/service.repo.interface";
import { ServiceRepository } from "../repositories/services/service.repo";
import { ServiceService } from "../services/service/service.service";
import { IServiceService } from "../services/service/service.service.interface";
import { IServiceController } from "../controllers/services/services.controller.interface";
import { ServiceController } from "../controllers/services/services.controller";

const container = new Container();

container.bind<IUserRepository>(TYPES.userRepository).to(UserRepository);
container.bind<IUserService>(TYPES.userService).to(UserService);
container.bind<IUserController>(TYPES.userController).to(UserController);

container.bind<IAdminService>(TYPES.adminService).to(AdminService);
container.bind<IAdminController>(TYPES.adminController).to(AdminController);

container.bind<IWorkerRepository>(TYPES.workerRepository).to(WorkerRepository);
container.bind<IWorkerService>(TYPES.workerService).to(WorkerService);
container.bind<IWorkerController>(TYPES.workerController).to(WorkerController);

container.bind<ICategoryRepository>(TYPES.categoryRepository).to(CategoryRepository);
container.bind<ICategoryService>(TYPES.categoryService).to(CategoryService);
container.bind<ICategoryController>(TYPES.categoryController).to(CategoryController);

container.bind<IServiceRepository>(TYPES.serviceRepository).to(ServiceRepository);
container.bind<IServiceService>(TYPES.serviceService).to(ServiceService);
container.bind<IServiceController>(TYPES.serviceController).to(ServiceController);

container.bind<IAvailabilityRepository>(TYPES.availabilityRepository).to(AvailabilityRepository);
container.bind<IAvailabilityService>(TYPES.availabilityService).to(AvailabilityService);


export default container;
