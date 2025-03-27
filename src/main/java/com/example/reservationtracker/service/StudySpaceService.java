package com.example.reservationtracker.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.reservationtracker.model.StudySpace;
import com.example.reservationtracker.model.StudySpace.NoiseLevel;
import com.example.reservationtracker.repository.StudySpaceRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudySpaceService {
    
    private final StudySpaceRepository studySpaceRepository;
    
    public List<StudySpace> getAllSpaces() {
        return studySpaceRepository.findAll();
    }
    
    public Optional<StudySpace> getSpaceById(Long id) {
        return studySpaceRepository.findById(id);
    }
    
    public List<StudySpace> searchSpacesByLocation(String location) {
        return studySpaceRepository.findByLocationContainingIgnoreCase(location);
    }
    
    public List<StudySpace> searchSpacesByName(String name) {
        return studySpaceRepository.findByNameContainingIgnoreCase(name);
    }
    
    public List<StudySpace> getSpacesByType(String type) {
        return studySpaceRepository.findByType(type);
    }
    
    public List<StudySpace> getSpacesByNoiseLevel(NoiseLevel noiseLevel) {
        return studySpaceRepository.findByNoiseLevel(noiseLevel);
    }
    
    public List<StudySpace> getSpacesByMinCapacity(Integer capacity) {
        return studySpaceRepository.findByCapacityGreaterThanEqual(capacity);
    }
    
    public List<StudySpace> getSpacesByFilters(String type, Integer capacity, NoiseLevel noiseLevel) {
        return studySpaceRepository.findByFilters(type, capacity, noiseLevel);
    }
    public Page<StudySpace> getAllSpacesPaged(Pageable pageable) {
        return studySpaceRepository.findAll(pageable);
    }
}