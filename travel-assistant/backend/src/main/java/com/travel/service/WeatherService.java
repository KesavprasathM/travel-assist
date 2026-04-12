package com.travel.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Weather Service using Open-Meteo (https://open-meteo.com/)
 * 100% FREE, no API key required, open source data
 */
@Service
public class WeatherService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    // Step 1: geocode city → lat/lon via OpenStreetMap Nominatim (free, no key)
    public double[] getCoordinates(String city) {
        try {
            String url = "https://nominatim.openstreetmap.org/search?q="
                    + city.replace(" ", "+") + ",India&format=json&limit=1";
            String json = restTemplate.getForObject(url, String.class);
            JsonNode arr = mapper.readTree(json);
            if (arr.isArray() && arr.size() > 0) {
                double lat = arr.get(0).get("lat").asDouble();
                double lon = arr.get(0).get("lon").asDouble();
                return new double[]{lat, lon};
            }
        } catch (Exception e) {
            // fallback: use known coordinates
        }
        // Fallback coordinates for major cities
        Map<String, double[]> fallback = Map.of(
            "goa", new double[]{15.2993, 74.1240},
            "manali", new double[]{32.2432, 77.1892},
            "jaipur", new double[]{26.9124, 75.7873},
            "kerala", new double[]{10.8505, 76.2711},
            "agra", new double[]{27.1767, 78.0081},
            "varanasi", new double[]{25.3176, 82.9739},
            "darjeeling", new double[]{27.0410, 88.2663},
            "rishikesh", new double[]{30.0869, 78.2676},
            "mysuru", new double[]{12.2958, 76.6394},
            "bengaluru", new double[]{12.9716, 77.5946}
        );
        return fallback.getOrDefault(city.toLowerCase(), new double[]{20.5937, 78.9629});
    }

    // Step 2: Get live 7-day forecast from Open-Meteo
    public Map<String, Object> getLiveForecast(String city) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            double[] coords = getCoordinates(city);
            double lat = coords[0], lon = coords[1];

            String url = UriComponentsBuilder.fromHttpUrl("https://api.open-meteo.com/v1/forecast")
                .queryParam("latitude", lat)
                .queryParam("longitude", lon)
                .queryParam("daily", "temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,windspeed_10m_max")
                .queryParam("current_weather", true)
                .queryParam("timezone", "Asia/Kolkata")
                .queryParam("forecast_days", 7)
                .toUriString();

            String json = restTemplate.getForObject(url, String.class);
            JsonNode root = mapper.readTree(json);

            // Current weather
            JsonNode current = root.get("current_weather");
            if (current != null) {
                result.put("currentTemp", current.get("temperature").asDouble());
                result.put("currentWindspeed", current.get("windspeed").asDouble());
                result.put("currentWeatherCode", current.get("weathercode").asInt());
                result.put("currentDescription", getWeatherDescription(current.get("weathercode").asInt()));
                result.put("currentIcon", getWeatherIcon(current.get("weathercode").asInt()));
            }

            // 7-day forecast
            JsonNode daily = root.get("daily");
            if (daily != null) {
                List<Map<String, Object>> forecast = new ArrayList<>();
                JsonNode dates = daily.get("time");
                JsonNode maxTemps = daily.get("temperature_2m_max");
                JsonNode minTemps = daily.get("temperature_2m_min");
                JsonNode precip = daily.get("precipitation_sum");
                JsonNode codes = daily.get("weathercode");
                JsonNode wind = daily.get("windspeed_10m_max");

                for (int i = 0; i < dates.size(); i++) {
                    Map<String, Object> day = new LinkedHashMap<>();
                    day.put("date", dates.get(i).asText());
                    day.put("maxTemp", maxTemps.get(i).asDouble());
                    day.put("minTemp", minTemps.get(i).asDouble());
                    day.put("precipitation", precip.get(i).asDouble());
                    day.put("windspeed", wind.get(i).asDouble());
                    int code = codes.get(i).asInt();
                    day.put("weatherCode", code);
                    day.put("description", getWeatherDescription(code));
                    day.put("icon", getWeatherIcon(code));
                    day.put("travelScore", calcTravelScore(maxTemps.get(i).asDouble(), precip.get(i).asDouble(), code));
                    forecast.add(day);
                }
                result.put("forecast", forecast);
            }

            result.put("city", city);
            result.put("latitude", lat);
            result.put("longitude", lon);
            result.put("source", "Open-Meteo (open source, no API key)");
            result.put("success", true);

        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Weather data unavailable: " + e.getMessage());
            result.put("city", city);
        }
        return result;
    }

    // Weather code → human description (WMO codes)
    private String getWeatherDescription(int code) {
        if (code == 0) return "Clear Sky";
        if (code <= 3) return "Partly Cloudy";
        if (code <= 49) return "Foggy / Misty";
        if (code <= 59) return "Drizzle";
        if (code <= 69) return "Rain";
        if (code <= 79) return "Snow";
        if (code <= 84) return "Rain Showers";
        if (code <= 94) return "Thunderstorm";
        return "Heavy Thunderstorm";
    }

    private String getWeatherIcon(int code) {
        if (code == 0) return "☀️";
        if (code <= 3) return "⛅";
        if (code <= 49) return "🌫️";
        if (code <= 59) return "🌦️";
        if (code <= 69) return "🌧️";
        if (code <= 79) return "❄️";
        if (code <= 84) return "🌦️";
        return "⛈️";
    }

    // Travel score 1-10 based on weather suitability
    private int calcTravelScore(double maxTemp, double precip, int code) {
        int score = 10;
        if (maxTemp > 38) score -= 3;
        else if (maxTemp > 35) score -= 2;
        else if (maxTemp < 10) score -= 2;
        else if (maxTemp < 5) score -= 4;
        if (precip > 20) score -= 4;
        else if (precip > 10) score -= 2;
        else if (precip > 5) score -= 1;
        if (code >= 80) score -= 2;
        return Math.max(1, Math.min(10, score));
    }
}
