# 🎬 Movie Booking System

A full-stack web application similar to BookMyShow, built with modern technologies for cinema ticket booking with real-time seat selection and admin management.

![Movie Booking System](screenshots/Screenshot%202025-09-14%20165409.jpg)

## �� Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **MySQL** - Database (via Docker)
- **JWT** - Authentication
- **Socket.IO** - Real-time communication
- **bcryptjs** - Password hashing

### Frontend
- **React.js** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication

### Development Tools
- **Docker** - Database containerization
- **Nodemon** - Development server
- **ESLint** - Code linting

## 📋 Features

### User Features
- ✅ User registration and authentication
- ✅ Browse cinemas and movies
- ✅ Real-time seat selection (10x10 grid)
- ✅ Booking confirmation and history
- ✅ Booking cancellation
- ✅ Responsive design

### Admin Features
- ✅ Admin panel with CRUD operations
- ✅ Manage cinemas, screens, movies, and shows
- ✅ User management
- ✅ Real-time seat monitoring

### Real-time Features
- ✅ Live seat blocking (5-minute timeout)
- ✅ Real-time seat status updates
- ✅ Multi-user seat selection prevention

## 🗄️ Database Schema

### Core Entities

```sql
User {
  id: String (Primary Key)
  email: String (Unique)
  password: String (Hashed)
  name: String
  role: Enum (USER, ADMIN)
  createdAt: DateTime
}

Cinema {
  id: String (Primary Key)
  name: String
  city: String
  address: String
  createdAt: DateTime
  screens: Screen[]
}

Screen {
  id: String (Primary Key)
  name: String
  cinemaId: String (Foreign Key)
  cinema: Cinema
  shows: Show[]
}

Movie {
  id: String (Primary Key)
  title: String
  duration: Int (minutes)
  genre: String
  createdAt: DateTime
  shows: Show[]
}

Show {
  id: String (Primary Key)
  movieId: String (Foreign Key)
  screenId: String (Foreign Key)
  date: DateTime
  time: DateTime
  price: Float
  createdAt: DateTime
  movie: Movie
  screen: Screen
  bookings: Booking[]
}


## 🎯 Assignment Completion

### ✅ Core Requirements Met
- **Backend APIs**: Users, Cinemas, Screens, Movies, Shows, Bookings
- **Fixed Seat Layout**: 10x10 grid for all screens
- **Frontend Flow**: Cinema listing → Movie selection → Seat selection → Booking confirmation
- **User Authentication**: JWT-based secure authentication
- **Booking Management**: Complete booking flow with history

### ⭐ Bonus Features Implemented
- **Real-time Seat Blocking**: Prevents double bookings with Socket.IO
- **Admin Panel**: Secure CRUD operations for system management
- **Booking Cancellation**: Users can cancel bookings from history

## 🛠️ Tech Stack

**Backend**
- Node.js + Express.js
- Prisma ORM + MySQL
- JWT Authentication
- Socket.IO (Real-time updates)
- Docker (Database containerization)

**Frontend**
- React.js
- Tailwind CSS (BookMyShow-inspired design)
- Axios (API calls)
- Socket.IO Client (Real-time features)

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 16+ and npm
- Docker and Docker Compose
- Git

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd movie-booking-system

# Start MySQL database
docker-compose up -d mysql

# Backend setup
cd backend
npm install
npx prisma migrate dev
npm run seed
npm run dev

# Frontend setup (new terminal)
cd frontend  
npm install
npm start
```

### 2. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: MySQL on localhost:3306

### 3. Test Accounts
```
Admin: admin@test.com / password123
User: user@test.com / password123
```

## 📋 Database Schema

### Simple Entity Relationships
```
Users (1:N) Bookings (N:1) Shows (N:1) Movies
Shows (N:1) Screens (N:1) Cinemas
```

### Core Tables
- **users**: Authentication and user data
- **cinemas**: Movie theater locations
- **screens**: Theater screens (10x10 seats each)
- **movies**: Basic movie information
- **shows**: Movie screenings with pricing
- **bookings**: User seat reservations

## 🎨 UI Design (BookMyShow Inspired)

### Color Scheme
- Primary Red: `#e53e3e` (BookMyShow brand color)
- Gray backgrounds and text
- Interactive seat colors (available/selected/booked/blocked)

