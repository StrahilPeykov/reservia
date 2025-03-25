import api from './ApiService';

class ReservationService {
  // Get user's reservations
  getUserReservations() {
    return api.get('/reservations');
  }
  
  // Get user's upcoming reservations
  getUpcomingReservations() {
    return api.get('/reservations/upcoming');
  }

  // Create a new reservation
  createReservation(reservationData) {
    return api.post('/reservations', reservationData);
  }

  // Cancel a reservation
  cancelReservation(reservationId) {
    return api.delete(`/reservations/${reservationId}`);
  }
  
  // Extend a reservation
  extendReservation(reservationId, newEndTime) {
    return api.put(`/reservations/${reservationId}`, { newEndTime });
  }
  
  // Check availability for a study space on a specific date
  checkAvailability(spaceId, date) {
    return api.post('/reservations/availability', { spaceId, date });
  }
  
  // Get reservations for a specific study space
  getSpaceReservations(spaceId) {
    return api.get(`/reservations/space/${spaceId}`);
  }
}

export default new ReservationService();