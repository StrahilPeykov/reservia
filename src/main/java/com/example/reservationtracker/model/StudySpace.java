package com.example.reservationtracker.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "study_spaces")
public class StudySpace {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String type;  // room, pod, hall, etc.
    
    @Column(nullable = false)
    private String location;
    
    @Column(nullable = false)
    private Integer capacity;
    
    @Column(columnDefinition = "TEXT")
    private String equipment;  // computers, whiteboards, projectors, etc.
    
    @Column(name = "noise_level")
    @Enumerated(EnumType.STRING)
    private NoiseLevel noiseLevel;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @OneToMany(mappedBy = "studySpace", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations = new ArrayList<>();
    
    public enum NoiseLevel {
        SILENT,
        QUIET,
        MODERATE,
        COLLABORATIVE
    }
}