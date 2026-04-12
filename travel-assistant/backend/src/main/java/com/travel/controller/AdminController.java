package com.travel.controller;

import com.travel.dto.*;
import com.travel.model.*;
import com.travel.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

/**
 * Admin Controller — ALL routes require ROLE_ADMIN JWT
 * Provides full visibility into users, bookings, payments, trips
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    public AdminController(AdminService s) { this.adminService = s; }

    // ── Dashboard Stats ────────────────────────────────────────
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminStatsDto>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.ok("Dashboard data", adminService.getDashboardStats()));
    }

    // ── Revenue by Destination ─────────────────────────────────
    @GetMapping("/revenue/by-destination")
    public ResponseEntity<ApiResponse<List<Map<String,Object>>>> revenueByDest() {
        return ResponseEntity.ok(ApiResponse.ok("OK", adminService.getRevenueByDestination()));
    }

    // ── Monthly Booking Trend ──────────────────────────────────
    @GetMapping("/trend/monthly")
    public ResponseEntity<ApiResponse<List<Map<String,Object>>>> monthlyTrend() {
        return ResponseEntity.ok(ApiResponse.ok("OK", adminService.getMonthlyTrend()));
    }

    // ── Users ──────────────────────────────────────────────────
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<User>>> getUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.ok("Users fetched", adminService.getAllUsers(page, size, search)));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Map<String,Object>>> getUserDetail(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("User detail", adminService.getUserDetail(id)));
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse<User>> toggleUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("User status updated", adminService.toggleUserStatus(id)));
    }

    // ── Bookings ───────────────────────────────────────────────
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<Page<Booking>>> getBookings(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String type) {
        return ResponseEntity.ok(ApiResponse.ok("Bookings fetched", adminService.getAllBookings(page, size, status, type)));
    }

    // ── Trips ──────────────────────────────────────────────────
    @GetMapping("/trips")
    public ResponseEntity<ApiResponse<Page<TripPlan>>> getTrips(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String destination) {
        return ResponseEntity.ok(ApiResponse.ok("Trips fetched", adminService.getAllTrips(page, size, destination)));
    }

    // ── Payments ───────────────────────────────────────────────
    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<Page<Payment>>> getPayments(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok("Payments fetched", adminService.getAllPayments(page, size, status)));
    }

    // ── Destination Management ─────────────────────────────────
    @PostMapping("/destinations")
    public ResponseEntity<ApiResponse<Destination>> addDestination(@RequestBody Destination dest) {
        return ResponseEntity.ok(ApiResponse.ok("Destination added", adminService.addDestination(dest)));
    }

    @PutMapping("/destinations/{id}")
    public ResponseEntity<ApiResponse<Destination>> updateDestination(@PathVariable Long id, @RequestBody Destination dest) {
        return ResponseEntity.ok(ApiResponse.ok("Destination updated", adminService.updateDestination(id, dest)));
    }

    @DeleteMapping("/destinations/{id}")
    public ResponseEntity<ApiResponse<String>> deleteDestination(@PathVariable Long id) {
        adminService.deleteDestination(id);
        return ResponseEntity.ok(ApiResponse.ok("Destination deleted", "OK"));
    }

    // ── Review Moderation ──────────────────────────────────────
    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<ApiResponse<String>> deleteReview(@PathVariable Long id) {
        adminService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.ok("Review deleted", "OK"));
    }
}
