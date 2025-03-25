import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert, Badge } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SpaceService from '../services/SpaceService';
import ReservationService from '../services/ReservationService';

const ReservationForm = () => {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  
  const [space, setSpace] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });
  
  const { date, startTime, endTime } = formData;
  
  useEffect(() => {
    const loadSpace = async () => {
      try {
        const response = await SpaceService.getSpaceById(spaceId);
        setSpace(response.data);
      } catch (err) {
        setError('Failed to load study space details.');
        console.error('Error loading study space:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadSpace();
  }, [spaceId]);
  
  useEffect(() => {
    // Load available time slots when date changes
    if (date) {
      loadTimeSlots();
    }
  }, [date]);
  
  const loadTimeSlots = async () => {
    try {
      const response = await ReservationService.checkAvailability(spaceId, date);
      setTimeSlots(response.data);
    } catch (err) {
      setError('Failed to load available time slots.');
      console.error('Error loading time slots:', err);
    }
  };
  
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Reset end time when start time changes
    if (name === 'startTime') {
      setFormData(prev => ({
        ...prev,
        endTime: ''
      }));
    }
  };
  
  // Get available start times
  const getAvailableStartTimes = () => {
    return timeSlots
      .filter(slot => slot.available)
      .map(slot => slot.startTime);
  };
  
  // Get available end times based on selected start time
  const getAvailableEndTimes = () => {
    if (!startTime) return [];
    
    const startTimeIndex = timeSlots.findIndex(slot => slot.startTime === startTime);
    if (startTimeIndex === -1) return [];
    
    // Find continuous available slots after start time
    const availableEndTimes = [];
    
    // Start from the slot after the selected start time
    for (let i = startTimeIndex + 1; i < timeSlots.length; i++) {
      if (!timeSlots[i].available) {
        break; // Stop at first unavailable slot
      }
      availableEndTimes.push(timeSlots[i].endTime);
    }
    
    return availableEndTimes;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    if (!startTime || !endTime) {
      setError('Please select both start and end time.');
      setSubmitting(false);
      return;
    }
    
    try {
      await ReservationService.createReservation({
        spaceId,
        date,
        startTime,
        endTime
      });
      
      navigate('/reservations', { state: { success: 'Reservation created successfully!' } });
      
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Failed to create reservation. Please try again.'
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
  
  if (!space) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          {error || 'Study space not found.'}
        </Alert>
        <Button as={Link} to="/spaces" variant="secondary">
          Back to Study Spaces
        </Button>
      </Container>
    );
  }
  
  return (
    <Container className="reservation-form my-4">
      <h2 className="mb-4">Reserve Study Space</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <img 
                src={space.imageUrl || 'https://via.placeholder.com/300x200?text=Study+Space'} 
                alt={space.name}
                className="img-fluid rounded"
              />
            </Col>
            <Col md={8}>
              <Card.Title>{space.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{space.location}</Card.Subtitle>
              <div className="mb-2">
                <Badge bg="info" className="me-1">{space.type}</Badge>
                <Badge bg="secondary" className="me-1">Capacity: {space.capacity}</Badge>
              </div>
              <div>
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
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="date">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={date}
            onChange={onChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </Form.Group>
        
        {date && (
          <>
            <Form.Group className="mb-3" controlId="startTime">
              <Form.Label>Start Time</Form.Label>
              <Form.Select
                name="startTime"
                value={startTime}
                onChange={onChange}
                required
                disabled={timeSlots.length === 0}
              >
                <option value="">Select start time</option>
                {getAvailableStartTimes().map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            {startTime && (
              <Form.Group className="mb-3" controlId="endTime">
                <Form.Label>End Time</Form.Label>
                <Form.Select
                  name="endTime"
                  value={endTime}
                  onChange={onChange}
                  required
                >
                  <option value="">Select end time</option>
                  {getAvailableEndTimes().map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
          </>
        )}
        
        <div className="d-grid gap-2">
          <Button 
            variant="primary" 
            type="submit" 
            disabled={submitting || !date || !startTime || !endTime}
          >
            {submitting ? 'Processing...' : 'Confirm Reservation'}
          </Button>
          <Button as={Link} to={`/spaces/${spaceId}`} variant="outline-secondary">
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default ReservationForm;