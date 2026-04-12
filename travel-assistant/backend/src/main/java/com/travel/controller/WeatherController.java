package com.travel.controller;
import com.travel.dto.ApiResponse;
import com.travel.service.WeatherService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api/weather") @CrossOrigin
public class WeatherController {
    private final WeatherService svc;
    public WeatherController(WeatherService s) { svc = s; }

    @GetMapping("/{city}")
    public ApiResponse<Map<String,Object>> getForecast(@PathVariable String city) {
        return ApiResponse.ok("Weather data fetched", svc.getLiveForecast(city));
    }

    @GetMapping("/coordinates/{city}")
    public ApiResponse<double[]> getCoords(@PathVariable String city) {
        return ApiResponse.ok("Coordinates fetched", svc.getCoordinates(city));
    }
}
