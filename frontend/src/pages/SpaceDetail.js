import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SpaceService from '../services/SpaceService';
import AuthService from '../services/AuthService';

const SpaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const loadSpace = async () => {
      setLoading(true);
      try {
        const response = await SpaceService.getSpaceById(id);
        setSpace(response.data);
        setError('');
      } catch (err) {
        setError('Failed to load study space details. Please try again later.');
        console.error('Error loading study space:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadSpace();
  }, [id]);
  
  const handleReservation = () => {
    if (!AuthService.isAuthenticated()) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: { pathname: `/reservations/new/${id}` } } });
      return;
    }
    
    // Navigate to reservation form
    navigate(`/reservations/new/${id}`);
  };

  // Helper function to get appropriate badge color for noise level
  const getNoiseColorClass = (noiseLevel) => {
    switch (noiseLevel) {
      case 'SILENT':
        return 'success';
      case 'QUIET':
        return 'info';
      case 'MODERATE':
        return 'warning';
      case 'COLLABORATIVE':
        return 'danger';
      default:
        return 'secondary';
    }
  };
  
  if (loading) {
    return (
      <Container className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading study space details...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Button as={Link} to="/spaces" variant="secondary">
          Back to Study Spaces
        </Button>
      </Container>
    );
  }
  
  if (!space) {
    return (
      <Container className="my-5">
        <div className="alert alert-warning" role="alert">
          Study space not found.
        </div>
        <Button as={Link} to="/spaces" variant="secondary">
          Back to Study Spaces
        </Button>
      </Container>
    );
  }
  
  // Parse equipment string to array for display
  const equipmentList = space.equipment ? space.equipment.split(',').map(item => item.trim()) : [];
  
  return (
    <Container className="my-4">
      <Button as={Link} to="/spaces" variant="outline-secondary" className="mb-4">
        &larr; Back to Study Spaces
      </Button>
      
      <Card>
        <Row className="g-0">
          <Col md={5}>
            <img 
              src={space.imageUrl || 'https://via.placeholder.com/500x400?text=Study+Space'} 
              alt={space.name}
              className="img-fluid rounded-start"
              style={{ height: '100%', objectFit: 'cover' }}
            />
          </Col>
          <Col md={7}>
            <Card.Body>
              <Card.Title as="h2">{space.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{space.location}</Card.Subtitle>
              
              <div className="mb-3">
                <Badge bg="info" className="me-2">{space.type}</Badge>
                <Badge bg="secondary" className="me-2">Capacity: {space.capacity}</Badge>
                <Badge 
                  bg={getNoiseColorClass(space.noiseLevel)} 
                  className="me-2"
                >
                  {space.noiseLevel?.toLowerCase()}
                </Badge>
              </div>
              
              <h5 className="mt-4">Equipment & Amenities</h5>
              <ListGroup className="mb-4">
                {equipmentList.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    {item}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              
              <Button 
                variant="primary" 
                size="lg" 
                className="w-100 mt-3"
                onClick={handleReservation}
              >
                Book This Space
              </Button>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default SpaceDetail;