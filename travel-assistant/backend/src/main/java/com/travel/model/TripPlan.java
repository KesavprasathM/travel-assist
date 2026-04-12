package com.travel.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name = "trip_plans") @Data @NoArgsConstructor @AllArgsConstructor
public class TripPlan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") private User user;
    private String source;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private int durationDays;
    private int numberOfPeople;
    private String budgetType;
    private int totalBudget;
    private String transportMode;
    private String status = "PLANNED";
    @Column(columnDefinition = "TEXT") private String dayWisePlan;
    @Column(columnDefinition = "TEXT") private String notes;
    @Column(name = "created_at") private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "updated_at") private LocalDateTime updatedAt = LocalDateTime.now();
}
