import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import BookingService from '../services/BookingService';

const BookingsDashboard = () => {
  const location = useLocation();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.success || '');
  
  useEffect(() => {
    loadBookings();
  }, []);
  
  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await BookingService.getUserBookings();
      setBookings(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load bookings. Please try again later.');
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      await BookingService.cancelBooking(bookingId);
      setSuccess('Booking cancelled successfully!');
      
      // Refresh bookings list
      loadBookings();
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Failed to cancel booking. Please try again.'
      );
    }
  };
  
  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <Container className="my-4">
      <h1 className="mb-4">My Bookings</h1>
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess('')} dismissible>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <Card.Title>No Bookings Found</Card.Title>
            <Card.Text>
              You don't have any bookings yet. Start by browsing our hotels and book your stay!
            </Card.Text>
            <Button variant="primary" href="/hotels">Browse Hotels</Button>
          </Card.Body>
        </Card>
      ) : (
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>Hotel</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Guests</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.hotel.name}</td>
                <td>{formatDate(booking.checkInDate)}</td>
                <td>{formatDate(booking.checkOutDate)}</td>
                <td>{booking.guests}</td>
                <td>${booking.totalPrice}</td>
                <td>
                  <span className={`badge ${
                    booking.status === 'CONFIRMED' ? 'bg-success' :
                    booking.status === 'CANCELLED' ? 'bg-danger' :
                    'bg-secondary'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  {booking.status === 'CONFIRMED' && (
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default BookingsDashboard;