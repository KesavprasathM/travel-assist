package com.travel.service;
import com.travel.dto.PaymentRequest;
import com.travel.model.*;
import com.travel.repository.*;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PaymentService {
    private final PaymentRepository paymentRepo;
    private final BookingRepository bookingRepo;
    private final UserRepository userRepo;
    public PaymentService(PaymentRepository pr, BookingRepository br, UserRepository ur) { paymentRepo=pr;bookingRepo=br;userRepo=ur; }

    public Payment processPayment(PaymentRequest req, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Booking booking = bookingRepo.findById(req.getBookingId()).orElseThrow();

        Payment p = new Payment();
        p.setUser(user);
        p.setBooking(booking);
        p.setAmount(req.getAmount());
        p.setPaymentMethod(req.getPaymentMethod());
        p.setTransactionId("TXN" + UUID.randomUUID().toString().replace("-","").substring(0,12).toUpperCase());

        // Simulate payment processing
        boolean success = simulatePayment(req);
        p.setStatus(success ? "SUCCESS" : "FAILED");
        if (success) {
            p.setCompletedAt(LocalDateTime.now());
            if (req.getPaymentMethod().equals("CARD")) p.setCardLast4(req.getCardNumber().length() >= 4 ? req.getCardNumber().substring(req.getCardNumber().length()-4) : "****");
            if (req.getPaymentMethod().equals("UPI")) p.setUpiId(req.getUpiId());
            p.setBankName(req.getBankName());
            booking.setPaymentStatus("PAID");
            booking.setPaymentMethod(req.getPaymentMethod());
            booking.setTransactionId(p.getTransactionId());
            bookingRepo.save(booking);
        }
        p.setGatewayResponse(success ? "Payment processed successfully" : "Payment failed - please retry");
        return paymentRepo.save(p);
    }

    private boolean simulatePayment(PaymentRequest req) {
        // Simulate: fail if card ends with 0000 or UPI is invalid pattern
        if (req.getPaymentMethod().equals("CARD")) {
            String card = req.getCardNumber() != null ? req.getCardNumber().replaceAll("\\s","") : "";
            return card.length() == 16 && !card.endsWith("0000");
        }
        if (req.getPaymentMethod().equals("UPI")) {
            return req.getUpiId() != null && req.getUpiId().contains("@");
        }
        return true; // Netbanking/Wallet always succeed in simulation
    }

    public List<Payment> getUserPayments(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return paymentRepo.findByUserIdOrderByInitiatedAtDesc(user.getId());
    }
}
