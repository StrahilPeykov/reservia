# Reservia - Library Space reservation System

A full-stack application for reservation library study spaces, built with Spring Boot and React.

## Features

- User Registration/Login with JWT-based authentication
- Browse available study spaces (rooms, pods, halls, etc.)
- Filter spaces by capacity, equipment, and noise level
- Book a study space with date and specific time slots
- View, cancel, and extend reservations
- Time-based availability checking

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.4.4
- Spring Data JPA
- Spring Security
- MySQL
- JWT Authentication
- Maven

### Frontend
- React 18
- React Router
- Axios
- Bootstrap 5
- React Bootstrap

### DevOps
- Docker and Docker Compose
- GitHub Actions

## Project Structure

```
reservia/
├── backend/                  # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/reservationtracker/
│   │   │   │   ├── config/   # Configuration classes
│   │   │   │   ├── controller/ # REST controllers
│   │   │   │   ├── dto/      # Data Transfer Objects
│   │   │   │   ├── exception/ # Exception handling
│   │   │   │   ├── model/    # Entity classes
│   │   │   │   ├── repository/ # JPA repositories
│   │   │   │   ├── security/ # Security configuration
│   │   │   │   └── service/  # Business logic
│   │   │   └── resources/    # Configuration files
│   │   └── test/             # Test classes
│   ├── Dockerfile            # Backend Dockerfile
│   └── pom.xml               # Maven configuration
├── frontend/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── App.js            # Main application
│   │   └── index.js          # Entry point
│   └── package.json          # NPM configuration
├── docker-compose.yml        # Docker Compose configuration
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 14 or higher
- Docker and Docker Compose
- MySQL (or use the provided Docker Compose setup)

### Running the Application with Docker

1. Clone the repository:
   ```bash
   git clone https://github.com/StrahilPeykov/reservia
   cd reservia
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up
   ```

3. The application will be available at:
   - Backend: http://localhost:8080
   - Frontend: http://localhost:3000

### Running the Backend Locally

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build the application:
   ```bash
   ./mvnw clean install
   ```

3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

The backend will be available at http://localhost:8080.

### Running the Frontend Locally

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at http://localhost:3000.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Study Spaces
- `GET /api/spaces` - Get all study spaces
- `GET /api/spaces/{id}` - Get study space by ID
- `GET /api/spaces/search?location={location}` - Search spaces by location
- `GET /api/spaces/search?name={name}` - Search spaces by name
- `GET /api/spaces/filter` - Filter spaces by type, capacity, and noise level

### Reservations
- `POST /api/reservations` - Create a new reservation
- `GET /api/reservations` - Get all reservations for the current user
- `GET /api/reservations/upcoming` - Get upcoming reservations 
- `DELETE /api/reservations/{id}` - Cancel a reservation
- `PUT /api/reservations/{id}` - Extend a reservation
- `POST /api/reservations/availability` - Check time slot availability

## License

This project is licensed under the MIT License.
