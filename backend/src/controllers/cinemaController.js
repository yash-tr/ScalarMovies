import prisma from "../services/database.js";

export const getCinemas = async (req, res) => {
  try {
    const cinemas = await prisma.cinema.findMany({ include: { screens: true } });
    res.json(cinemas);
  } catch (error) {
    console.error("Cinemas error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCinemaById = async (req, res) => {
  try {
    const cinema = await prisma.cinema.findUnique({ where: { id: req.params.id } });
    if (!cinema) return res.status(404).json({ message: "Cinema not found" });

    const shows = await prisma.show.findMany({
      where: { screen: { cinemaId: req.params.id } },
      include: { movie: true, screen: true },
      orderBy: { time: 'asc' },
    });
    
    const moviesMap = new Map();
    shows.forEach(show => {
      if (!moviesMap.has(show.movie.id)) {
        moviesMap.set(show.movie.id, { ...show.movie, shows: [] });
      }
      moviesMap.get(show.movie.id).shows.push(show);
    });

    res.json({ cinema, movies: Array.from(moviesMap.values()) });
  } catch (error) {
    console.error("Cinema detail error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};