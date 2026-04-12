package com.travel.dto;
import lombok.Data;
@Data
public class PaymentRequest {
    private Long bookingId;
    private double amount;
    private String paymentMethod;
    private String cardNumber;
    private String cardExpiry;
    private String cardCvv;
    private String cardHolderName;
    private String upiId;
    private String bankName;
}
