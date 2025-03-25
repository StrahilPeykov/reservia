import api from './ApiService';

class BookingService {
  // Get user's bookings
  getUserBookings() {
    return api.get('/bookings');
  }

  // Create a new booking
  createBooking(bookingData) {
    return api.post('/bookings', bookingData);
  }

  // Cancel a booking
  cancelBooking(bookingId) {
    return api.delete(`/bookings/${bookingId}`);
  }
}

export default new BookingService();