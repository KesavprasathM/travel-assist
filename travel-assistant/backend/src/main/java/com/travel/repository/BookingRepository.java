package com.travel.repository;
import com.travel.model.Booking;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import java.time.LocalDateTime;
import java.util.*;
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByBookedAtDesc(Long userId);
    Optional<Booking> findByBookingReference(String ref);
    List<Booking> findByTripPlanId(Long tripPlanId);
    long countByStatus(String status);
    long countByPaymentStatus(String status);
    Page<Booking> findByStatus(String status, Pageable p);
    Page<Booking> findByBookingType(String type, Pageable p);
    Page<Booking> findByStatusAndBookingType(String status, String type, Pageable p);
    @Query("SELECT b FROM Booking b WHERE b.bookedAt >= :since ORDER BY b.bookedAt DESC")
    List<Booking> findBookingsAfter(LocalDateTime since);
}
