import prisma from "../services/database.js";

// CINEMA ADMIN ROUTES
export const getCinemas = async (req, res) => {
  try {
    const cinemas = await prisma.cinema.findMany({ include: { screens: true } });
    res.json(cinemas);
  } catch (error) {
    console.error("Admin cinemas error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createCinema = async (req, res) => {
  try {
    const { name, city, address } = req.body;
    if (!name || !city || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const cinema = await prisma.cinema.create({
      data: { name, city, address },
    });
    res.status(201).json(cinema);
  } catch (error) {
    console.error("Create cinema error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCinema = async (req, res) => {
  try {
    const { name, city, address } = req.body;
    const cinema = await prisma.cinema.update({
      where: { id: req.params.id },
      data: { name, city, address },
    });
    res.json(cinema);
  } catch (error) {
    console.error("Update cinema error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCinema = async (req, res) => {
  try {
    await prisma.cinema.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error("Delete cinema error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// SCREEN ADMIN ROUTES
export const getScreens = async (req, res) => {
  try {
    const screens = await prisma.screen.findMany({ include: { cinema: true } });
    res.json(screens);
  } catch (error) {
    console.error("Admin screens error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createScreen = async (req, res) => {
  try {
    const { name, cinemaId } = req.body;
    if (!name || !cinemaId) {
      return res.status(400).json({ message: "Name and cinemaId are required" });
    }
    
    const screen = await prisma.screen.create({
      data: { name, cinemaId },
    });
    res.status(201).json(screen);
  } catch (error) {
    console.error("Create screen error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateScreen = async (req, res) => {
  try {
    const { name, cinemaId } = req.body;
    const screen = await prisma.screen.update({
      where: { id: req.params.id },
      data: { name, cinemaId },
    });
    res.json(screen);
  } catch (error) {
    console.error("Update screen error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteScreen = async (req, res) => {
  try {
    await prisma.screen.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error("Delete screen error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// MOVIE ADMIN ROUTES
export const getMovies = async (req, res) => {
  try {
    const movies = await prisma.movie.findMany();
    res.json(movies);
  } catch (error) {
    console.error("Admin movies error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createMovie = async (req, res) => {
  try {
    const { title, duration, genre } = req.body;
    if (!title || !duration || !genre) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const movie = await prisma.movie.create({
      data: { title, duration: parseInt(duration), genre },
    });
    res.status(201).json(movie);
  } catch (error) {
    console.error("Create movie error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const { title, duration, genre } = req.body;
    const movie = await prisma.movie.update({
      where: { id: req.params.id },
      data: { title, duration: parseInt(duration), genre },
    });
    res.json(movie);
  } catch (error) {
    console.error("Update movie error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    await prisma.movie.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error("Delete movie error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// SHOW ADMIN ROUTES
export const getShows = async (req, res) => {
  try {
    const shows = await prisma.show.findMany({
      include: { movie: true, screen: { include: { cinema: true } } },
    });
    res.json(shows);
  } catch (error) {
    console.error("Admin shows error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createShow = async (req, res) => {
  try {
    const { movieId, screenId, date, time, price } = req.body;
    if (!movieId || !screenId || !date || !time || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const show = await prisma.show.create({
      data: { 
        movieId, 
        screenId, 
        date: new Date(date), 
        time: new Date(time), 
        price: parseFloat(price) 
      },
    });
    res.status(201).json(show);
  } catch (error) {
    console.error("Create show error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateShow = async (req, res) => {
  try {
    const { movieId, screenId, date, time, price } = req.body;
    const show = await prisma.show.update({
      where: { id: req.params.id },
      data: { 
        movieId, 
        screenId, 
        date: new Date(date), 
        time: new Date(time), 
        price: parseFloat(price) 
      },
    });
    res.json(show);
  } catch (error) {
    console.error("Update show error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteShow = async (req, res) => {
  try {
    await prisma.show.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    console.error("Delete show error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// USER ADMIN ROUTES
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    res.json(users);
  } catch (error) {
    console.error("Admin users error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["USER", "ADMIN"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
    });
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};