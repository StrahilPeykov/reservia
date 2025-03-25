import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { username, email, password, confirmPassword } = formData;
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    try {
      await AuthService.register(username, email, password);
      setSuccess('Registration successful! You can now login.');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError(
        err.response?.data?.error ||
        Object.values(err.response?.data || {})[0] ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="auth-form-container">
      <h2 className="text-center mb-4">Register</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Form onSubmit={handleRegister}>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={username}
            onChange={onChange}
            required
            minLength="3"
          />
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength="6"
          />
          <Form.Text className="text-muted">
            Password must be at least 6 characters long.
          </Form.Text>
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
          />
        </Form.Group>
        
        <Button 
          variant="primary" 
          type="submit" 
          className="w-100" 
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </Form>
      
      <div className="text-center mt-3">
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </Container>
  );
};

export default Register;