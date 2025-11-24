import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import workerRoutes from "./routes/workerRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import adminRoutes from "./routes/adminRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import auth from "./routes/authVerifyRoutes";
import categoriesRoutes from "./routes/categoriesRoutes";
import servicesRoutes from "./routes/servicesRoutes";
import workRoutes from "./routes/workRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";
import chatRoutes from "./routes/chatRoutes";
import MongooseConnection from "./config/DB";
import { errorHandler } from "./middlewares/errorHandleMiddleware";
import nocache from "nocache";
import cookieParser from "cookie-parser";
import http from "http";
import logger from "./utilities/logger";
import { initializeSocket } from "./socket/socketHandler";
import { initCronJobs } from "./utilities/cronJobs";
import { initSocket } from "./socket/socket";

// dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
dotenv.config()
MongooseConnection();

const app = express();
app.use(nocache());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))

const allowedOrigins = [
  process.env.CLIENT_URL_DOCKER,
  process.env.CLIENT_URL_HOST,
  process.env.CLIENT_URL_DEPLOY,
  process.env.CLIENT_URL_DOMAIN,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use('/api/users', userRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/works', workRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/rzp', paymentRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/auth', auth);

app.get('/', (_, res) => {
  res.send('WorkBee API is running');
})

const server = http.createServer(app);

const io = initSocket(server);
initializeSocket(io);
initCronJobs();

app.use(errorHandler)

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  logger.info(`Listening on http://localhost:${PORT}/`);
});
