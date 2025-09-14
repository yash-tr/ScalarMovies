import express from "express";
import { 
  getCinemas, createCinema, updateCinema, deleteCinema,
  getScreens, createScreen, updateScreen, deleteScreen,
  getMovies, createMovie, updateMovie, deleteMovie,
  getShows, createShow, updateShow, deleteShow,
  getUsers, updateUserRole
} from "../controllers/adminController.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Cinema routes
router.get("/cinemas", getCinemas);
router.post("/cinemas", createCinema);
router.put("/cinemas/:id", updateCinema);
router.delete("/cinemas/:id", deleteCinema);

// Screen routes
router.get("/screens", getScreens);
router.post("/screens", createScreen);
router.put("/screens/:id", updateScreen);
router.delete("/screens/:id", deleteScreen);

// Movie routes
router.get("/movies", getMovies);
router.post("/movies", createMovie);
router.put("/movies/:id", updateMovie);
router.delete("/movies/:id", deleteMovie);

// Show routes
router.get("/shows", getShows);
router.post("/shows", createShow);
router.put("/shows/:id", updateShow);
router.delete("/shows/:id", deleteShow);

// User routes
router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);

export default router;