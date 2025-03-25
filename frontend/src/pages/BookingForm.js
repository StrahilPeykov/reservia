import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import HotelService from '../services/HotelService';
import BookingService from '../services/BookingService';

const BookingForm = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    guests: 1
  });
  
  const { checkInDate, checkOutDate, guests } = formData;
  
  useEffect(() => {
    const loadHotel = async () => {
      try {
        const response = await HotelService.getHotelById(hotelId);
        setHotel(response.data);
      } catch (err) {
        setError('Failed to load hotel details.');
        console.error('Error loading hotel:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadHotel();
  }, [hotelId]);
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  // Calculate number of nights
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Calculate total price
  const calculateTotal = () => {
    if (!hotel) return 0;
    
    const nights = calculateNights();
    return (hotel.pricePerNight * nights * guests).toFixed(2);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setError('Check-out date must be after check-in date.');
      setSubmitting(false);
      return;
    }
    
    try {
      // The backend booking endpoint is not implemented yet
      // This is a placeholder for when it's ready
      await BookingService.createBooking({
        hotelId,
        checkInDate,
        checkOutDate,
        guests,
        totalPrice: calculateTotal()
      });
      
      navigate('/bookings', { state: { success: 'Booking created successfully!' } });
      
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Failed to create booking. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <Container className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading...</p>
      </Container>
    );
  }
  
  if (!hotel) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          {error || 'Hotel not found.'}
        </Alert>
        <Button as={Link} to="/hotels" variant="secondary">
          Back to Hotels
        </Button>
      </Container>
    );
  }
  
  return (
    <Container className="booking-form my-4">
      <h2 className="mb-4">Book Your Stay</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <img 
                src={hotel.imageUrl || 'https://via.placeholder.com/300x200?text=Hotel+Image'} 
                alt={hotel.name}
                className="img-fluid rounded"
              />
            </Col>
            <Col md={8}>
              <Card.Title>{hotel.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{hotel.location}</Card.Subtitle>
              <div className="mb-2">
                {[...Array(hotel.rating || 0)].map((_, i) => (
                  <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                ))}
              </div>
              <Card.Text>${hotel.pricePerNight} per night</Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="checkInDate">
              <Form.Label>Check-in Date</Form.Label>
              <Form.Control
                type="date"
                name="checkInDate"
                value={checkInDate}
                onChange={onChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="checkOutDate">
              <Form.Label>Check-out Date</Form.Label>
              <Form.Control
                type="date"
                name="checkOutDate"
                value={checkOutDate}
                onChange={onChange}
                min={checkInDate || new Date().toISOString().split('T')[0]}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        
        <Form.Group className="mb-3" controlId="guests">
          <Form.Label>Number of Guests</Form.Label>
          <Form.Control
            type="number"
            name="guests"
            value={guests}
            onChange={onChange}
            min="1"
            max="10"
            required
          />
        </Form.Group>
        
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Booking Summary</Card.Title>
            <Row className="mb-2">
              <Col>Price per night:</Col>
              <Col className="text-end">${hotel.pricePerNight}</Col>
            </Row>
            <Row className="mb-2">
              <Col>Number of nights:</Col>
              <Col className="text-end">{calculateNights()}</Col>
            </Row>
            <Row className="mb-2">
              <Col>Number of guests:</Col>
              <Col className="text-end">{guests}</Col>
            </Row>
            <hr />
            <Row className="fw-bold">
              <Col>Total:</Col>
              <Col className="text-end">${calculateTotal()}</Col>
            </Row>
          </Card.Body>
        </Card>
        
        <div className="d-grid gap-2">
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Processing...' : 'Confirm Booking'}
          </Button>
          <Button as={Link} to={`/hotels/${hotelId}`} variant="outline-secondary">
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default BookingForm;