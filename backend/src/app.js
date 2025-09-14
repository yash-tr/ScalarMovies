import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

// Import routes
import authRoutes from "./routes/auth.js";
import cinemaRoutes from "./routes/cinema.js";
import showRoutes from "./routes/show.js";
import bookingRoutes from "./routes/booking.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cinemas", cinemaRoutes);
app.use("/api/shows", showRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// --- SOCKET.IO ---
const blockedSeats = new Map();

io.on("connection", (socket) => {
  socket.on("joinShow", (showId) => {
    socket.join(showId);
  });

  socket.on("blockSeat", ({ showId, seatNumber }) => {
    socket.to(showId).emit("seatBlocked", seatNumber);
    const key = `${showId}-${seatNumber}`;
    const timeoutId = setTimeout(() => {
      io.to(showId).emit('seatReleased', seatNumber);
      blockedSeats.delete(key);
    }, 5 * 60 * 1000);
    blockedSeats.set(key, timeoutId);
  });

  socket.on("releaseSeat", ({ showId, seatNumber }) => {
    socket.to(showId).emit("seatReleased", seatNumber);
    const key = `${showId}-${seatNumber}`;
    if (blockedSeats.has(key)) {
      clearTimeout(blockedSeats.get(key));
      blockedSeats.delete(key);
    }
  });

  socket.on("leaveShow", (showId) => {
    socket.leave(showId);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;