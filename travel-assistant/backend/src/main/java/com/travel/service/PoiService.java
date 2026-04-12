package com.travel.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Points of Interest Service using Overpass API (OpenStreetMap)
 * Free, open source, no API key needed
 * Queries: hotels, restaurants, attractions, hospitals near a location
 */
@Service
public class PoiService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();
    private static final String OVERPASS_URL = "https://overpass-api.de/api/interpreter";

    public List<Map<String, Object>> getNearbyPois(double lat, double lon, String type, int radiusMeters) {
        List<Map<String, Object>> pois = new ArrayList<>();
        try {
            String osmQuery = buildQuery(type, lat, lon, radiusMeters);
            String url = OVERPASS_URL + "?data=" + java.net.URLEncoder.encode(osmQuery, "UTF-8");
            String json = restTemplate.getForObject(url, String.class);
            JsonNode root = mapper.readTree(json);
            JsonNode elements = root.get("elements");

            if (elements != null && elements.isArray()) {
                for (JsonNode el : elements) {
                    Map<String, Object> poi = new LinkedHashMap<>();
                    JsonNode tags = el.get("tags");
                    if (tags == null) continue;

                    String name = tags.has("name") ? tags.get("name").asText() : null;
                    if (name == null || name.isBlank()) continue;

                    poi.put("name", name);
                    poi.put("type", type);
                    poi.put("lat", el.has("lat") ? el.get("lat").asDouble() : lat);
                    poi.put("lon", el.has("lon") ? el.get("lon").asDouble() : lon);
                    if (tags.has("amenity")) poi.put("amenity", tags.get("amenity").asText());
                    if (tags.has("tourism")) poi.put("tourism", tags.get("tourism").asText());
                    if (tags.has("stars")) poi.put("stars", tags.get("stars").asText());
                    if (tags.has("cuisine")) poi.put("cuisine", tags.get("cuisine").asText());
                    if (tags.has("phone")) poi.put("phone", tags.get("phone").asText());
                    if (tags.has("website")) poi.put("website", tags.get("website").asText());
                    if (tags.has("opening_hours")) poi.put("openingHours", tags.get("opening_hours").asText());
                    poi.put("source", "OpenStreetMap via Overpass API");
                    pois.add(poi);

                    if (pois.size() >= 15) break; // limit results
                }
            }
        } catch (Exception e) {
            // Return empty if Overpass unavailable
            pois.add(Map.of("error", "POI data temporarily unavailable", "type", type));
        }
        return pois;
    }

    private String buildQuery(String type, double lat, double lon, int radius) {
        String osmType = switch (type.toUpperCase()) {
            case "HOTEL" -> "node[\"tourism\"=\"hotel\"]";
            case "RESTAURANT" -> "node[\"amenity\"=\"restaurant\"]";
            case "ATTRACTION" -> "node[\"tourism\"=\"attraction\"]";
            case "HOSPITAL" -> "node[\"amenity\"=\"hospital\"]";
            case "ATM" -> "node[\"amenity\"=\"atm\"]";
            case "PHARMACY" -> "node[\"amenity\"=\"pharmacy\"]";
            default -> "node[\"tourism\"]";
        };
        return String.format("[out:json][timeout:15];%s(around:%d,%f,%f);out body;", osmType, radius, lat, lon);
    }

    // Wikipedia summary scraping — free API, no key
    public Map<String, Object> getWikipediaSummary(String topic) {
        Map<String, Object> result = new LinkedHashMap<>();
        try {
            String url = "https://en.wikipedia.org/api/rest_v1/page/summary/"
                + java.net.URLEncoder.encode(topic.replace(" ", "_"), "UTF-8");
            RestTemplate rt = new RestTemplate();
            rt.getInterceptors().add((request, body, execution) -> {
                request.getHeaders().set("User-Agent", "Tripx/2.0 (travel assistant)");
                return execution.execute(request, body);
            });
            String json = rt.getForObject(url, String.class);
            JsonNode root = mapper.readTree(json);

            result.put("title", root.has("title") ? root.get("title").asText() : topic);
            result.put("description", root.has("description") ? root.get("description").asText() : "");
            result.put("extract", root.has("extract") ? root.get("extract").asText().substring(0, Math.min(500, root.get("extract").asText().length())) : "");
            if (root.has("thumbnail") && root.get("thumbnail").has("source")) {
                result.put("thumbnail", root.get("thumbnail").get("source").asText());
            }
            result.put("wikipediaUrl", root.has("content_urls") ? root.get("content_urls").get("desktop").get("page").asText() : "");
            result.put("source", "Wikipedia (open source)");
            result.put("success", true);
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Wikipedia data unavailable");
        }
        return result;
    }
}
