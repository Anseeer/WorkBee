import TYPES from "./inversify.types";
import { Container } from "inversify";


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
import { WalletRepository } from "../repositories/wallet/wallet.repo";
import { WalletService } from "../services/wallet/wallet.service";
import { ChatRepository } from "../repositories/chat/chat.repo";
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
import { IWalletRepository } from "../repositories/wallet/wallet.repo.interface";
import { IWalletService } from "../services/wallet/wallet.service.interface";
import { IWorkController } from "../controllers/work/work.controller.interface";
import { IWorkService } from "../services/work/work.service.interface";
import { IWorkRepository } from "../repositories/work/work.repo.interface";
import { WorkRepository } from "../repositories/work/work.repo";
import { WorkService } from "../services/work/work.service";
import { WorkController } from "../controllers/work/work.controller";
import { IChatRepositoy } from "../repositories/chat/chat.repo.interface";
import { ChatService } from "../services/chatMessage/chatMessage.service";
import { IChatService } from "../services/chatMessage/chatMessage.service.interface";
import { ChatController } from "../controllers/chatMessage/chatMessage.controller";
import { IChatController } from "../controllers/chatMessage/chatMessage.controller.interface";
import { MessageRepository } from "../repositories/message/message.repo";
import { IMessageRepository } from "../repositories/message/message.repo.interface";
import { NotificationRepository } from "../repositories/notification/notification.repo";
import { NotificationServices } from "../services/notification/notification.service";
import { INotificationService } from "../services/notification/notification.service.interface";
import { INotificationRepository } from "../repositories/notification/notification.repo.interface";

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

container.bind<IWorkRepository>(TYPES.workRepository).to(WorkRepository);
container.bind<IWorkService>(TYPES.workService).to(WorkService);
container.bind<IWorkController>(TYPES.workController).to(WorkController);

container.bind<IAvailabilityRepository>(TYPES.availabilityRepository).to(AvailabilityRepository);
container.bind<IAvailabilityService>(TYPES.availabilityService).to(AvailabilityService);

container.bind<IWalletRepository>(TYPES.walletRepository).to(WalletRepository);
container.bind<IWalletService>(TYPES.walletService).to(WalletService);

container.bind<INotificationRepository>(TYPES.notificationRepository).to(NotificationRepository);
container.bind<INotificationService>(TYPES.notificationService).to(NotificationServices);

container.bind<IChatRepositoy>(TYPES.chatRepository).to(ChatRepository);
container.bind<IChatService>(TYPES.chatService).to(ChatService);
container.bind<IChatController>(TYPES.chatController).to(ChatController);
container.bind<IMessageRepository>(TYPES.messageRepository).to(MessageRepository);

export default container;
