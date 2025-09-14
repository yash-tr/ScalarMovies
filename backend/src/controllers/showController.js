import prisma from "../services/database.js";

export const getShowSeats = async (req, res) => {
  try {
    const show = await prisma.show.findUnique({
      where: { id: req.params.id },
      include: { movie: true },
    });
    if (!show) return res.status(404).json({ message: "Show not found" });

    const bookings = await prisma.booking.findMany({
      where: { showId: req.params.id, status: "CONFIRMED" },
    });
    const bookedSeats = bookings.flatMap(b => b.seats);

    const seats = [];
    for (let r = 1; r <= 10; r++) {
      for (let s = 1; s <= 10; s++) {
        const seatNumber = `R${r}-S${s}`;
        seats.push({
          number: seatNumber,
          status: bookedSeats.includes(seatNumber) ? "booked" : "available",
        });
      }
    }
    res.json({ show, seats });
  } catch (error) {
    console.error("Seats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};