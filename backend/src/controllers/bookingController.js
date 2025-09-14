import prisma from "../services/database.js";

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.userId },
      include: {
        show: { include: { movie: true, screen: { include: { cinema: true } } } },
      },
      orderBy: { bookedAt: "desc" },
    });
    res.json(bookings);
  } catch (error) {
    console.error("Bookings error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { showId, seats } = req.body;
    if (!seats || seats.length === 0 || seats.length > 6) {
      return res.status(400).json({ message: "Please select 1-6 seats" });
    }
    
    const show = await prisma.show.findUnique({ where: { id: showId } });
    if (!show) return res.status(404).json({ message: "Show not found" });
    
    // Get all confirmed bookings for this show
    const confirmedBookings = await prisma.booking.findMany({
      where: { showId, status: "CONFIRMED" },
      select: { seats: true }
    });
    
    // Check for seat conflicts manually
    const bookedSeats = confirmedBookings.flatMap(booking => booking.seats);
    const conflictingSeats = seats.filter(seat => bookedSeats.includes(seat));
    
    if (conflictingSeats.length > 0) {
      return res.status(409).json({ 
        message: `Seats ${conflictingSeats.join(', ')} are already booked` 
      });
    }

    const total = seats.length * show.price;
    const booking = await prisma.booking.create({
      data: { userId: req.userId, showId, seats, total },
    });

    // Note: Socket emission will be handled in the main app file
    res.status(201).json({ id: booking.id });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        show: { include: { movie: true, screen: { include: { cinema: true } } } },
      }
    });

    if (!booking || (booking.userId !== req.userId && req.userRole !== 'ADMIN')) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    console.error("Booking detail error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking || booking.userId !== req.userId) {
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }
    
    await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: "CANCELLED" },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};