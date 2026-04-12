package com.travel.repository;
import com.travel.model.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;
public interface DestinationRepository extends JpaRepository<Destination, Long> {
    Optional<Destination> findByNameIgnoreCase(String name);
    List<Destination> findByTypeIgnoreCase(String type);
    List<Destination> findByStateIgnoreCase(String state);
    @Query("SELECT d FROM Destination d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.state) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.tags) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Destination> searchDestinations(String query);
    @Query("SELECT d FROM Destination d ORDER BY d.rating DESC")
    List<Destination> findTopRated();
}
