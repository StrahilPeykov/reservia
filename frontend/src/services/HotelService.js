import api from './ApiService';

class HotelService {
  // Get all hotels
  getAllHotels() {
    return api.get('/hotels');
  }

  // Get hotel by ID
  getHotelById(id) {
    return api.get(`/hotels/${id}`);
  }

  // Search hotels by location
  searchHotelsByLocation(location) {
    return api.get(`/hotels/search?location=${location}`);
  }

  // Search hotels by name
  searchHotelsByName(name) {
    return api.get(`/hotels/search?name=${name}`);
  }
}

export default new HotelService();