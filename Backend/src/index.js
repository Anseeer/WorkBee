"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const workerRoutes_1 = __importDefault(require("./routes/workerRoutes"));
const razorpayRoutes_1 = __importDefault(require("./routes/razorpayRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const authVerifyRoutes_1 = __importDefault(require("./routes/authVerifyRoutes"));
const categoriesRoutes_1 = __importDefault(require("./routes/categoriesRoutes"));
const servicesRoutes_1 = __importDefault(require("./routes/servicesRoutes"));
const workRoutes_1 = __importDefault(require("./routes/workRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const DB_1 = __importDefault(require("./config/DB"));
const errorHandleMiddleware_1 = require("./middlewares/errorHandleMiddleware");
const nocache_1 = __importDefault(require("nocache"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const logger_1 = __importDefault(require("./utilities/logger"));
const socketHandler_1 = require("./socket/socketHandler");
dotenv_1.default.config({ path: `.env.${process.env.NODE_ENV}` });
(0, DB_1.default)();
const app = (0, express_1.default)();
app.use((0, nocache_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use('/api/users', userRoutes_1.default);
app.use('/api/workers', workerRoutes_1.default);
app.use('/api/admins', adminRoutes_1.default);
app.use('/api/categories', categoriesRoutes_1.default);
app.use('/api/services', servicesRoutes_1.default);
app.use('/api/works', workRoutes_1.default);
app.use('/api/chats', chatRoutes_1.default);
app.use('/api/rzp', razorpayRoutes_1.default);
app.use('/api/auth', authVerifyRoutes_1.default);
app.get('/', (_, res) => {
    res.send('WorkBee API is running');
});
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        credentials: true,
    },
});
(0, socketHandler_1.initializeSocket)(io);
app.use(errorHandleMiddleware_1.errorHandler);
server.listen(process.env.PORT, () => {
    logger_1.default.info(`Listening...`);
});
app.listen(process.env.PORT, () => {
    logger_1.default.info(`listening on http://localhost:${process.env.PORT}/`);
});
