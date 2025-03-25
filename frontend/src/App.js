import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HotelList from './pages/HotelList';
import HotelDetail from './pages/HotelDetail';
import BookingForm from './pages/BookingForm';
import BookingsDashboard from './pages/BookingsDashboard';
import NotFound from './pages/NotFound';
import AuthService from './services/AuthService';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // Private route component
  const PrivateRoute = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <NavigationBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/hotels" element={<HotelList />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route 
            path="/bookings/new/:hotelId" 
            element={
              <PrivateRoute>
                <BookingForm />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/bookings" 
            element={
              <PrivateRoute>
                <BookingsDashboard />
              </PrivateRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;