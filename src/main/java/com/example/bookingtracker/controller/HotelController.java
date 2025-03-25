package com.example.bookingtracker.controller;

import com.example.bookingtracker.model.Hotel;
import com.example.bookingtracker.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // For development only
public class HotelController {
    
    private final HotelService hotelService;
    
    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(hotelService.getAllHotels());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
        return hotelService.getHotelById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Hotel>> searchHotels(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String name) {
        
        if (location != null && !location.isEmpty()) {
            return ResponseEntity.ok(hotelService.searchHotelsByLocation(location));
        } else if (name != null && !name.isEmpty()) {
            return ResponseEntity.ok(hotelService.searchHotelsByName(name));
        }
        
        return ResponseEntity.ok(hotelService.getAllHotels());
    }
}