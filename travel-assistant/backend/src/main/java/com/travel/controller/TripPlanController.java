package com.travel.controller;
import com.travel.dto.*;
import com.travel.model.TripPlan;
import com.travel.service.TripPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController @RequestMapping("/api/trips") @CrossOrigin
public class TripPlanController {
    private final TripPlanService svc;
    public TripPlanController(TripPlanService s) { svc = s; }

    @PostMapping
    public ResponseEntity<ApiResponse<TripPlan>> create(@RequestBody TripPlanRequest req, Principal p) {
        return ResponseEntity.ok(ApiResponse.ok("Trip plan created", svc.createPlan(req, p.getName())));
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<TripPlan>>> getMyPlans(Principal p) {
        return ResponseEntity.ok(ApiResponse.ok("OK", svc.getUserPlans(p.getName())));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TripPlan>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("OK", svc.getPlanById(id)));
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TripPlan>> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.ok("Status updated", svc.updateStatus(id, status)));
    }
}
