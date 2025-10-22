import dotenv from "dotenv"
dotenv.config()
import express from "express"
import http from "http"
import { Server } from "socket.io";
import cors from "cors"
import { join } from "path";

const PORT = process.env.PORT
const FRONTEND_URL = process.env.FRONTEND_URL
const app = express()
app.use(cors({ origin: FRONTEND_URL, credentials: true }))

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
    console.log(`${socket.id} a user connected`);

    socket.on("join-room", ({ username, roomId }) => {
        console.log(`${socket.id}-${username} joined room ${roomId} `)
        socket.join(roomId)
        socket.emit("room-joined", { roomId, socketId: socket.id })
        socket.to(roomId).emit("user-joined", { socketId: socket.id, username });
    })

    socket.on("leave-room", ({ roomId }) => {
        console.log(`${socket.id} has left the room`)
        socket.leave(roomId)
        socket.to(roomId).emit("user-left", { socketId: socket.id });
    })

    socket.on("offer", ({ to, offer }) => {
        console.log(offer)
        socket.to(to).emit("offer", { from: socket.id, offer })
    })

    socket.on("answer", ({ to, answer }) => {
        console.log(answer)
        socket.to(to).emit("answer", { from: socket.id, answer })
    })

    socket.on("ice-candidate", ({ to, candidate }) => {
        socket.to(to).emit("ice-candidate", { from: socket.id, candidate });
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});


server.listen(6001, () => console.log(`Socket.IO server running on port ${PORT}`))
