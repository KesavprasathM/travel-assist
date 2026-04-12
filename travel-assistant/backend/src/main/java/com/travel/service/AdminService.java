package com.travel.service;

import com.travel.dto.AdminStatsDto;
import com.travel.model.*;
import com.travel.repository.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.time.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {
    private final UserRepository userRepo;
    private final BookingRepository bookingRepo;
    private final TripPlanRepository tripRepo;
    private final PaymentRepository paymentRepo;
    private final ReviewRepository reviewRepo;
    private final DestinationRepository destRepo;

    public AdminService(UserRepository u, BookingRepository b, TripPlanRepository t,
                        PaymentRepository p, ReviewRepository r, DestinationRepository d) {
        userRepo=u; bookingRepo=b; tripRepo=t; paymentRepo=p; reviewRepo=r; destRepo=d;
    }

    // ── Dashboard Statistics ──────────────────────────────
    public AdminStatsDto getDashboardStats() {
        AdminStatsDto stats = new AdminStatsDto();

        stats.setTotalUsers(userRepo.count());
        stats.setTotalBookings(bookingRepo.count());
        stats.setTotalTrips(tripRepo.count());
        stats.setTotalReviews(reviewRepo.count());

        // Revenue
        List<Payment> paid = paymentRepo.findByStatus("SUCCESS");
        double totalRev = paid.stream().mapToDouble(Payment::getAmount).sum();
        stats.setTotalRevenue(totalRev);
        stats.setAvgBookingValue(paid.isEmpty() ? 0 : totalRev / paid.size());

        // Booking status counts
        stats.setConfirmedBookings(bookingRepo.countByStatus("CONFIRMED"));
        stats.setCancelledBookings(bookingRepo.countByStatus("CANCELLED"));
        stats.setPendingPayments(bookingRepo.countByPaymentStatus("PENDING"));

        // Today's stats
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        List<Booking> todayBookings = bookingRepo.findBookingsAfter(startOfDay);
        stats.setTodayBookings(todayBookings.size());
        stats.setTodayRevenue(todayBookings.stream().mapToDouble(Booking::getTotalAmount).sum());

        // Top destination
        List<TripPlan> trips = tripRepo.findAll();
        String topDest = trips.stream()
            .collect(Collectors.groupingBy(TripPlan::getDestination, Collectors.counting()))
            .entrySet().stream().max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey).orElse("N/A");
        stats.setTopDestination(topDest);

        // Top transport
        List<Booking> bookings = bookingRepo.findAll();
        String topTransport = bookings.stream()
            .collect(Collectors.groupingBy(Booking::getBookingType, Collectors.counting()))
            .entrySet().stream().max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey).orElse("N/A");
        stats.setTopTransportMode(topTransport);

        // Active users (logged in last 30 days — based on trip plans)
        stats.setActiveUsers(userRepo.count());

        return stats;
    }

    // ── All Users ─────────────────────────────────────────
    public Page<User> getAllUsers(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (search != null && !search.isBlank())
            return userRepo.searchUsers(search, pageable);
        return userRepo.findAll(pageable);
    }

    // ── All Bookings with user + destination info ─────────
    public Page<Booking> getAllBookings(int page, int size, String status, String type) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("bookedAt").descending());
        if (status != null && !status.isBlank() && type != null && !type.isBlank())
            return bookingRepo.findByStatusAndBookingType(status, type, pageable);
        if (status != null && !status.isBlank())
            return bookingRepo.findByStatus(status, pageable);
        if (type != null && !type.isBlank())
            return bookingRepo.findByBookingType(type, pageable);
        return bookingRepo.findAll(pageable);
    }

    // ── All Trip Plans ────────────────────────────────────
    public Page<TripPlan> getAllTrips(int page, int size, String destination) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (destination != null && !destination.isBlank())
            return tripRepo.findByDestinationContainingIgnoreCase(destination, pageable);
        return tripRepo.findAll(pageable);
    }

    // ── All Payments ──────────────────────────────────────
    public Page<Payment> getAllPayments(int page, int size, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("initiatedAt").descending());
        if (status != null && !status.isBlank())
            return paymentRepo.findByStatus(status, pageable);
        return paymentRepo.findAll(pageable);
    }

    // ── Revenue by destination ────────────────────────────
    public List<Map<String,Object>> getRevenueByDestination() {
        List<TripPlan> trips = tripRepo.findAll();
        Map<String, Double> rev = new LinkedHashMap<>();
        for (TripPlan t : trips) {
            rev.merge(t.getDestination(), (double) t.getTotalBudget(), Double::sum);
        }
        return rev.entrySet().stream()
            .sorted(Map.Entry.<String,Double>comparingByValue().reversed())
            .limit(10)
            .map(e -> Map.of("destination",(Object)e.getKey(), "revenue",(Object)e.getValue()))
            .collect(Collectors.toList());
    }

    // ── Monthly booking trend ─────────────────────────────
    public List<Map<String,Object>> getMonthlyTrend() {
        List<Booking> all = bookingRepo.findAll();
        Map<String,Long> monthly = new LinkedHashMap<>();
        for (Booking b : all) {
            if (b.getBookedAt() != null) {
                String key = b.getBookedAt().getYear() + "-" + String.format("%02d", b.getBookedAt().getMonthValue());
                monthly.merge(key, 1L, Long::sum);
            }
        }
        return monthly.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .map(e -> Map.of("month",(Object)e.getKey(), "bookings",(Object)e.getValue()))
            .collect(Collectors.toList());
    }

    // ── User detail with full travel history ─────────────
    public Map<String,Object> getUserDetail(Long userId) {
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Map<String,Object> detail = new LinkedHashMap<>();
        detail.put("user", Map.of(
            "id", user.getId(), "name", user.getName(),
            "email", user.getEmail(), "phone", user.getPhone() != null ? user.getPhone() : "",
            "city", user.getCity() != null ? user.getCity() : "",
            "role", user.getRole(), "joinedAt", user.getCreatedAt().toString()
        ));
        detail.put("bookings", bookingRepo.findByUserIdOrderByBookedAtDesc(user.getId()));
        detail.put("trips", tripRepo.findByUserIdOrderByCreatedAtDesc(user.getId()));
        detail.put("payments", paymentRepo.findByUserIdOrderByInitiatedAtDesc(user.getId()));
        detail.put("reviews", reviewRepo.findByUserIdOrderByCreatedAtDesc(user.getId()));

        // Summary
        List<Payment> userPayments = paymentRepo.findByUserIdOrderByInitiatedAtDesc(user.getId());
        double totalSpent = userPayments.stream()
            .filter(p -> "SUCCESS".equals(p.getStatus()))
            .mapToDouble(Payment::getAmount).sum();
        detail.put("summary", Map.of(
            "totalBookings", bookingRepo.findByUserIdOrderByBookedAtDesc(user.getId()).size(),
            "totalTrips", tripRepo.findByUserIdOrderByCreatedAtDesc(user.getId()).size(),
            "totalSpent", totalSpent
        ));
        return detail;
    }

    // ── Block / Unblock user ──────────────────────────────
    public User toggleUserStatus(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        user.setEnabled(!user.isEnabled());
        return userRepo.save(user);
    }

    // ── Delete review ─────────────────────────────────────
    public void deleteReview(Long reviewId) { reviewRepo.deleteById(reviewId); }

    // ── Update destination ────────────────────────────────
    public Destination updateDestination(Long id, Destination updated) {
        Destination dest = destRepo.findById(id).orElseThrow();
        if (updated.getName() != null) dest.setName(updated.getName());
        if (updated.getDescription() != null) dest.setDescription(updated.getDescription());
        if (updated.getLowBudgetPerDay() > 0) dest.setLowBudgetPerDay(updated.getLowBudgetPerDay());
        if (updated.getMidBudgetPerDay() > 0) dest.setMidBudgetPerDay(updated.getMidBudgetPerDay());
        if (updated.getLuxuryBudgetPerDay() > 0) dest.setLuxuryBudgetPerDay(updated.getLuxuryBudgetPerDay());
        if (updated.getBestSeason() != null) dest.setBestSeason(updated.getBestSeason());
        if (updated.getImageUrl() != null) dest.setImageUrl(updated.getImageUrl());
        return destRepo.save(dest);
    }

    public Destination addDestination(Destination dest) { return destRepo.save(dest); }
    public void deleteDestination(Long id) { destRepo.deleteById(id); }
}
