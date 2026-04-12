package com.travel.model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity @Table(name = "destinations") @Data @NoArgsConstructor @AllArgsConstructor
public class Destination {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true) private String name;
    private String state;
    private String country = "India";
    private String type;
    @Column(columnDefinition = "TEXT") private String description;
    private String imageUrl;
    private String thumbnailUrl;
    private double rating;
    private int reviewCount;
    private double latitude;
    private double longitude;
    private String bestSeason;
    private String climate;
    private String language;
    @Column(columnDefinition = "TEXT") private String famousPlaces;
    @Column(columnDefinition = "TEXT") private String localFood;
    @Column(columnDefinition = "TEXT") private String hotels;
    @Column(columnDefinition = "TEXT") private String festivals;
    @Column(columnDefinition = "TEXT") private String weatherByMonth;
    @Column(columnDefinition = "TEXT") private String recommendedDresses;
    @Column(columnDefinition = "TEXT") private String transportOptions;
    private int lowBudgetPerDay;
    private int midBudgetPerDay;
    private int luxuryBudgetPerDay;
    private String tags;
}
