package com.example.reservationtracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.reservationtracker.model.Reservation;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    List<Reservation> findByUserId(Long userId);
    
    List<Reservation> findByStudySpaceId(Long spaceId);
    
    List<Reservation> findByUserIdAndStatus(Long userId, Reservation.ReservationStatus status);
    
    // Find reservations for a specific date
    List<Reservation> findByStudySpaceIdAndDate(Long spaceId, LocalDate date);
    
    // Find overlapping reservations
    @Query("SELECT r FROM Reservation r WHERE r.studySpace.id = :spaceId " +
           "AND r.date = :date " +
           "AND r.status = 'CONFIRMED' " +
           "AND ((r.startTime <= :endTime AND r.endTime > :startTime) OR " +
           "(r.startTime < :endTime AND r.endTime >= :startTime))")
    List<Reservation> findOverlappingReservations(
            @Param("spaceId") Long spaceId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);
    
    // Find a user's upcoming reservations
    @Query("SELECT r FROM Reservation r WHERE r.user.id = :userId " +
           "AND ((r.date > :currentDate) OR " +
           "(r.date = :currentDate AND r.endTime > :currentTime)) " +
           "AND r.status = 'CONFIRMED' " +
           "ORDER BY r.date ASC, r.startTime ASC")
    List<Reservation> findUpcomingReservations(
            @Param("userId") Long userId,
            @Param("currentDate") LocalDate currentDate,
            @Param("currentTime") LocalTime currentTime);
}