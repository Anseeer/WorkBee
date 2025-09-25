const TYPES = {
    userRepository: Symbol.for("userRepository"),
    userService: Symbol.for("userService"),
    userController: Symbol.for("userController"),

    adminRepository: Symbol.for("adminRepository"),
    adminService: Symbol.for("adminService"),
    adminController: Symbol.for("adminController"),

    workerRepository: Symbol.for("workerRepository"),
    workerService: Symbol.for("workerService"),
    workerController: Symbol.for("workerController"),

    categoryRepository: Symbol.for("categoryRepository"),
    categoryService: Symbol.for("categoryService"),
    categoryController: Symbol.for("categoryController"),

    serviceRepository: Symbol.for("serviceRepository"),
    serviceService: Symbol.for("serviceService"),
    serviceController: Symbol.for("serviceController"),

    availabilityRepository: Symbol.for("availabilityRepository"),
    availabilityService: Symbol.for("availabilityService"),
    availabilityController: Symbol.for("availabilityController"),

    workRepository: Symbol.for("workRepository"),
    workService: Symbol.for("workService"),
    workController: Symbol.for("workController"),

    walletRepository: Symbol.for("walletRepository"),
    walletService: Symbol.for("walletService"),

    chatRepository: Symbol.for("chatRepository"),
    chatService: Symbol.for("chatService"),
    chatController: Symbol.for("chatController"),

    messageRepository: Symbol.for("messageRepository"),

    notificationRepository: Symbol.for("notificationRepository"),
    notificationService: Symbol.for("notificationService"),


    paymentRepository: Symbol.for("paymentRepository"),
    paymentService: Symbol.for("paymentService"),
};

export default TYPES;
