import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const BookingHistory = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings');
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load booking history');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated]);

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

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'CANCELLED' }
          : booking
      ));
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">��</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-4">Please log in to view your booking history.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-bms-red text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bms-red mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
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
            onClick={() => window.location.reload()}
            className="bg-bms-red text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Bookings</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-bms-red text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Book More Movies
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Yet</h2>
            <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-bms-red text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-bms-red mb-2">
                      {booking.show?.movie?.title || 'Unknown Movie'}
                    </h3>
                    <div className="text-gray-600 space-y-1">
                      <p><span className="font-semibold">Cinema:</span> {booking.show?.screen?.cinema?.name || 'N/A'}</p>
                      <p><span className="font-semibold">Screen:</span> {booking.show?.screen?.name || 'N/A'}</p>
                      <p><span className="font-semibold">Date:</span> {formatDate(booking.show?.date)}</p>
                      <p><span className="font-semibold">Time:</span> {formatTime(booking.show?.time)}</p>
                      <p><span className="font-semibold">Seats:</span> <span className="font-mono">{formatSeats(booking.seats)}</span></p>
                    </div>
                  </div>
                  
                  <div className="mt-4 lg:mt-0 lg:ml-6 text-right">
                    <div className="mb-2">
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
                    <div className="text-2xl font-bold text-bms-red mb-2">
                      ₹{booking.total || 0}
                    </div>
                    <div className="text-sm text-gray-500">
                      Booked on {formatDate(booking.bookedAt)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/booking/${booking.id}`)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                  >
                    View Details
                  </button>
                  {booking.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;