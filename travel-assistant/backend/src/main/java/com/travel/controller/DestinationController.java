package com.travel.controller;
import com.travel.dto.ApiResponse;
import com.travel.model.Destination;
import com.travel.service.DestinationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/destinations") @CrossOrigin
public class DestinationController {
    private final DestinationService svc;
    public DestinationController(DestinationService s) { svc = s; }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Destination>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok("OK", svc.getAll()));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Destination>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("OK", svc.getById(id)));
    }
    @GetMapping("/name/{name}")
    public ResponseEntity<ApiResponse<Destination>> getByName(@PathVariable String name) {
        return ResponseEntity.ok(ApiResponse.ok("OK", svc.getByName(name)));
    }
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Destination>>> search(@RequestParam String q) {
        return ResponseEntity.ok(ApiResponse.ok("OK", svc.search(q)));
    }
    @GetMapping("/top-rated")
    public ResponseEntity<ApiResponse<List<Destination>>> topRated() {
        return ResponseEntity.ok(ApiResponse.ok("OK", svc.getTopRated()));
    }
    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<Destination>>> byType(@PathVariable String type) {
        return ResponseEntity.ok(ApiResponse.ok("OK", svc.getByType(type)));
    }
}
