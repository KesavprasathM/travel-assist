package com.travel.controller;
import com.travel.dto.ApiResponse;
import com.travel.model.Review;
import com.travel.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.*;

@RestController @RequestMapping("/api/reviews") @CrossOrigin
public class ReviewController {
    private final ReviewService svc;
    public ReviewController(ReviewService s) { svc = s; }

    @PostMapping
    public ResponseEntity<ApiResponse<Review>> add(@RequestBody Map<String,Object> body, Principal p) {
        return ResponseEntity.ok(ApiResponse.ok("Review added", svc.addReview(
            (String)body.get("destination"), (Integer)body.get("rating"),
            (String)body.get("title"), (String)body.get("content"), p.getName())));
    }
    @GetMapping("/destination/{name}")
    public ResponseEntity<ApiResponse<List<Review>>> byDest(@PathVariable String name) {
        return ResponseEntity.ok(ApiResponse.ok("OK", svc.getByDestination(name)));
    }
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<Review>>> myReviews(Principal p) {
        return ResponseEntity.ok(ApiResponse.ok("OK", svc.getUserReviews(p.getName())));
    }
}
