import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const Seat = ({ status, onClick }) => {
  const getSeatColor = () => {
    switch (status) {
      case 'booked':
        return 'bg-gray-500 cursor-not-allowed';
      case 'selected':
        return 'bg-red-500';
      case 'blocked':
        return 'bg-yellow-500 cursor-not-allowed';
      default:
        return 'bg-gray-200 hover:bg-gray-300';
    }
  };

  return <div className={`w-8 h-8 rounded-t-lg ${getSeatColor()}`} onClick={onClick} />;
};

const SeatSelection = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const updateSeatStatus = useCallback((seatNumber, newStatus) => {
    setSeats(prevSeats =>
      prevSeats.map(seat =>
        seat.number === seatNumber ? { ...seat, status: newStatus } : seat
      )
    );
  }, []);

  useEffect(() => {
    socket.emit('joinShow', id);

    socket.on('seatBlocked', (seatNumber) => updateSeatStatus(seatNumber, 'blocked'));
    socket.on('seatReleased', (seatNumber) => updateSeatStatus(seatNumber, 'available'));
    socket.on('seatBooked', (bookedSeats) => {
        bookedSeats.forEach(seatNumber => updateSeatStatus(seatNumber, 'booked'));
    });

    return () => {
      socket.off('seatBlocked');
      socket.off('seatReleased');
      socket.off('seatBooked');
      socket.emit('leaveShow', id);
    };
  }, [id, updateSeatStatus]);

  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        const response = await api.get(`/shows/${id}/seats`);
        setShow(response.data.show);
        setSeats(response.data.seats);
      } catch (err) {
        setError('Failed to load seat information.');
      } finally {
        setLoading(false);
      }
    };
    fetchShowDetails();
  }, [id]);

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked' || seat.status === 'blocked') return;

    const isSelected = selectedSeats.some(s => s.number === seat.number);
    let newSelectedSeats;

    if (isSelected) {
      newSelectedSeats = selectedSeats.filter(s => s.number !== seat.number);
      socket.emit('releaseSeat', { showId: id, seatNumber: seat.number });
    } else {
      if (selectedSeats.length >= 6) {
        alert('You can select a maximum of 6 seats.');
        return;
      }
      newSelectedSeats = [...selectedSeats, seat];
      socket.emit('blockSeat', { showId: id, seatNumber: seat.number });
    }
    
    setSelectedSeats(newSelectedSeats);
    updateSeatStatus(seat.number, isSelected ? 'available' : 'selected');
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat.');
      return;
    }
  
    try {
      setLoading(true);
      const response = await api.post('/bookings', {
        showId: show.id,
        seats: selectedSeats
      });
      
      console.log('Booking created:', response.data);
      
      // Redirect to booking confirmation page
      navigate(`/booking/${response.data.id}`);
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.response?.data?.message || 'Failed to book seats.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading seats...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2">{show?.movie.title}</h1>
        <p className="text-lg text-gray-600 mb-6">{new Date(show?.date).toDateString()} at {new Date(show?.time).toLocaleTimeString()}</p>
        
        <div className="bg-gray-300 w-full max-w-lg h-2 mb-4 rounded-sm"></div>
        <p className="mb-8">SCREEN</p>
      
        <div className="grid grid-cols-10 gap-2">
            {seats.map(seat => (
            <Seat key={seat.number} status={selectedSeats.some(s => s.number === seat.number) ? 'selected' : seat.status} onClick={() => handleSeatClick(seat)} />
            ))}
        </div>

        <div className="flex justify-center space-x-4 my-6">
            <div className="flex items-center"><div className="w-4 h-4 bg-gray-200 mr-2 rounded-t-sm"></div>Available</div>
            <div className="flex items-center"><div className="w-4 h-4 bg-red-500 mr-2 rounded-t-sm"></div>Selected</div>
            <div className="flex items-center"><div className="w-4 h-4 bg-yellow-500 mr-2 rounded-t-sm"></div>Blocked</div>
            <div className="flex items-center"><div className="w-4 h-4 bg-gray-500 mr-2 rounded-t-sm"></div>Booked</div>
        </div>

        <button 
            onClick={handleBooking}
            className="mt-6 bg-red-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-red-700 disabled:bg-red-300"
            disabled={selectedSeats.length === 0}
        >
            Pay ₹{show?.price * selectedSeats.length}
        </button>
    </div>
  );
};

export default SeatSelection;
