package com.travel.controller;
import com.travel.dto.ApiResponse;
import com.travel.service.DisasterAlertService;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/disasters") @CrossOrigin
public class DisasterController {
    private final DisasterAlertService svc;
    public DisasterController(DisasterAlertService s) { svc = s; }

    @GetMapping("/alerts/{destination}")
    public ApiResponse<List<Map<String,Object>>> getAlerts(@PathVariable String destination) {
        return ApiResponse.ok("Disaster alerts fetched", svc.getAlertsForDestination(destination));
    }
}
