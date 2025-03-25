import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert, Card, Nav, Badge } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import ReservationService from '../services/ReservationService';

const ReservationsDashboard = () => {
  const location = useLocation();
  
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.success || '');
  const [view, setView] = useState('upcoming'); // 'upcoming' or 'all'
  
  useEffect(() => {
    loadReservations();
  }, [view]);
  
  const loadReservations = async () => {
    setLoading(true);
    try {
      const response = view === 'upcoming' ? 
        await ReservationService.getUpcomingReservations() : 
        await ReservationService.getUserReservations();
      
      setReservations(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load reservations. Please try again later.');
      console.error('Error loading reservations:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }
    
    try {
      await ReservationService.cancelReservation(reservationId);
      setSuccess('Reservation cancelled successfully!');
      
      // Refresh reservations list
      loadReservations();
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Failed to cancel reservation. Please try again.'
      );
    }
  };
  
  // Format date to readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    return timeString;
  };
  
  // Get status badge
  const getStatusBadge = (status) => {
    let variant;
    switch (status) {
      case 'CONFIRMED':
        variant = 'success';
        break;
      case 'CANCELLED':
        variant = 'danger';
        break;
      case 'COMPLETED':
        variant = 'secondary';
        break;
      default:
        variant = 'primary';
    }
    
    return <Badge bg={variant}>{status}</Badge>;
  };
  
  return (
    <Container className="my-4">
      <h1 className="mb-4">My Reservations</h1>
      
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
      
      <Nav variant="tabs" className="mb-4">
        <Nav.Item>
          <Nav.Link 
            active={view === 'upcoming'} 
            onClick={() => setView('upcoming')}
          >
            Upcoming Reservations
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link 
            active={view === 'all'} 
            onClick={() => setView('all')}
          >
            All Reservations
          </Nav.Link>
        </Nav.Item>
      </Nav>
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading your reservations...</p>
        </div>
      ) : reservations.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <Card.Title>No Reservations Found</Card.Title>
            <Card.Text>
              {view === 'upcoming' 
                ? "You don't have any upcoming reservations."
                : "You haven't made any reservations yet. Start by browsing our study spaces!"}
            </Card.Text>
            <Button variant="primary" as={Link} to="/spaces">Browse Study Spaces</Button>
          </Card.Body>
        </Card>
      ) : (
        <Table responsive striped hover>
          <thead>
            <tr>
              <th>Space</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>
                  <Link to={`/spaces/${reservation.spaceId}`}>
                    {reservation.spaceName}
                  </Link>
                </td>
                <td>{formatDate(reservation.date)}</td>
                <td>
                  {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                </td>
                <td>
                  {getStatusBadge(reservation.status)}
                </td>
                <td>
                  {reservation.status === 'CONFIRMED' && (
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleCancelReservation(reservation.id)}
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

export default ReservationsDashboard;