### Key Screens
1. **Home**: Cinema cards with city filtering
2. **Cinema Detail**: Movies and showtimes
3. **Seat Selection**: Interactive 10x10 grid
4. **Booking Confirmation**: Success message with details
5. **Booking History**: User's past bookings
6. **Admin Panel**: System management interface

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/register   # User registration
POST /api/auth/login      # User login  
GET  /api/auth/me         # Current user info
```

### Core Features
```
GET  /api/cinemas         # List all cinemas
GET  /api/cinemas/:id     # Cinema details with movies
GET  /api/shows/:id/seats # Seat layout and availability
POST /api/bookings        # Create new booking
GET  /api/users/bookings  # User booking history
```

### Admin Only
```
POST /api/admin/cinemas   # Add cinema
POST /api/admin/movies    # Add movie
POST /api/admin/shows     # Add show
```

## ⚡ Real-time Features

### Seat Blocking System
- When user selects seats → temporarily blocked for others
- Real-time updates via WebSocket
- 5-minute timeout for seat holds
- Prevents double booking conflicts

### WebSocket Events
```javascript
// Join show room
socket.emit('join-show', showId);

// Seat updates
socket.on('seat-blocked', seatData);
socket.on('seat-released', seatData);
socket.on('seat-booked', bookingData);
```

## 🧪 Testing the Application

### Core User Flow
1. **Register/Login** → Get JWT token
2. **Select Cinema** → Browse available cinemas
3. **Choose Movie & Show** → Select preferred timing
4. **Select Seats** → Pick up to 6 seats from 10x10 grid
5. **Complete Booking** → Click "Pay" button
6. **View History** → Check past bookings

### Admin Testing
1. **Login as Admin** → Use admin credentials
2. **Add Cinema** → Create new cinema with screens
3. **Add Movies** → Add movies to the system
4. **Schedule Shows** → Create showtimes
5. **View Bookings** → See all user bookings

### Real-time Testing
1. **Open Multiple Browsers** → Same show seat selection
2. **Select Seats** → See real-time blocking
3. **Complete Booking** → Seats permanently booked
4. **Check Updates** → Other browsers see changes instantly

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Railway)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Environment Variables
```bash
# Backend (.env)
DATABASE_URL="mysql://user:pass@host:3306/movie_booking"
JWT_SECRET="your-secret-key"
PORT=5000

# Frontend (.env)
REACT_APP_API_URL="http://localhost:5000"
```

## 📁 Project Structure

```
movie-booking-system/
backend/src/
├── app.js                 # Main application file
├── middleware/
│   └── auth.js           # Authentication middleware
├── services/
│   ├── database.js       # Database connection
│   └── socketService.js  # Socket.IO service
├── controllers/
│   ├── authController.js
│   ├── cinemaController.js
│   ├── showController.js
│   ├── bookingController.js
│   └── adminController.js
└── routes/
    ├── auth.js
    ├── cinema.js
    ├── show.js
    ├── booking.js
    └── admin.js
├── frontend/
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Main screens
│   │   ├── services/     # API calls
│   │   └── App.js       # React app
│   └── package.json
├── docker-compose.yml   # MySQL container
└── README.md
```

## 🎯 Interview Highlights

### Technical Decisions
1. **JWT Authentication** → Stateless, scalable auth
2. **Prisma ORM** → Type-safe database operations  
3. **Socket.IO** → Real-time seat blocking
4. **Docker MySQL** → Easy local development
5. **BookMyShow UI** → Industry-standard design patterns

### Problem Solving Demonstrated
- **Concurrency Control**: Real-time seat blocking prevents conflicts
- **State Management**: Proper React state for complex booking flow
- **Database Design**: Efficient schema with proper relationships
- **Security**: JWT tokens, password hashing, input validation
- **UX Design**: Intuitive flow matching popular booking platforms

### Scalability Considerations
- **Stateless Backend**: Easy horizontal scaling
- **Database Indexing**: Optimized queries for performance
- **Component Architecture**: Reusable UI components
- **API Design**: RESTful endpoints for maintainability

## 💡 Future Enhancements (Discussion Points)

- **Caching**: Redis for session management
- **Payment Integration**: Stripe/PayPal integration
- **Email Notifications**: Booking confirmations
- **Mobile App**: React Native implementation
- **Analytics**: Booking insights dashboard
- **Load Balancing**: Multi-instance deployment

---
# Movie Booking System - Setup Guide

## 🚀 Quick Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (for MySQL)
- Git

### 1. Environment Setup

#### Backend Environment Variables
Create `backend/.env` file:
```bash
DATABASE_URL="mysql://root:password@localhost:3306/movie_booking"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
FRONTEND_URL="http://localhost:3000"
NODE_ENV="development"
```

#### Frontend Environment Variables
Create `frontend/.env` file:
```bash
VITE_API_URL="http://localhost:5000"
```

### 2. Database Setup
```bash
# Start MySQL database
docker-compose up -d

