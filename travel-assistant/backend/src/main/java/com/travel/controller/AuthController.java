package com.travel.controller;
import com.travel.dto.*;
import com.travel.service.AuthService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth") @CrossOrigin
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService s) { authService = s; }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Registration successful", authService.register(req)));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody AuthRequest req) {
        return ResponseEntity.ok(ApiResponse.ok("Login successful", authService.login(req)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Object>> me(java.security.Principal principal) {
        var user = authService.getUserByEmail(principal.getName());
        return ResponseEntity.ok(ApiResponse.ok("OK", Map.of("id",user.getId(),"name",user.getName(),"email",user.getEmail(),"city",user.getCity(),"phone",user.getPhone())));
    }
}
