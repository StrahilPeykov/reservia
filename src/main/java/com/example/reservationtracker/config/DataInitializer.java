package com.example.reservationtracker.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.example.reservationtracker.model.StudySpace;
import com.example.reservationtracker.model.StudySpace.NoiseLevel;
import com.example.reservationtracker.repository.StudySpaceRepository;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {
    
    private final StudySpaceRepository studySpaceRepository;
    
    @Override
    public void run(String... args) {
        log.info("Checking if study spaces need to be initialized...");
        // Only add sample data if no study spaces exist
        if (studySpaceRepository.count() == 0) {
            log.info("No study spaces found. Creating sample data...");
            List<StudySpace> sampleSpaces = List.of(
                    createStudySpace(
                            "Quiet Reading Room",
                            "room",
                            "Main Library - 2nd Floor",
                            6,
                            "Power outlets, desk lamps, comfortable chairs",
                            NoiseLevel.SILENT,
                            "https://example.com/quiet-room.jpg"),
                    
                    createStudySpace(
                            "Group Study Pod A",
                            "pod",
                            "Science Building - 1st Floor",
                            4,
                            "Whiteboard, HDMI display, power outlets",
                            NoiseLevel.MODERATE,
                            "https://example.com/study-pod.jpg"),
                    
                    createStudySpace(
                            "Computer Lab",
                            "lab",
                            "Technology Center - Basement",
                            20,
                            "Desktop computers, printing station, scanning equipment",
                            NoiseLevel.QUIET,
                            "https://example.com/computer-lab.jpg"),
                    
                    createStudySpace(
                            "Collaborative Space",
                            "hall",
                            "Student Union - 3rd Floor",
                            12,
                            "Movable furniture, projector, surround sound system",
                            NoiseLevel.COLLABORATIVE,
                            "https://example.com/collab-space.jpg"),
                    
                    createStudySpace(
                            "Individual Study Carrel",
                            "carrel",
                            "Main Library - 3rd Floor",
                            1,
                            "Power outlet, desk lamp, privacy dividers",
                            NoiseLevel.SILENT,
                            "https://example.com/study-carrel.jpg"),
                    
                    createStudySpace(
                            "Media Studio",
                            "studio",
                            "Arts Building - 2nd Floor",
                            3,
                            "Audio equipment, video recording, green screen",
                            NoiseLevel.MODERATE,
                            "https://example.com/media-studio.jpg"),
                    
                    createStudySpace(
                            "Conference Room B",
                            "room",
                            "Business School - 4th Floor",
                            10,
                            "Conference table, video conferencing equipment, whiteboard wall",
                            NoiseLevel.QUIET,
                            "https://example.com/conference-room.jpg"),
                    
                    createStudySpace(
                            "Outdoor Study Garden",
                            "garden",
                            "Campus Center - Courtyard",
                            8,
                            "Wi-Fi access, weather-resistant furniture, shade umbrellas",
                            NoiseLevel.MODERATE,
                            "https://example.com/study-garden.jpg")
            );
            
            List<StudySpace> savedSpaces = studySpaceRepository.saveAll(sampleSpaces);
            log.info("Sample study spaces data initialized! Created {} spaces", savedSpaces.size());
        } else {
            log.info("Study spaces already exist. Skipping initialization.");
        }
    }
    
    private StudySpace createStudySpace(
            String name, 
            String type, 
            String location, 
            Integer capacity, 
            String equipment, 
            NoiseLevel noiseLevel, 
            String imageUrl) {
        
        StudySpace space = new StudySpace();
        space.setName(name);
        space.setType(type);
        space.setLocation(location);
        space.setCapacity(capacity);
        space.setEquipment(equipment);
        space.setNoiseLevel(noiseLevel);
        space.setImageUrl(imageUrl);
        return space;
    }
}