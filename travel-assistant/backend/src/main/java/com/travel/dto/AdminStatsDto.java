package com.travel.dto;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class AdminStatsDto {
    private long totalUsers;
    private long totalBookings;
    private long totalTrips;
    private double totalRevenue;
    private long totalReviews;
    private long confirmedBookings;
    private long cancelledBookings;
    private long pendingPayments;
    private String topDestination;
    private String topTransportMode;
    private double avgBookingValue;
    private long todayBookings;
    private double todayRevenue;
    private long activeUsers;
}
