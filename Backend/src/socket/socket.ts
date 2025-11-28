/* eslint-disable @typescript-eslint/no-explicit-any */
import { Server } from "socket.io";
import dotenv from "dotenv";

const envFile =
    process.env.NODE_ENV === "production"
        ? ".env.production"
        : ".env.development";

dotenv.config({ path: envFile });
dotenv.config();

let io: Server | null = null;

export const initSocket = (server: any) => {
    const allowedOrigins = [
        process.env.CLIENT_URL_DOCKER,
        process.env.CLIENT_URL_HOST,
        process.env.CLIENT_URL_DEPLOY,
        process.env.CLIENT_URL_DOMAIN
    ].filter((url): url is string => Boolean(url));

    io = new Server(server, {
        cors: {
            origin: allowedOrigins.length > 0 ? allowedOrigins : "*",
            methods: ["GET", "POST"],
            credentials: true,
        },
        transports: ["websocket", "polling"],
        allowUpgrades: true,
    });

    console.log("🔌 Socket.IO Initialized");
    console.log("Allowed Origins:", allowedOrigins);

    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        socket.on("join-user-room", (userId: string) => {
            console.log("➡ join-user-room:", userId, "socket:", socket.id);

            if (!userId) {
                console.log("ERROR: userId is missing in join-user-room!");
                return;
            }

            socket.join(userId);
            console.log(`User ${userId} joined their room`);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
    return io;
};

export const getIO = (): Server => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
};
