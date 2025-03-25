import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Accordion, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SpaceService from '../services/SpaceService';

const SpaceList = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name'); // 'name' or 'location'
  
  // Filter states
  const [filters, setFilters] = useState({
    type: '',
    capacity: '',
    noiseLevel: ''
  });
  
  useEffect(() => {
    loadSpaces();
  }, []);
  
  const loadSpaces = async () => {
    setLoading(true);
    try {
      const response = await SpaceService.getAllSpaces();
      setSpaces(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load study spaces. Please try again later.');
      console.error('Error loading study spaces:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadSpaces();
      return;
    }
    
    setLoading(true);
    try {
      let response;
      if (searchBy === 'name') {
        response = await SpaceService.searchSpacesByName(searchTerm);
      } else {
        response = await SpaceService.searchSpacesByLocation(searchTerm);
      }
      setSpaces(response.data);
      setError('');
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Error searching spaces:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  const applyFilters = async () => {
    setLoading(true);
    try {
      // Filter out empty values
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );
      
      // Only apply filters if at least one is set
      if (Object.keys(activeFilters).length > 0) {
        const response = await SpaceService.filterSpaces(
          filters.type,
          filters.capacity,
          filters.noiseLevel
        );
        setSpaces(response.data);
      } else {
        // If no filters, load all spaces
        loadSpaces();
      }
      setError('');
    } catch (err) {
      setError('Failed to apply filters. Please try again.');
      console.error('Error filtering spaces:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const resetFilters = () => {
    setFilters({
      type: '',
      capacity: '',
      noiseLevel: ''
    });
    loadSpaces();
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };
  
  return (
    <Container>
      <h1 className="mb-4">Study Spaces</h1>
      
      <Row className="mb-4">
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
      
      <Accordion className="mb-4">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Advanced Filters</Accordion.Header>
          <Accordion.Body>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Space Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Types</option>
                    <option value="room">Room</option>
                    <option value="pod">Pod</option>
                    <option value="hall">Hall</option>
                    <option value="lab">Lab</option>
                    <option value="carrel">Carrel</option>
                    <option value="studio">Studio</option>
                    <option value="garden">Garden</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Minimum Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={filters.capacity}
                    onChange={handleFilterChange}
                    min="1"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Noise Level</Form.Label>
                  <Form.Select
                    name="noiseLevel"
                    value={filters.noiseLevel}
                    onChange={handleFilterChange}
                  >
                    <option value="">Any Noise Level</option>
                    <option value="SILENT">Silent</option>
                    <option value="QUIET">Quiet</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="COLLABORATIVE">Collaborative</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={resetFilters}>
                Reset
              </Button>
              <Button variant="primary" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading study spaces...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : spaces.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No study spaces found. Try different search terms or filters.
        </div>
      ) : (
        <Row>
          {spaces.map((space) => (
            <Col key={space.id} md={4} className="mb-4">
              <Card className="h-100">
                <Card.Img 
                  variant="top" 
                  src={space.imageUrl || 'https://via.placeholder.com/300x200?text=Study+Space'} 
                  alt={space.name}
                  className="space-img"
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{space.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{space.location}</Card.Subtitle>
                  
                  <div className="mb-2">
                    <Badge bg="info" className="me-1">{space.type}</Badge>
                    <Badge bg="secondary" className="me-1">Capacity: {space.capacity}</Badge>
                    <Badge 
                      bg={
                        space.noiseLevel === 'SILENT' ? 'success' : 
                        space.noiseLevel === 'QUIET' ? 'info' : 
                        space.noiseLevel === 'MODERATE' ? 'warning' : 
                        'danger'
                      }
                    >
                      {space.noiseLevel?.toLowerCase()}
                    </Badge>
                  </div>
                  
                  <Card.Text>
                    {space.equipment && (
                      <small className="text-muted">
                        <strong>Equipment:</strong> {space.equipment}
                      </small>
                    )}
                  </Card.Text>
                  
                  <div className="mt-auto">
                    <Link to={`/spaces/${space.id}`}>
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

export default SpaceList;