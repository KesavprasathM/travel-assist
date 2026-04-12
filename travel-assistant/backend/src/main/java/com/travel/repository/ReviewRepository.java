package com.travel.repository;
import com.travel.model.Review;
import org.springframework.data.jpa.repository.*;
import java.util.*;
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByDestinationNameIgnoreCaseOrderByCreatedAtDesc(String name);
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
}
