package com.travel.controller;
import com.travel.dto.*;
import com.travel.model.Payment;
import com.travel.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController @RequestMapping("/api/payments") @CrossOrigin
public class PaymentController {
    private final PaymentService svc;
    public PaymentController(PaymentService s) { svc = s; }

    @PostMapping
    public ResponseEntity<ApiResponse<Payment>> process(@RequestBody PaymentRequest req, Principal p) {
        return ResponseEntity.ok(ApiResponse.ok("Payment processed", svc.processPayment(req, p.getName())));
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<Payment>>> getMyPayments(Principal p) {
        return ResponseEntity.ok(ApiResponse.ok("OK", svc.getUserPayments(p.getName())));
    }
}
