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
import MongooseConnection from "./config/DB";
import { errorHandler } from "./middlewares/errorHandleMiddleware";
import nocache from "nocache";
import cookieParser from "cookie-parser";
import { Server } from 'socket.io';
import http from "http";
import Message from "./model/message/message.model";

dotenv.config();
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

// server.ts (socket part)
io.on('connection', (socket) => {
  console.log('A user connected!', socket.id);

  socket.on('joinRoom', async(room: string) => {
    socket.join(room);
    console.log(`${socket.id} joined ${room}`);
    const last50 = await Message.find({room}).sort({timeStamp:-1}).limit(50).lean();
    socket.emit('previousMessages', last50);
  });

  socket.on('leaveRoom', (room: string) => {
    socket.leave(room);
    console.log(`${socket.id} left ${room}`);
  });

  socket.on('sendMessage', async ({ room, sender, receiver, content }: { room: string; sender: string; receiver:string; content: string }) => {
    const message = new Message({ room, sender,receiver, content, timestamp: new Date() });
    await message.save();
    io.to(room).emit('message', message); 
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.id);
  });
});


app.use(errorHandler)

server.listen(process.env.PORT, () => {
  console.log(`Listening...`)
});


app.listen(process.env.PORT, () => {
  console.log(`listening on http://localhost:${process.env.PORT}/`)
}); 