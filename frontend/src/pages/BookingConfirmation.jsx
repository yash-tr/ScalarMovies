import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BookingConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBooking = async () => {
      try {
        const response = await api.get(`/bookings/${id}`);
        setBooking(response.data);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBooking();
    } else {
      setError('Invalid booking ID');
      setLoading(false);
    }
  }, [id, isAuthenticated, navigate]);

  const formatSeats = (seats) => {
    if (!seats || !Array.isArray(seats)) return 'No seats';
    
    // Handle both formats: string array or object array
    if (typeof seats[0] === 'string') {
      // Old format: ["R5-S5", "R5-S6"]
      return seats.join(', ');
    } else if (typeof seats[0] === 'object' && seats[0].number) {
      // New format: [{"number": "R5-S5", "status": "available"}]
      return seats.map(seat => seat.number).join(', ');
    }
    
    return 'Invalid seat format';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const time = new Date(timeString);
    return time.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bms-red mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/bookings')}
            className="bg-bms-red text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/bookings')}
            className="bg-bms-red text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your tickets have been successfully booked</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Booking Details</h2>
          
          <div className="space-y-4">
            {/* Movie Title */}
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-semibold text-gray-700">Movie:</span>
              <span className="text-lg font-bold text-bms-red">{booking.show?.movie?.title || 'N/A'}</span>
            </div>

            {/* Cinema */}
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-semibold text-gray-700">Cinema:</span>
              <span className="text-gray-800">{booking.show?.screen?.cinema?.name || 'N/A'}</span>
            </div>

            {/* Screen */}
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-semibold text-gray-700">Screen:</span>
              <span className="text-gray-800">{booking.show?.screen?.name || 'N/A'}</span>
            </div>

            {/* Date */}
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-semibold text-gray-700">Date:</span>
              <span className="text-gray-800">{formatDate(booking.show?.date)}</span>
            </div>

            {/* Time */}
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-semibold text-gray-700">Time:</span>
              <span className="text-gray-800">{formatTime(booking.show?.time)}</span>
            </div>

            {/* Seats */}
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-semibold text-gray-700">Seats:</span>
              <span className="text-gray-800 font-mono">{formatSeats(booking.seats)}</span>
            </div>

            {/* Status */}
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-semibold text-gray-700">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                booking.status === 'CONFIRMED' 
                  ? 'bg-green-100 text-green-800' 
                  : booking.status === 'CANCELLED'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {booking.status}
              </span>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="font-semibold text-gray-700">Total Amount:</span>
              <span className="text-lg font-bold text-bms-red">₹{booking.total || 0}</span>
            </div>

            {/* Booking Date */}
            <div className="flex justify-between items-center py-2">
              <span className="font-semibold text-gray-700">Booked On:</span>
              <span className="text-gray-800">{formatDate(booking.bookedAt)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/bookings')}
            className="bg-bms-red text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            View My Bookings
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            Book More Movies
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;