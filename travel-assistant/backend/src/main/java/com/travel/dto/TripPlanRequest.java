package com.travel.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class TripPlanRequest {
    private String source;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private int numberOfPeople;
    private String budgetType;
    private String transportMode;
}
