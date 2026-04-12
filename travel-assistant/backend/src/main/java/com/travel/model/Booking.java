package com.travel.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name = "bookings") @Data @NoArgsConstructor @AllArgsConstructor
public class Booking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") private User user;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "trip_plan_id") private TripPlan tripPlan;
    private String bookingType;
    private String bookingReference;
    private String fromLocation;
    private String toLocation;
    private LocalDate travelDate;
    private String departureTime;
    private String arrivalTime;
    private String operatorName;
    private String seatClass;
    private int passengers;
    private double totalAmount;
    private String paymentStatus = "PENDING";
    private String paymentMethod;
    private String transactionId;
    private String status = "PENDING";
    @Column(columnDefinition = "TEXT") private String passengerDetails;
    @Column(columnDefinition = "TEXT") private String seatNumbers;
    @Column(name = "booked_at") private LocalDateTime bookedAt = LocalDateTime.now();
}
