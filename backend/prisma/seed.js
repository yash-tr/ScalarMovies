import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  try {
    // Clear existing data
    console.log('Cleaning existing data...');
    await prisma.booking.deleteMany();
    await prisma.show.deleteMany();
    await prisma.screen.deleteMany();
    await prisma.movie.deleteMany();
    await prisma.cinema.deleteMany();
    await prisma.user.deleteMany();

    // Create users
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@moviebooking.com',
        password: adminPassword,
        name: 'Admin User',
        role: 'ADMIN'
      }
    });

    const testUser = await prisma.user.create({
      data: {
        email: 'user@moviebooking.com',
        password: hashedPassword,
        name: 'Test User',
        role: 'USER'
      }
    });

    console.log('Users created:', { admin: adminUser.email, user: testUser.email });

    // Create cinemas
    console.log('Creating cinemas...');
    const cinema1 = await prisma.cinema.create({
      data: {
        name: 'AYAAN CINEMAS',
        city: 'SOLAN',
        address: 'GG MALL'
      }
    });

    const cinema2 = await prisma.cinema.create({
      data: {
        name: 'PVR CINEMAS',
        city: 'DELHI',
        address: 'SELECT CITY WALK'
      }
    });

    const cinema3 = await prisma.cinema.create({
      data: {
        name: 'INOX CINEMAS',
        city: 'MUMBAI',
        address: 'PHOENIX MALL'
      }
    });

    console.log('Cinemas created:', [cinema1.name, cinema2.name, cinema3.name]);

    // Create screens
    console.log('Creating screens...');
    const screen1 = await prisma.screen.create({
      data: {
        name: 'SCREEN1',
        cinemaId: cinema1.id
      }
    });

    const screen2 = await prisma.screen.create({
      data: {
        name: 'SCREEN2',
        cinemaId: cinema1.id
      }
    });

    const screen3 = await prisma.screen.create({
      data: {
        name: 'SCREEN1',
        cinemaId: cinema2.id
      }
    });

    const screen4 = await prisma.screen.create({
      data: {
        name: 'SCREEN1',
        cinemaId: cinema3.id
      }
    });

    console.log('Screens created:', [screen1.name, screen2.name, screen3.name, screen4.name]);

    // Create movies
    console.log('Creating movies...');
    const movie1 = await prisma.movie.create({
      data: {
        title: 'NARSIMHA',
        duration: 185,
        genre: 'Spiritual'
      }
    });

    const movie2 = await prisma.movie.create({
      data: {
        title: 'AVENGERS: ENDGAME',
        duration: 181,
        genre: 'Action'
      }
    });

    const movie3 = await prisma.movie.create({
      data: {
        title: 'THE LION KING',
        duration: 118,
        genre: 'Animation'
      }
    });

    const movie4 = await prisma.movie.create({
      data: {
        title: 'JOKER',
        duration: 122,
        genre: 'Drama'
      }
    });

    const movie5 = await prisma.movie.create({
      data: {
        title: 'SPIDER-MAN: NO WAY HOME',
        duration: 148,
        genre: 'Action'
      }
    });

    console.log('Movies created:', [movie1.title, movie2.title, movie3.title, movie4.title, movie5.title]);

    // Create shows
    console.log('Creating shows...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    const shows = [];

    // Shows for cinema1 (AYAAN CINEMAS)
    shows.push(await prisma.show.create({
      data: {
        movieId: movie1.id,
        screenId: screen1.id,
        date: today,
        time: new Date(today.getTime() + 10 * 60 * 60 * 1000), // 10:00 AM
        price: 300
      }
    }));

    shows.push(await prisma.show.create({
      data: {
        movieId: movie1.id,
        screenId: screen1.id,
        date: today,
        time: new Date(today.getTime() + 14 * 60 * 60 * 1000), // 2:00 PM
        price: 350
      }
    }));

    shows.push(await prisma.show.create({
      data: {
        movieId: movie2.id,
        screenId: screen2.id,
        date: today,
        time: new Date(today.getTime() + 18 * 60 * 60 * 1000), // 6:00 PM
        price: 400
      }
    }));

    shows.push(await prisma.show.create({
      data: {
        movieId: movie3.id,
        screenId: screen1.id,
        date: tomorrow,
        time: new Date(tomorrow.getTime() + 12 * 60 * 60 * 1000), // 12:00 PM
        price: 250
      }
    }));

    // Shows for cinema2 (PVR CINEMAS)
    shows.push(await prisma.show.create({
      data: {
        movieId: movie4.id,
        screenId: screen3.id,
        date: today,
        time: new Date(today.getTime() + 20 * 60 * 60 * 1000), // 8:00 PM
        price: 450
      }
    }));

    shows.push(await prisma.show.create({
      data: {
        movieId: movie5.id,
        screenId: screen3.id,
        date: tomorrow,
        time: new Date(tomorrow.getTime() + 16 * 60 * 60 * 1000), // 4:00 PM
        price: 500
      }
    }));

    // Shows for cinema3 (INOX CINEMAS)
    shows.push(await prisma.show.create({
      data: {
        movieId: movie2.id,
        screenId: screen4.id,
        date: today,
        time: new Date(today.getTime() + 19 * 60 * 60 * 1000), // 7:00 PM
        price: 380
      }
    }));

    shows.push(await prisma.show.create({
      data: {
        movieId: movie3.id,
        screenId: screen4.id,
        date: dayAfter,
        time: new Date(dayAfter.getTime() + 15 * 60 * 60 * 1000), // 3:00 PM
        price: 320
      }
    }));

    console.log('Shows created:', shows.length);

    // Create some sample bookings
    console.log('Creating sample bookings...');
    const booking1 = await prisma.booking.create({
      data: {
        userId: testUser.id,
        showId: shows[0].id,
        seats: ['R5-S5', 'R5-S6'],
        total: 600,
        status: 'CONFIRMED'
      }
    });

    const booking2 = await prisma.booking.create({
      data: {
        userId: testUser.id,
        showId: shows[1].id,
        seats: ['R3-S3', 'R3-S4', 'R3-S5'],
        total: 1050,
        status: 'CONFIRMED'
      }
    });

    console.log('Sample bookings created:', [booking1.id, booking2.id]);

    console.log('Database seeding completed successfully!');
    console.log('Summary:');
    console.log('Users: 2 (1 admin, 1 user)');
    console.log('Cinemas: 3');
    console.log('Screens: 4');
    console.log('Movies: 5');
    console.log('Shows:', shows.length);
    console.log('Bookings: 2');
    console.log('Login Credentials:');
    console.log('Admin: admin@moviebooking.com / admin123');
    console.log('User: user@moviebooking.com / password123');

  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Database connection closed');
  });