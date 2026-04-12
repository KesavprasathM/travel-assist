package com.travel.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity @Table(name = "reviews") @Data @NoArgsConstructor @AllArgsConstructor
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") private User user;
    private String destinationName;
    private int rating;
    private String title;
    @Column(columnDefinition = "TEXT") private String content;
    private boolean verified;
    @Column(name = "created_at") private LocalDateTime createdAt = LocalDateTime.now();
}
