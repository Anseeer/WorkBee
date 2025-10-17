/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "socket.io";

let io: Server | null = null;

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });
    return io;
};

export const getIO = (): Server => {
    console.log("LOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
};
