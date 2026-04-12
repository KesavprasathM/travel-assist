package com.travel.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity @Table(name = "users") @Data @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Email @Column(unique = true) private String email;
    private String password;
    private String phone;
    private String city;
    private String avatar;
    private String role = "USER";
    private boolean enabled = true;
    @Column(name = "created_at") private LocalDateTime createdAt = LocalDateTime.now();
}
