import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SpaceList from './pages/SpaceList';
import SpaceDetail from './pages/SpaceDetail';
import ReservationForm from './pages/ReservationForm';
import ReservationsDashboard from './pages/ReservationsDashboard';
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
          <Route path="/spaces" element={<SpaceList />} />
          <Route path="/spaces/:id" element={<SpaceDetail />} />
          <Route 
            path="/reservations/new/:spaceId" 
            element={
              <PrivateRoute>
                <ReservationForm />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/reservations" 
            element={
              <PrivateRoute>
                <ReservationsDashboard />
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