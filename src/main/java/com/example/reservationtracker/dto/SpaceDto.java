package com.example.reservationtracker.dto;

import com.example.reservationtracker.model.StudySpace.NoiseLevel;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class SpaceDto {
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SpaceResponse {
        private Long id;
        private String name;
        private String type;
        private String location;
        private Integer capacity;
        private String equipment;
        private NoiseLevel noiseLevel;
        private String imageUrl;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SpaceRequest {
        @NotBlank(message = "Name is required")
        private String name;
        
        @NotBlank(message = "Type is required")
        private String type;
        
        @NotBlank(message = "Location is required")
        private String location;
        
        @NotNull(message = "Capacity is required")
        @Positive(message = "Capacity must be positive")
        private Integer capacity;
        
        private String equipment;
        
        @NotNull(message = "Noise level is required")
        private NoiseLevel noiseLevel;
        
        private String imageUrl;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SpaceFilterRequest {
        private String type;
        private Integer capacity;
        private NoiseLevel noiseLevel;
    }
}