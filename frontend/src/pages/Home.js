import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      <Row className="mb-5">
        <Col className="text-center">
          <h1 className="display-4 mb-4">Welcome to Booking Tracker</h1>
          <p className="lead">
            Your one-stop solution for booking hotels and managing your reservations.
          </p>
          <Button as={Link} to="/hotels" variant="primary" size="lg" className="mt-3">
            Browse Hotels
          </Button>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Find Hotels</Card.Title>
              <Card.Text>
                Browse through our collection of handpicked hotels around the world.
              </Card.Text>
              <Button as={Link} to="/hotels" variant="outline-primary" className="mt-auto">
                Browse Hotels
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Book Your Stay</Card.Title>
              <Card.Text>
                Easy booking process with instant confirmation and best price guarantee.
              </Card.Text>
              <Button as={Link} to="/login" variant="outline-primary" className="mt-auto">
                Login to Book
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Manage Bookings</Card.Title>
              <Card.Text>
                View, modify or cancel your bookings easily from your dashboard.
              </Card.Text>
              <Button as={Link} to="/bookings" variant="outline-primary" className="mt-auto">
                My Bookings
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;