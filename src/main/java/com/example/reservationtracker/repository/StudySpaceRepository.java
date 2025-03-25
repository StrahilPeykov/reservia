package com.example.reservationtracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.reservationtracker.model.StudySpace;
import com.example.reservationtracker.model.StudySpace.NoiseLevel;

import java.util.List;

@Repository
public interface StudySpaceRepository extends JpaRepository<StudySpace, Long> {
    
    List<StudySpace> findByLocationContainingIgnoreCase(String location);
    
    List<StudySpace> findByNameContainingIgnoreCase(String name);
    
    List<StudySpace> findByType(String type);
    
    List<StudySpace> findByNoiseLevel(NoiseLevel noiseLevel);
    
    List<StudySpace> findByCapacityGreaterThanEqual(Integer capacity);
    
    @Query("SELECT s FROM StudySpace s WHERE " +
           "(:type IS NULL OR s.type = :type) AND " +
           "(:capacity IS NULL OR s.capacity >= :capacity) AND " +
           "(:noiseLevel IS NULL OR s.noiseLevel = :noiseLevel)")
    List<StudySpace> findByFilters(
            @Param("type") String type,
            @Param("capacity") Integer capacity,
            @Param("noiseLevel") NoiseLevel noiseLevel);
}