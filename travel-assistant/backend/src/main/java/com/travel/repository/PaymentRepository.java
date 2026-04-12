package com.travel.repository;
import com.travel.model.Payment;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import java.util.*;
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByUserIdOrderByInitiatedAtDesc(Long userId);
    Optional<Payment> findByTransactionId(String tid);
    List<Payment> findByStatus(String status);
    Page<Payment> findByStatus(String status, Pageable p);
}
