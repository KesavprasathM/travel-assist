package com.travel.controller;
import com.travel.dto.*;
import com.travel.model.Booking;
import com.travel.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.*;

@RestController @RequestMapping("/api/bookings") @CrossOrigin
public class BookingController {
    private final BookingService svc;
    public BookingController(BookingService s) { svc = s; }

    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> create(@RequestBody BookingRequest req, Principal p) {
        return ResponseEntity.ok(ApiResponse.ok("Booking confirmed", svc.createBooking(req, p.getName())));
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<Booking>>> getMyBookings(Principal p) {
        return ResponseEntity.ok(ApiResponse.ok("OK", svc.getUserBookings(p.getName())));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Booking>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("OK", svc.getById(id)));
    }
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Booking>> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled", svc.cancelBooking(id)));
    }
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Map<String,Object>>>> searchTransports(
        @RequestParam String from, @RequestParam String to,
        @RequestParam String date, @RequestParam String type) {
        return ResponseEntity.ok(ApiResponse.ok("OK", svc.searchTransports(from, to, date, type)));
    }
}
