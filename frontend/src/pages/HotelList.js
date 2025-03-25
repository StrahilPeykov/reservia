import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HotelService from '../services/HotelService';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name'); // 'name' or 'location'
  
  useEffect(() => {
    loadHotels();
  }, []);
  
  const loadHotels = async () => {
    setLoading(true);
    try {
      const response = await HotelService.getAllHotels();
      setHotels(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load hotels. Please try again later.');
      console.error('Error loading hotels:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadHotels();
      return;
    }
    
    setLoading(true);
    try {
      let response;
      if (searchBy === 'name') {
        response = await HotelService.searchHotelsByName(searchTerm);
      } else {
        response = await HotelService.searchHotelsByLocation(searchTerm);
      }
      setHotels(response.data);
      setError('');
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Error searching hotels:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };
  
  return (
    <Container>
      <h1 className="mb-4">Hotels</h1>
      
      <Form className="mb-4">
        <Row>
          <Col md={8}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder={`Search by ${searchBy}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button variant="primary" onClick={handleSearch}>
                Search
              </Button>
            </InputGroup>
          </Col>
          <Col md={4}>
            <Form.Select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
            >
              <option value="name">Search by Name</option>
              <option value="location">Search by Location</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading hotels...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : hotels.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No hotels found. Try a different search term.
        </div>
      ) : (
        <Row>
          {hotels.map((hotel) => (
            <Col key={hotel.id} md={4} className="mb-4">
              <Card className="hotel-card">
                <Card.Img 
                  variant="top" 
                  src={hotel.imageUrl || 'https://via.placeholder.com/300x200?text=Hotel+Image'} 
                  alt={hotel.name}
                  className="hotel-img"
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{hotel.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{hotel.location}</Card.Subtitle>
                  <Card.Text>
                    {hotel.description && hotel.description.length > 100 
                      ? `${hotel.description.substring(0, 100)}...` 
                      : hotel.description}
                  </Card.Text>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <strong>${hotel.pricePerNight}</strong> / night
                      </div>
                      <div>
                        {[...Array(hotel.rating || 0)].map((_, i) => (
                          <i key={i} className="bi bi-star-fill text-warning"></i>
                        ))}
                      </div>
                    </div>
                    <Link to={`/hotels/${hotel.id}`}>
                      <Button variant="outline-primary" className="w-100">View Details</Button>
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default HotelList;