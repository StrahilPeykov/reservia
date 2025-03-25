import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container>
      <Row className="mb-5">
        <Col className="text-center">
          <h1 className="display-4 mb-4">Welcome to Reservia</h1>
          <p className="lead">
            Your one-stop solution for reserving library study spaces and managing your reservations.
          </p>
          <Button as={Link} to="/spaces" variant="primary" size="lg" className="mt-3">
            Browse Study Spaces
          </Button>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Find Study Spaces</Card.Title>
              <Card.Text>
                Browse through our collection of available study rooms, pods, and collaborative spaces.
              </Card.Text>
              <Button as={Link} to="/spaces" variant="outline-primary" className="mt-auto">
                Browse Spaces
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title>Book Your Space</Card.Title>
              <Card.Text>
                Easy reserving process with time slot selection and instant confirmation.
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
              <Card.Title>Manage Reservations</Card.Title>
              <Card.Text>
                View, modify or cancel your reservations easily from your dashboard.
              </Card.Text>
              <Button as={Link} to="/reservations" variant="outline-primary" className="mt-auto">
                My Reservations
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;