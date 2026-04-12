package com.travel.controller;
import com.travel.dto.ApiResponse;
import com.travel.service.PoiService;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/pois") @CrossOrigin
public class PoiController {
    private final PoiService svc;
    public PoiController(PoiService s) { svc = s; }

    @GetMapping
    public ApiResponse<List<Map<String,Object>>> getNearby(
        @RequestParam double lat, @RequestParam double lon,
        @RequestParam(defaultValue = "HOTEL") String type,
        @RequestParam(defaultValue = "2000") int radius) {
        return ApiResponse.ok("POIs fetched", svc.getNearbyPois(lat, lon, type, radius));
    }

    @GetMapping("/wikipedia/{topic}")
    public ApiResponse<Map<String,Object>> getWiki(@PathVariable String topic) {
        return ApiResponse.ok("Wikipedia info fetched", svc.getWikipediaSummary(topic));
    }
}
