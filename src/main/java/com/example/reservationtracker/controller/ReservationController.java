package com.example.reservationtracker.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.reservationtracker.dto.ReservationDto.AvailabilityRequest;
import com.example.reservationtracker.dto.ReservationDto.ExtendReservationRequest;
import com.example.reservationtracker.dto.ReservationDto.ReservationRequest;
import com.example.reservationtracker.dto.ReservationDto.ReservationResponse;
import com.example.reservationtracker.dto.ReservationDto.TimeSlot;
import com.example.reservationtracker.model.Reservation;
import com.example.reservationtracker.repository.ReservationRepository;
import com.example.reservationtracker.service.ReservationService;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For development only
public class ReservationController {
    
    private final ReservationService reservationService;
    private final ReservationRepository reservationRepository;
    
    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getUserReservations() {
        List<ReservationResponse> reservations = reservationService.getUserReservations().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reservations);
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<ReservationResponse>> getUpcomingReservations() {
        List<ReservationResponse> reservations = reservationService.getUpcomingReservations().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reservations);
    }
    
    @GetMapping("/space/{spaceId}")
    public ResponseEntity<List<ReservationResponse>> getSpaceReservations(@PathVariable Long spaceId) {
        List<ReservationResponse> reservations = reservationService.getSpaceReservations(spaceId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(reservations);
    }
    
    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(@Valid @RequestBody ReservationRequest request) {
        Reservation reservation = reservationService.createReservation(
                request.getSpaceId(),
                request.getDate(),
                request.getStartTime(),
                request.getEndTime()
        );
        
        return new ResponseEntity<>(mapToDto(reservation), HttpStatus.CREATED);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ReservationResponse> cancelReservation(@PathVariable Long id) {
        Reservation reservation = reservationService.cancelReservation(id);
        return ResponseEntity.ok(mapToDto(reservation));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ReservationResponse> extendReservation(
            @PathVariable Long id,
            @Valid @RequestBody ExtendReservationRequest request) {
        
        Reservation reservation = reservationService.extendReservation(id, request.getNewEndTime());
        return ResponseEntity.ok(mapToDto(reservation));
    }
    
    @PostMapping("/availability")
    public ResponseEntity<List<TimeSlot>> checkAvailability(@Valid @RequestBody AvailabilityRequest request) {
        // Get all reservations for the specified space and date
        List<Reservation> existingReservations = reservationRepository.findByStudySpaceIdAndDate(
                request.getSpaceId(), 
                request.getDate()
        );
        
        // Create time slots (e.g., 30-minute slots from 8:00 to 20:00)
        List<TimeSlot> timeSlots = generateTimeSlots();
        
        // Mark slots as unavailable if they overlap with existing reservations
        for (Reservation reservation : existingReservations) {
            if (reservation.getStatus() == Reservation.ReservationStatus.CONFIRMED) {
                for (TimeSlot slot : timeSlots) {
                    if (isOverlapping(slot, reservation)) {
                        slot.setAvailable(false);
                    }
                }
            }
        }
        
        return ResponseEntity.ok(timeSlots);
    }
    
    private List<TimeSlot> generateTimeSlots() {
        List<TimeSlot> slots = new ArrayList<>();
        LocalTime startOfDay = LocalTime.of(8, 0); // 8:00 AM
        LocalTime endOfDay = LocalTime.of(20, 0);  // 8:00 PM
        
        // Create 30-minute slots
        LocalTime slotStart = startOfDay;
        while (slotStart.isBefore(endOfDay)) {
            LocalTime slotEnd = slotStart.plusMinutes(30);
            slots.add(new TimeSlot(slotStart, slotEnd, true)); // Initially all slots are available
            slotStart = slotEnd;
        }
        
        return slots;
    }
    
    private boolean isOverlapping(TimeSlot slot, Reservation reservation) {
        // Check if the time slot overlaps with the reservation
        return !(slot.getEndTime().compareTo(reservation.getStartTime()) <= 0 || 
                 slot.getStartTime().compareTo(reservation.getEndTime()) >= 0);
    }
    
    private ReservationResponse mapToDto(Reservation reservation) {
        return new ReservationResponse(
                reservation.getId(),
                reservation.getUser().getId(),
                reservation.getUser().getUsername(),
                reservation.getStudySpace().getId(),
                reservation.getStudySpace().getName(),
                reservation.getDate(),
                reservation.getStartTime(),
                reservation.getEndTime(),
                reservation.getStatus()
        );
    }
}