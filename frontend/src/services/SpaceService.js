import api from './ApiService';

class SpaceService {
  // Get all study spaces
  getAllSpaces() {
    console.log('Fetching all study spaces from:', `${api.defaults.baseURL}/spaces`);
    return api.get('/spaces')
      .catch(error => {
        console.error('Error fetching study spaces:', error.response || error);
        throw error;
      });
  }

  // Get study space by ID
  getSpaceById(id) {
    console.log(`Fetching study space with ID ${id} from: ${api.defaults.baseURL}/spaces/${id}`);
    return api.get(`/spaces/${id}`)
      .catch(error => {
        console.error(`Error fetching study space with ID ${id}:`, error.response || error);
        throw error;
      });
  }

  // Search spaces by location
  searchSpacesByLocation(location) {
    console.log(`Searching spaces by location '${location}' from: ${api.defaults.baseURL}/spaces/search?location=${location}`);
    return api.get(`/spaces/search?location=${location}`)
      .catch(error => {
        console.error(`Error searching spaces by location:`, error.response || error);
        throw error;
      });
  }

  // Search spaces by name
  searchSpacesByName(name) {
    console.log(`Searching spaces by name '${name}' from: ${api.defaults.baseURL}/spaces/search?name=${name}`);
    return api.get(`/spaces/search?name=${name}`)
      .catch(error => {
        console.error(`Error searching spaces by name:`, error.response || error);
        throw error;
      });
  }
  
  // Filter spaces by type, capacity, and noise level
  filterSpaces(type, capacity, noiseLevel) {
    let queryParams = new URLSearchParams();
    
    if (type) queryParams.append('type', type);
    if (capacity) queryParams.append('capacity', capacity);
    if (noiseLevel) queryParams.append('noiseLevel', noiseLevel);
    
    console.log(`Filtering spaces with params: ${queryParams.toString()} from: ${api.defaults.baseURL}/spaces/filter?${queryParams.toString()}`);
    return api.get(`/spaces/filter?${queryParams.toString()}`)
      .catch(error => {
        console.error(`Error filtering spaces:`, error.response || error);
        throw error;
      });
  }
  
  // Alternative method using POST for more complex filters
  filterSpacesPost(filterData) {
    console.log(`Filtering spaces with POST data:`, filterData);
    return api.post('/spaces/filter', filterData)
      .catch(error => {
        console.error(`Error filtering spaces with POST:`, error.response || error);
        throw error;
      });
  }
}

export default new SpaceService();