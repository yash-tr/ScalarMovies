import { Server } from "socket.io";

let ioInstance = null;

export const initializeSocket = (io) => {
  ioInstance = io;
  const blockedSeats = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinShow", (showId) => {
      socket.join(showId);
      console.log(`User ${socket.id} joined show ${showId}`);
    });

    socket.on("leaveShow", (showId) => {
      socket.leave(showId);
      console.log(`User ${socket.id} left show ${showId}`);
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

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export const getIO = () => ioInstance;