package com.travel.dto;
import lombok.Data;
import java.time.LocalDate;
@Data
public class BookingRequest {
    private Long tripPlanId;
    private String bookingType;
    private String fromLocation;
    private String toLocation;
    private LocalDate travelDate;
    private String departureTime;
    private String arrivalTime;
    private String operatorName;
    private String seatClass;
    private int passengers;
    private double totalAmount;
    private String passengerDetails;
}
