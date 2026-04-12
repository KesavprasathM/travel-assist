package com.travel.service;

import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.time.LocalDate;
import java.util.*;

/**
 * Disaster Alert Service using GDACS RSS Feed
 * Global Disaster Alert and Coordination System — free, open data
 * URL: https://gdacs.org/xml/rss.xml
 */
@Service
public class DisasterAlertService {

    private static final String GDACS_URL = "https://gdacs.org/xml/rss.xml";
    private static final String INDIA_FLOOD_URL = "https://gdacs.org/xml/rss_fl.xml";

    // India keyword mappings for relevant regions
    private static final Map<String, List<String>> DEST_KEYWORDS = Map.of(
        "goa",       List.of("goa", "konkan", "karnataka", "maharashtra"),
        "manali",    List.of("manali", "himachal", "kullu", "spiti"),
        "jaipur",    List.of("rajasthan", "jaipur"),
        "kerala",    List.of("kerala", "kochi", "trivandrum"),
        "agra",      List.of("uttar pradesh", "agra", "mathura"),
        "varanasi",  List.of("varanasi", "uttar pradesh", "benares"),
        "darjeeling",List.of("darjeeling", "west bengal", "sikkim"),
        "andaman",   List.of("andaman", "bay of bengal"),
        "rishikesh", List.of("uttarakhand", "rishikesh", "dehradun"),
        "mysuru",    List.of("karnataka", "mysore", "mysuru")
    );

    public List<Map<String, Object>> getAlertsForDestination(String destination) {
        List<Map<String, Object>> alerts = new ArrayList<>();
        List<String> keywords = DEST_KEYWORDS.getOrDefault(
            destination.toLowerCase(), List.of(destination.toLowerCase()));

        try {
            SyndFeedInput input = new SyndFeedInput();
            SyndFeed feed = input.build(new XmlReader(new URL(GDACS_URL)));

            for (SyndEntry entry : feed.getEntries()) {
                String title = entry.getTitle() != null ? entry.getTitle().toLowerCase() : "";
                String desc = entry.getDescription() != null ? entry.getDescription().getValue().toLowerCase() : "";

                for (String keyword : keywords) {
                    if (title.contains(keyword) || desc.contains(keyword)) {
                        Map<String, Object> alert = new LinkedHashMap<>();
                        alert.put("title", entry.getTitle());
                        alert.put("description", entry.getDescription() != null
                            ? entry.getDescription().getValue().replaceAll("<[^>]+>", "").substring(0, Math.min(200, entry.getDescription().getValue().length()))
                            : "");
                        alert.put("link", entry.getLink());
                        alert.put("publishedDate", entry.getPublishedDate() != null
                            ? entry.getPublishedDate().toString() : "");
                        alert.put("severity", extractSeverity(entry.getTitle()));
                        alert.put("type", extractDisasterType(entry.getTitle()));
                        alert.put("destination", destination);
                        alerts.add(alert);
                        break;
                    }
                }
            }
        } catch (Exception e) {
            // GDACS unavailable — return static seasonal risk data
            alerts.addAll(getSeasonalRiskData(destination));
        }

        // Always append static seasonal risk info
        alerts.addAll(getSeasonalRiskData(destination));
        return alerts;
    }

    private String extractSeverity(String title) {
        if (title == null) return "UNKNOWN";
        String t = title.toLowerCase();
        if (t.contains("red") || t.contains("very high")) return "HIGH";
        if (t.contains("orange") || t.contains("high")) return "MEDIUM";
        if (t.contains("green") || t.contains("low")) return "LOW";
        return "INFO";
    }

    private String extractDisasterType(String title) {
        if (title == null) return "UNKNOWN";
        String t = title.toLowerCase();
        if (t.contains("cyclone") || t.contains("tropical")) return "CYCLONE";
        if (t.contains("flood")) return "FLOOD";
        if (t.contains("earthquake")) return "EARTHQUAKE";
        if (t.contains("volcano")) return "VOLCANO";
        if (t.contains("tsunami")) return "TSUNAMI";
        return "GENERAL";
    }

    // Static seasonal risk data — no external call needed
    private List<Map<String, Object>> getSeasonalRiskData(String destination) {
        List<Map<String, Object>> risks = new ArrayList<>();
        int currentMonth = LocalDate.now().getMonthValue();

        Map<String, Object[][]> riskMap = new HashMap<>();
        riskMap.put("goa", new Object[][]{
            {"CYCLONE", new int[]{6,7,8,9}, "Cyclone risk in Arabian Sea during Southwest Monsoon", "MEDIUM"},
            {"FLOOD", new int[]{6,7,8,9,10}, "Heavy monsoon flooding possible in low-lying areas", "LOW"}
        });
        riskMap.put("manali", new Object[][]{
            {"LANDSLIDE", new int[]{7,8,9}, "Active landslide zone — Rohtang Pass may close", "HIGH"},
            {"SNOWSTORM", new int[]{12,1,2}, "Heavy snowfall may block Manali-Leh Highway", "HIGH"}
        });
        riskMap.put("kerala", new Object[][]{
            {"FLOOD", new int[]{6,7,8,9}, "Kerala faces severe flooding — check NDMA alerts", "HIGH"},
            {"LANDSLIDE", new int[]{7,8,9}, "Hilly regions prone to landslides in peak monsoon", "MEDIUM"}
        });
        riskMap.put("darjeeling", new Object[][]{
            {"LANDSLIDE", new int[]{6,7,8,9}, "Toy Train may be suspended. Road closures likely.", "MEDIUM"}
        });
        riskMap.put("andaman", new Object[][]{
            {"CYCLONE", new int[]{5,6,10,11}, "Bay of Bengal cyclone season — monitor IMD", "MEDIUM"},
            {"TSUNAMI", new int[]{1,2,3,4,5,6,7,8,9,10,11,12}, "Located in seismic zone. Follow evacuation protocols.", "LOW"}
        });
        riskMap.put("rishikesh", new Object[][]{
            {"FLOOD", new int[]{7,8,9}, "Ganga flash floods. Rafting suspended during heavy rain.", "HIGH"}
        });

        Object[][] destRisks = riskMap.getOrDefault(destination.toLowerCase(), new Object[0][]);
        for (Object[] risk : destRisks) {
            String type = (String) risk[0];
            int[] months = (int[]) risk[1];
            String desc = (String) risk[2];
            String severity = (String) risk[3];

            boolean currentRisk = false;
            for (int m : months) {
                if (m == currentMonth) { currentRisk = true; break; }
            }

            Map<String, Object> alert = new LinkedHashMap<>();
            alert.put("type", type);
            alert.put("description", desc);
            alert.put("severity", currentRisk ? severity : "INFO");
            alert.put("activeNow", currentRisk);
            alert.put("riskMonths", months);
            alert.put("destination", destination);
            alert.put("source", "Tripx Seasonal Risk Database");
            risks.add(alert);
        }
        return risks;
    }
}
