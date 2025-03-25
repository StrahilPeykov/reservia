import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const USER_KEY = 'booking_tracker_user';

class AuthService {
  // Register a new user
  async register(username, email, password) {
    return axios.post(`${API_URL}/auth/register`, {
      username,
      email,
      password
    });
  }

  // Login user
  async login(username, password) {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem(USER_KEY, JSON.stringify(response.data));
    }
    
    return response.data;
  }

  // Logout the current user
  logout() {
    localStorage.removeItem(USER_KEY);
  }

  // Get current user from localStorage
  getCurrentUser() {
    return JSON.parse(localStorage.getItem(USER_KEY));
  }

  // Check if user is logged in
  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user && !!user.token;
  }
}

export default new AuthService();