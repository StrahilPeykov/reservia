import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import HotelService from '../services/HotelService';
import AuthService from '../services/AuthService';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const loadHotel = async () => {
      setLoading(true);
      try {
        const response = await HotelService.getHotelById(id);
        setHotel(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load hotel details. Please try again later.');
        console.error('Error loading hotel:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadHotel();
  }, [id]);
  
  const handleBookNow = () => {
    if (!AuthService.isAuthenticated()) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: { pathname: `/bookings/new/${id}` } } });
      return;
    }
    
    // Navigate to booking form
    navigate(`/bookings/new/${id}`);
  };
  
  if (loading) {
    return (
      <Container className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading hotel details...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Button as={Link} to="/hotels" variant="secondary">
          Back to Hotels
        </Button>
      </Container>
    );
  }
  
  if (!hotel) {
    return (
      <Container className="my-5">
        <div className="alert alert-warning" role="alert">
          Hotel not found.
        </div>
        <Button as={Link} to="/hotels" variant="secondary">
          Back to Hotels
        </Button>
      </Container>
    );
  }
  
  // Parse amenities string to array
  const amenitiesList = hotel.amenities ? hotel.amenities.split(',').map(item => item.trim()) : [];
  
  return (
    <Container className="my-4">
      <Button as={Link} to="/hotels" variant="outline-secondary" className="mb-4">
        &larr; Back to Hotels
      </Button>
      
      <Card>
        <Row className="g-0">
          <Col md={5}>
            <img 
              src={hotel.imageUrl || 'https://via.placeholder.com/500x400?text=Hotel+Image'} 
              alt={hotel.name}
              className="img-fluid rounded-start"
              style={{ height: '100%', objectFit: 'cover' }}
            />
          </Col>
          <Col md={7}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <Card.Title as="h2">{hotel.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{hotel.location}</Card.Subtitle>
                </div>
                <div className="text-end">
                  <h3 className="text-primary">${hotel.pricePerNight}</h3>
                  <span className="text-muted">per night</span>
                </div>
              </div>
              
              <div className="mb-3">
                {[...Array(hotel.rating || 0)].map((_, i) => (
                  <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                ))}
              </div>
              
              <Card.Text>{hotel.description}</Card.Text>
              
              <h5 className="mt-4">Amenities</h5>
              <Row className="mb-4">
                {amenitiesList.map((amenity, index) => (
                  <Col key={index} xs={6} md={4} className="mb-2">
                    <Badge bg="light" text="dark" className="p-2">
                      {amenity}
                    </Badge>
                  </Col>
                ))}
              </Row>
              
              <Button 
                variant="primary" 
                size="lg" 
                className="w-100 mt-3"
                onClick={handleBookNow}
              >
                Book Now
              </Button>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default HotelDetail;