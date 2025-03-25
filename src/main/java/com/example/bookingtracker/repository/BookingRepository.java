package com.example.bookingtracker.repository;

import com.example.bookingtracker.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUserId(Long userId);
    
    List<Booking> findByHotelId(Long hotelId);
    
    List<Booking> findByUserIdAndStatus(Long userId, Booking.BookingStatus status);
    
    // Find bookings for a specific hotel within a date range
    List<Booking> findByHotelIdAndCheckInDateLessThanEqualAndCheckOutDateGreaterThanEqual(
            Long hotelId, LocalDate endDate, LocalDate startDate);
}