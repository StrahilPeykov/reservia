import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Login = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { username, password } = formData;
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userData = await AuthService.login(username, password);
      setCurrentUser(userData);
      
      // Redirect to the page they were trying to access or to the home page
      const from = location.state?.from?.pathname || '/';
      navigate(from);
      
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="auth-form-container">
      <h2 className="text-center mb-4">Sign In</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={username}
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
          />
        </Form.Group>
        
        <Button 
          variant="primary" 
          type="submit" 
          className="w-100" 
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </Form>
      
      <div className="text-center mt-3">
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </Container>
  );
};

export default Login;