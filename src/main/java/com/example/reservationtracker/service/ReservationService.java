package com.example.reservationtracker.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.reservationtracker.exception.ResourceNotFoundException;
import com.example.reservationtracker.model.Reservation;
import com.example.reservationtracker.model.StudySpace;
import com.example.reservationtracker.model.User;
import com.example.reservationtracker.repository.ReservationRepository;
import com.example.reservationtracker.repository.StudySpaceRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {
    
    private final ReservationRepository reservationRepository;
    private final StudySpaceRepository studySpaceRepository;
    private final UserService userService;
    
    public List<Reservation> getUserReservations() {
        User currentUser = userService.getCurrentUser();
        return reservationRepository.findByUserId(currentUser.getId());
    }
    
    public List<Reservation> getSpaceReservations(Long spaceId) {
        return reservationRepository.findByStudySpaceId(spaceId);
    }
    
    public Reservation createReservation(Long spaceId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        User currentUser = userService.getCurrentUser();
        
        // Check if study space exists
        StudySpace studySpace = studySpaceRepository.findById(spaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Study space not found"));
        
        // Check for time slot conflicts
        List<Reservation> overlappingReservations = reservationRepository.findOverlappingReservations(
                spaceId, date, startTime, endTime);
        
        if (!overlappingReservations.isEmpty()) {
            throw new IllegalStateException("The selected time slot is already booked");
        }
        
        // Create new reservation
        Reservation reservation = new Reservation();
        reservation.setUser(currentUser);
        reservation.setStudySpace(studySpace);
        reservation.setDate(date);
        reservation.setStartTime(startTime);
        reservation.setEndTime(endTime);
        reservation.setStatus(Reservation.ReservationStatus.CONFIRMED);
        
        return reservationRepository.save(reservation);
    }
    
    public Reservation cancelReservation(Long reservationId) {
        User currentUser = userService.getCurrentUser();
        
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));
        
        // Check if the reservation belongs to the current user
        if (!reservation.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("You can only cancel your own reservations");
        }
        
        // Check if the reservation is already cancelled
        if (reservation.getStatus() == Reservation.ReservationStatus.CANCELLED) {
            throw new IllegalStateException("Reservation is already cancelled");
        }
        
        // Cancel the reservation
        reservation.setStatus(Reservation.ReservationStatus.CANCELLED);
        return reservationRepository.save(reservation);
    }
    
    public Reservation extendReservation(Long reservationId, LocalTime newEndTime) {
        User currentUser = userService.getCurrentUser();
        
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found"));
        
        // Check if the reservation belongs to the current user
        if (!reservation.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("You can only extend your own reservations");
        }
        
        // Check if the reservation is confirmed
        if (reservation.getStatus() != Reservation.ReservationStatus.CONFIRMED) {
            throw new IllegalStateException("Only confirmed reservations can be extended");
        }
        
        // Check if the new end time is after the current end time
        if (newEndTime.isBefore(reservation.getEndTime()) || newEndTime.equals(reservation.getEndTime())) {
            throw new IllegalStateException("New end time must be later than the current end time");
        }
        
        // Check for conflicts with the extended time
        List<Reservation> overlappingReservations = reservationRepository.findOverlappingReservations(
                reservation.getStudySpace().getId(), 
                reservation.getDate(), 
                reservation.getEndTime(),  // Start from current end time
                newEndTime);
        
        if (!overlappingReservations.isEmpty()) {
            throw new IllegalStateException("Cannot extend reservation due to conflicts with other reservations");
        }
        
        // Update the reservation
        reservation.setEndTime(newEndTime);
        return reservationRepository.save(reservation);
    }
    
    public List<Reservation> getUpcomingReservations() {
        User currentUser = userService.getCurrentUser();
        return reservationRepository.findUpcomingReservations(
                currentUser.getId(), 
                LocalDate.now(), 
                LocalTime.now());
    }
}