# Backend setup
cd backend
npm install

# Generate Prisma client and run migrations
npx prisma generate
npm run db:migrate

# Seed the database with initial data
npm run db:seed
```

### 3. Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

### 4. Start Frontend Server
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on http://localhost:3000

### 5. Test Accounts
- **Admin**: admin@test.com / password123
- **User**: user@test.com / password123

## 📋 Features Implemented

### ✅ Core Requirements
- **Backend APIs**: Users, Cinemas, Screens, Movies, Shows, Bookings
- **Fixed Seat Layout**: 10x10 grid for all screens
- **Frontend Flow**: Cinema listing → Movie selection → Seat selection → Booking confirmation
- **User Authentication**: JWT-based secure authentication
- **Booking Management**: Complete booking flow with history

### ⭐ Bonus Features
- **Real-time Seat Blocking**: Prevents double bookings with Socket.IO
- **Admin Panel**: Basic admin interface (expandable)
- **Booking Cancellation**: Users can cancel bookings from history
- **BookMyShow-inspired UI**: Red color scheme (#e53e3e) with modern design

## 🎨 UI Design 

### Color Scheme
- Primary Red: `#e53e3e` (brand color)
- Light Gray: `#f7fafc` (Background)
- Dark Gray: `#2d3748` (Text)
- Success Green: `#38a169`
- Warning Orange: `#ed8936`

### Key Components
1. **Cinema Cards**: Red accent, white background, shadow effects
2. **Movie Cards**: Clean layout with showtime buttons
3. **Seat Grid**: Interactive 10x10 layout with color-coded states:
   - Available: Light gray (#e2e8f0)
   - Selected: Red (#e53e3e)
   - Booked: Dark gray (#4a5568)
   - Blocked: Orange (#ed8936)
4. **Header**: Clean navigation with authentication state

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Current user info

### Core Features
- `GET /api/cinemas` - List all cinemas
- `GET /api/cinemas/:id` - Cinema details with movies
- `GET /api/shows/:id/seats` - Seat layout and availability
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - User booking history
- `DELETE /api/bookings/:id` - Cancel booking

### Admin Routes
- `GET /api/admin/cinemas` - List cinemas (admin)
- `GET /api/admin/movies` - List movies (admin)
- `GET /api/admin/shows` - List shows (admin)

## ⚡ Real-time Features

### Seat Blocking System
- When user selects seats → temporarily blocked for others
- Real-time updates via WebSocket
- 5-minute timeout for seat holds
- Prevents double booking conflicts

### WebSocket Events
```javascript
// Join show room
socket.emit('joinShow', showId);

// Seat updates
socket.on('seatBlocked', seatNumber);
socket.on('seatReleased', seatNumber);
socket.on('seatBooked', bookedSeats);


```

## 🧪 Testing the Application

### Core User Flow
1. **Register/Login** → Get JWT token
2. **Select Cinema** → Browse available cinemas
3. **Choose Movie & Show** → Select preferred timing
4. **Select Seats** → Pick up to 6 seats from 10x10 grid
5. **Complete Booking** → Click "Pay" button
6. **View History** → Check past bookings

### Real-time Testing
1. **Open Multiple Browsers** → Same show seat selection
2. **Select Seats** → See real-time blocking
3. **Complete Booking** → Seats permanently booked
4. **Check Updates** → Other browsers see changes instantly

## 🚀 Production Deployment

### Environment Variables for Production
```bash
# Backend
DATABASE_URL="mysql://user:pass@host:3306/movie_booking"
JWT_SECRET="your-production-secret-key"
PORT=5000
FRONTEND_URL="https://your-frontend-domain.com"

# Frontend
VITE_API_URL="https://your-backend-domain.com"
```

### Recommended Platforms
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Heroku, DigitalOcean
- **Database**: PlanetScale, AWS RDS, DigitalOcean Managed Database

