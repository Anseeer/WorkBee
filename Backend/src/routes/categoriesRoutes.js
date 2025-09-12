"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversify_container_1 = __importDefault(require("../inversify/inversify.container"));
const inversify_types_1 = __importDefault(require("../inversify/inversify.types"));
const Router = express_1.default.Router();
const categoryController = inversify_container_1.default.get(inversify_types_1.default.categoryController);
Router.get("/categories", categoryController.getAll);
Router.post("/create-category", categoryController.createCategory);
Router.get("/set-active", categoryController.setIsActive);
Router.post("/update", categoryController.update);
Router.delete("/delete", categoryController.delete);
Router.post("/by-worker", categoryController.getByWorker);
Router.post("/by-Id", categoryController.getById);
exports.default = Router;
