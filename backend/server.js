import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import roomRoutes from "./routes/rooms.js";
import { verifySocket  } from "./middleware/auth.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// db
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

// socket auth
io.use(verifySocket);

const roomsState = {};

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
    if (!roomsState[roomId]) roomsState[roomId] = { code: "", language: "javascript" };
    socket.emit("init", roomsState[roomId]);
    socket.to(roomId).emit("user-joined", { userId: socket.userId });
  });

  socket.on("code-change", ({ roomId, code }) => {
    if (roomsState[roomId]) roomsState[roomId].code = code;
    socket.to(roomId).emit("code-change", { code });
  });

  socket.on("language-change", ({ roomId, language }) => {
    if (roomsState[roomId]) roomsState[roomId].language = language;
    socket.to(roomId).emit("language-change", { language });
  });

  socket.on("chat-message", ({ roomId, message }) => {
    io.in(roomId).emit("chat-message", { userId: socket.userId, message });
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
