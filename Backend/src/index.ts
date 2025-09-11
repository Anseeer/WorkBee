import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import workerRoutes from "./routes/workerRoutes";
import rzpRoutes from "./routes/razorpayRoutes";
import adminRoutes from "./routes/adminRoutes";
import auth from "./routes/authVerifyRoutes";
import categoriesRoutes from "./routes/categoriesRoutes";
import servicesRoutes from "./routes/servicesRoutes";
import workRoutes from "./routes/workRoutes";
import chatRoutes from "./routes/chatRoutes";
import MongooseConnection from "./config/DB";
import { errorHandler } from "./middlewares/errorHandleMiddleware";
import nocache from "nocache";
import cookieParser from "cookie-parser";
import { Server } from 'socket.io';
import http from "http";
import logger from "./utilities/logger";
import { initializeSocket } from "./socket/socketHandler";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
MongooseConnection();

const app = express();
app.use(nocache());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use('/api/users', userRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/works', workRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/rzp', rzpRoutes);
app.use('/api/auth', auth);

app.get('/', (_, res) => {
  res.send('WorkBee API is running');
})

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

initializeSocket(io);

app.use(errorHandler)

server.listen(process.env.PORT, () => {
  logger.info(`Listening...`)
});

app.listen(process.env.PORT, () => {
  logger.info(`listening on http://localhost:${process.env.PORT}/`)
}); 