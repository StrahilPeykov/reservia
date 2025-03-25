package com.example.reservationtracker.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.reservationtracker.dto.SpaceDto.SpaceFilterRequest;
import com.example.reservationtracker.dto.SpaceDto.SpaceResponse;
import com.example.reservationtracker.model.StudySpace;
import com.example.reservationtracker.model.StudySpace.NoiseLevel;
import com.example.reservationtracker.service.StudySpaceService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/spaces")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For development only
@Slf4j
public class StudySpaceController {
    
    private final StudySpaceService studySpaceService;
    
    @GetMapping
    public ResponseEntity<List<SpaceResponse>> getAllSpaces() {
        log.info("GET request received for all spaces");
        try {
            List<SpaceResponse> spaces = studySpaceService.getAllSpaces().stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
            log.info("Returning {} spaces", spaces.size());
            return ResponseEntity.ok(spaces);
        } catch (Exception e) {
            log.error("Error fetching all spaces", e);
            throw e;
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SpaceResponse> getSpaceById(@PathVariable Long id) {
        log.info("GET request received for space with ID: {}", id);
        return studySpaceService.getSpaceById(id)
                .map(this::mapToDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<SpaceResponse>> searchSpaces(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String name) {
        
        log.info("Search request received - location: {}, name: {}", location, name);
        List<StudySpace> spaces;
        
        if (location != null && !location.isEmpty()) {
            spaces = studySpaceService.searchSpacesByLocation(location);
        } else if (name != null && !name.isEmpty()) {
            spaces = studySpaceService.searchSpacesByName(name);
        } else {
            spaces = studySpaceService.getAllSpaces();
        }
        
        List<SpaceResponse> spaceResponses = spaces.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        
        log.info("Returning {} spaces for search", spaceResponses.size());
        return ResponseEntity.ok(spaceResponses);
    }
    
    @GetMapping("/filter")
    public ResponseEntity<List<SpaceResponse>> filterSpaces(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) NoiseLevel noiseLevel) {
        
        log.info("Filter request received - type: {}, capacity: {}, noiseLevel: {}", 
                type, capacity, noiseLevel);
        
        List<StudySpace> spaces = studySpaceService.getSpacesByFilters(type, capacity, noiseLevel);
        
        List<SpaceResponse> spaceResponses = spaces.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        
        log.info("Returning {} spaces for filter", spaceResponses.size());
        return ResponseEntity.ok(spaceResponses);
    }
    
    @PostMapping("/filter")
    public ResponseEntity<List<SpaceResponse>> filterSpacesPost(@RequestBody SpaceFilterRequest filterRequest) {
        log.info("POST filter request received: {}", filterRequest);
        
        List<StudySpace> spaces = studySpaceService.getSpacesByFilters(
                filterRequest.getType(),
                filterRequest.getCapacity(),
                filterRequest.getNoiseLevel());
        
        List<SpaceResponse> spaceResponses = spaces.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
        
        log.info("Returning {} spaces for POST filter", spaceResponses.size());
        return ResponseEntity.ok(spaceResponses);
    }
    
    private SpaceResponse mapToDto(StudySpace studySpace) {
        return new SpaceResponse(
                studySpace.getId(),
                studySpace.getName(),
                studySpace.getType(),
                studySpace.getLocation(),
                studySpace.getCapacity(),
                studySpace.getEquipment(),
                studySpace.getNoiseLevel(),
                studySpace.getImageUrl()
        );
    }
}