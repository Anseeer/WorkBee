/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

let io: Server | null = null;

export const initSocket = (server: any) => {
    const allowedOrigins = [
        process.env.CLIENT_URL_DOCKER,
        process.env.CLIENT_URL_HOST,
        process.env.CLIENT_URL_CLOUD || "https://workbee-frontend-170764750094.asia-south1.run.app",
    ].filter((url): url is string => Boolean(url));

    io = new Server(server, {
        cors: {
            origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
            credentials: true,
        },
    });

    return io;
};

export const getIO = (): Server => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
};
