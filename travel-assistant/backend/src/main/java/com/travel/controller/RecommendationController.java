package com.travel.controller;
import com.travel.dto.ApiResponse;
import com.travel.service.RecommendationService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api/recommendations") @CrossOrigin
public class RecommendationController {
    private final RecommendationService svc;
    public RecommendationController(RecommendationService s) { svc = s; }

    @GetMapping
    public ApiResponse<Map<String,Object>> recommend(
        @RequestParam String destination,
        @RequestParam(defaultValue = "MID") String budget,
        @RequestParam(defaultValue = "2") int people,
        @RequestParam(defaultValue = "") String from,
        @RequestParam(defaultValue = "5") int days,
        @RequestParam(defaultValue = "") String month) {
        return ApiResponse.ok("Recommendations generated", svc.recommend(destination, budget, people, from, days, month));
    }
}
