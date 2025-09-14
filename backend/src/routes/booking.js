import express from "express";
import { getUserBookings, createBooking, getBookingById, cancelBooking } from "../controllers/bookingController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, getUserBookings);
router.post("/", authenticateToken, createBooking);
router.get("/:id", authenticateToken, getBookingById);
router.delete("/:id", authenticateToken, cancelBooking);

export default router;