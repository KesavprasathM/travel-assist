package com.travel.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity @Table(name = "payments") @Data @NoArgsConstructor @AllArgsConstructor
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") private User user;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "booking_id") private Booking booking;
    private String transactionId;
    private double amount;
    private String currency = "INR";
    private String paymentMethod;
    private String status = "PENDING";
    private String gatewayResponse;
    private String cardLast4;
    private String upiId;
    private String bankName;
    @Column(name = "initiated_at") private LocalDateTime initiatedAt = LocalDateTime.now();
    @Column(name = "completed_at") private LocalDateTime completedAt;
}
