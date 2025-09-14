import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  socket = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinShow(showId) {
    if (this.socket) {
      this.socket.emit('joinShow', showId);
    }
  }

  leaveShow(showId) {
    if (this.socket) {
      this.socket.emit('leaveShow', showId);
    }
  }

  blockSeat(showId, seatNumber) {
    if (this.socket) {
      this.socket.emit('blockSeat', { showId, seatNumber });
    }
  }

  releaseSeat(showId, seatNumber) {
    if (this.socket) {
      this.socket.emit('releaseSeat', { showId, seatNumber });
    }
  }

  onSeatBlocked(callback) {
    if (this.socket) {
      this.socket.on('seatBlocked', callback);
    }
  }

  onSeatReleased(callback) {
    if (this.socket) {
      this.socket.on('seatReleased', callback);
    }
  }

  onSeatBooked(callback) {
    if (this.socket) {
      this.socket.on('seatBooked', callback);
    }
  }

  off(event) {
    if (this.socket) {
      this.socket.off(event);
    }
  }
}

const socketService = new SocketService();
export default socketService;
