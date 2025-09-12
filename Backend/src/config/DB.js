"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("../utilities/logger"));
const MongooseConnection = () => {
    logger_1.default.info('Trying to Conect...');
    try {
        mongoose_1.default.connect(process.env.MONGODB_URI)
            .then(() => {
            logger_1.default.info("DB Contected Successfully...");
        })
            .catch((err) => {
            logger_1.default.error("DB Connection Faild ", err);
        });
    }
    catch (error) {
        logger_1.default.error("Faild To Connect", error);
    }
};
exports.default = MongooseConnection;
