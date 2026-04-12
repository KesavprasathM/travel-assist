package com.travel.repository;
import com.travel.model.TripPlan;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import java.util.*;
public interface TripPlanRepository extends JpaRepository<TripPlan, Long> {
    List<TripPlan> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<TripPlan> findByUserIdAndStatus(Long userId, String status);
    Page<TripPlan> findByDestinationContainingIgnoreCase(String dest, Pageable p);
}
