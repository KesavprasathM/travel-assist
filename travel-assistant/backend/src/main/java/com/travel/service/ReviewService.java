package com.travel.service;
import com.travel.model.*;
import com.travel.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepo;
    private final UserRepository userRepo;
    public ReviewService(ReviewRepository rr, UserRepository ur) { reviewRepo=rr; userRepo=ur; }

    public Review addReview(String destName, int rating, String title, String content, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Review r = new Review();
        r.setUser(user); r.setDestinationName(destName);
        r.setRating(rating); r.setTitle(title); r.setContent(content);
        r.setVerified(true);
        return reviewRepo.save(r);
    }

    public List<Review> getByDestination(String name) { return reviewRepo.findByDestinationNameIgnoreCaseOrderByCreatedAtDesc(name); }
    public List<Review> getUserReviews(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return reviewRepo.findByUserIdOrderByCreatedAtDesc(user.getId());
    }
}
