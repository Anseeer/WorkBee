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
};

export default TYPES;
