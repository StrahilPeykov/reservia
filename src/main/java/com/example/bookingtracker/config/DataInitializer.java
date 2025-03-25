package com.example.bookingtracker.config;

import com.example.bookingtracker.model.Hotel;
import com.example.bookingtracker.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final HotelRepository hotelRepository;
    
    @Override
    public void run(String... args) {
        // Only add sample data if no hotels exist
        if (hotelRepository.count() == 0) {
            List<Hotel> sampleHotels = List.of(
                    createHotel("Grand Plaza Hotel", "New York", 
                            "Luxury hotel in the heart of Manhattan with stunning city views.",
                            new BigDecimal("299.99"), 5,
                            "Free WiFi, Pool, Spa, Restaurant, Fitness Center",
                            "https://example.com/hotel1.jpg"),
                    
                    createHotel("Seaside Resort", "Miami", 
                            "Beautiful beachfront resort with direct access to the ocean.",
                            new BigDecimal("199.99"), 4,
                            "Private Beach, Pool, Restaurant, Bar, Room Service",
                            "https://example.com/hotel2.jpg"),
                    
                    createHotel("Mountain View Lodge", "Denver", 
                            "Cozy lodge with panoramic mountain views and outdoor activities.",
                            new BigDecimal("149.99"), 4,
                            "Fireplace, Hiking Trails, Restaurant, Free Parking",
                            "https://example.com/hotel3.jpg"),
                    
                    createHotel("City Center Suites", "Chicago", 
                            "Modern all-suite hotel located in downtown Chicago.",
                            new BigDecimal("179.99"), 4,
                            "Kitchenette, Free WiFi, Business Center, Gym",
                            "https://example.com/hotel4.jpg"),
                    
                    createHotel("Palm Paradise", "Los Angeles", 
                            "Trendy hotel with rooftop pool and celebrity spotting opportunities.",
                            new BigDecimal("249.99"), 5,
                            "Rooftop Pool, Celebrity Chef Restaurant, Spa, Valet Parking",
                            "https://example.com/hotel5.jpg")
            );
            
            hotelRepository.saveAll(sampleHotels);
            System.out.println("Sample hotels data initialized!");
        }
    }
    
    private Hotel createHotel(String name, String location, String description, 
                             BigDecimal price, Integer rating, String amenities, String imageUrl) {
        Hotel hotel = new Hotel();
        hotel.setName(name);
        hotel.setLocation(location);
        hotel.setDescription(description);
        hotel.setPricePerNight(price);
        hotel.setRating(rating);
        hotel.setAmenities(amenities);
        hotel.setImageUrl(imageUrl);
        return hotel;
    }
}