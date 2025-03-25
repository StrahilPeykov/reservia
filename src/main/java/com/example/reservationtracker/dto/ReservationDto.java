package com.example.reservationtracker.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

import com.example.reservationtracker.model.Reservation.ReservationStatus;

public class ReservationDto {
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservationResponse {
        private Long id;
        private Long userId;
        private String username;
        private Long spaceId;
        private String spaceName;
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
        private ReservationStatus status;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReservationRequest {
        @NotNull(message = "Study space ID is required")
        private Long spaceId;
        
        @NotNull(message = "Date is required")
        @FutureOrPresent(message = "Date must be today or in the future")
        private LocalDate date;
        
        @NotNull(message = "Start time is required")
        private LocalTime startTime;
        
        @NotNull(message = "End time is required")
        private LocalTime endTime;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExtendReservationRequest {
        @NotNull(message = "New end time is required")
        private LocalTime newEndTime;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AvailabilityRequest {
        @NotNull(message = "Study space ID is required")
        private Long spaceId;
        
        @NotNull(message = "Date is required")
        private LocalDate date;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimeSlot {
        private LocalTime startTime;
        private LocalTime endTime;
        private boolean available;
    }
}