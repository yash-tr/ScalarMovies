import express from "express";
import { getShowSeats } from "../controllers/showController.js";

const router = express.Router();

router.get("/:id/seats", getShowSeats);

export default router;