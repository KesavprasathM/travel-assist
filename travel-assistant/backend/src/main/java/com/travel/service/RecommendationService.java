package com.travel.service;

import com.travel.model.Destination;
import com.travel.repository.DestinationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

/**
 * AI Recommendation Engine — rule-based, zero external API calls
 * Recommends transport, best season, activities, packing based on user inputs
 */
@Service
public class RecommendationService {

    private final DestinationRepository destRepo;
    public RecommendationService(DestinationRepository dr) { this.destRepo = dr; }

    public Map<String, Object> recommend(String destination, String budget, int people,
                                          String fromCity, int durationDays, String travelMonth) {
        Map<String, Object> rec = new LinkedHashMap<>();
        Destination dest = destRepo.findByNameIgnoreCase(destination).orElse(null);

        // 1. Transport recommendation
        rec.put("transportRecommendation", recommendTransport(fromCity, destination, budget, durationDays));

        // 2. Budget breakdown
        rec.put("budgetBreakdown", calcBudgetBreakdown(dest, budget, durationDays, people));

        // 3. Best time to visit
        rec.put("bestTimeToVisit", recommendBestTime(dest, travelMonth));

        // 4. Trip type recommendation
        rec.put("tripType", recommendTripType(dest, people, durationDays));

        // 5. Packing checklist
        rec.put("packingChecklist", buildPackingList(dest, travelMonth));

        // 6. Safety tips
        rec.put("safetyTips", getSafetyTips(dest, travelMonth));

        // 7. Similar destinations
        rec.put("similarDestinations", getSimilarDestinations(dest, budget));

        // 8. Itinerary style
        rec.put("itineraryStyle", recommendItineraryStyle(budget, people, durationDays));

        rec.put("destination", destination);
        rec.put("generatedAt", LocalDate.now().toString());
        return rec;
    }

    private Map<String, Object> recommendTransport(String from, String to, String budget, int days) {
        Map<String, Object> t = new LinkedHashMap<>();

        // Estimate distance (simplified rule engine)
        double dist = estimateDistance(from, to);

        String recommended;
        String reason;
        List<String> alternatives = new ArrayList<>();

        if ("LUXURY".equals(budget)) {
            recommended = "FLIGHT";
            reason = "Luxury travel — save time, fly comfortably";
            alternatives.add("Private cab for short distances");
        } else if (dist > 1000) {
            recommended = "FLIGHT";
            reason = "Long distance (>" + (int)dist + "km) — flight saves 1-2 days of travel";
            alternatives.add("TRAIN if you enjoy scenic journey");
        } else if (dist > 500 && "LOW".equals(budget)) {
            recommended = "TRAIN";
            reason = "Best value for " + (int)dist + "km distance — sleeper class saves money";
            alternatives.add("BUS for even lower cost");
        } else if (dist <= 500 && "LOW".equals(budget)) {
            recommended = "BUS";
            reason = "Short distance (" + (int)dist + "km) + budget travel — AC bus is economical";
            alternatives.add("TRAIN for more comfort");
        } else {
            recommended = "TRAIN";
            reason = "Best balance of comfort, cost and experience for " + (int)dist + "km";
            alternatives.add("FLIGHT if you value time");
            alternatives.add("BUS for lower cost");
        }

        if (days == 1 || days == 2) {
            recommended = "FLIGHT";
            reason = "Short trip — maximize time at destination with flight";
        }

        t.put("recommended", recommended);
        t.put("reason", reason);
        t.put("alternatives", alternatives);
        t.put("estimatedDistance", (int)dist + "km");
        return t;
    }

    private double estimateDistance(String from, String to) {
        // Simplified distance matrix for Indian cities (in km)
        Map<String, double[]> coords = new HashMap<>();
        coords.put("bengaluru", new double[]{12.97, 77.59});
        coords.put("bangalore", new double[]{12.97, 77.59});
        coords.put("mumbai", new double[]{19.07, 72.87});
        coords.put("delhi", new double[]{28.61, 77.21});
        coords.put("chennai", new double[]{13.08, 80.27});
        coords.put("kolkata", new double[]{22.57, 88.36});
        coords.put("hyderabad", new double[]{17.38, 78.48});
        coords.put("goa", new double[]{15.30, 74.12});
        coords.put("manali", new double[]{32.24, 77.19});
        coords.put("jaipur", new double[]{26.91, 75.79});
        coords.put("kerala", new double[]{10.85, 76.27});
        coords.put("agra", new double[]{27.18, 78.01});
        coords.put("varanasi", new double[]{25.32, 82.97});
        coords.put("darjeeling", new double[]{27.04, 88.27});
        coords.put("rishikesh", new double[]{30.09, 78.27});
        coords.put("mysuru", new double[]{12.30, 76.64});

        double[] c1 = coords.getOrDefault(from.toLowerCase(), new double[]{20.0, 78.0});
        double[] c2 = coords.getOrDefault(to.toLowerCase(), new double[]{22.0, 80.0});
        double dlat = Math.toRadians(c2[0] - c1[0]);
        double dlon = Math.toRadians(c2[1] - c1[1]);
        double a = Math.sin(dlat/2)*Math.sin(dlat/2) + Math.cos(Math.toRadians(c1[0]))*Math.cos(Math.toRadians(c2[0]))*Math.sin(dlon/2)*Math.sin(dlon/2);
        return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); // km
    }

    private Map<String, Object> calcBudgetBreakdown(Destination dest, String budget, int days, int people) {
        Map<String, Object> b = new LinkedHashMap<>();
        int perDay = dest != null ? switch(budget) {
            case "LOW" -> dest.getLowBudgetPerDay();
            case "LUXURY" -> dest.getLuxuryBudgetPerDay();
            default -> dest.getMidBudgetPerDay();
        } : 3000;

        int accommodation = (int)(perDay * 0.45);
        int food = (int)(perDay * 0.25);
        int activities = (int)(perDay * 0.20);
        int misc = (int)(perDay * 0.10);

        b.put("perPersonPerDay", perDay);
        b.put("accommodation", accommodation);
        b.put("food", food);
        b.put("activities", activities);
        b.put("miscellaneous", misc);
        b.put("totalForTrip", perDay * days * people);
        b.put("transportExtra", budget.equals("LUXURY") ? "₹8,000–20,000" : budget.equals("LOW") ? "₹400–2,000" : "₹2,000–8,000");
        b.put("budgetType", budget);
        b.put("days", days);
        b.put("people", people);
        return b;
    }

    private Map<String, Object> recommendBestTime(Destination dest, String travelMonth) {
        Map<String, Object> bt = new LinkedHashMap<>();
        if (dest == null) return bt;

        bt.put("bestSeason", dest.getBestSeason());
        bt.put("climate", dest.getClimate());

        // Check if travel month is good
        String[] goodMonths = dest.getBestSeason() != null ? dest.getBestSeason().split("–|to|,") : new String[]{};
        String advice;
        if (travelMonth != null && !travelMonth.isEmpty()) {
            advice = isBestMonth(travelMonth, dest.getBestSeason())
                ? "✅ " + travelMonth + " is an EXCELLENT time to visit " + dest.getName() + "!"
                : "⚠️ " + travelMonth + " is NOT the ideal time. Best months: " + dest.getBestSeason();
        } else {
            advice = "Best time to visit: " + dest.getBestSeason();
        }
        bt.put("advice", advice);
        return bt;
    }

    private boolean isBestMonth(String month, String bestSeason) {
        if (bestSeason == null) return true;
        String[] bestMonths = {"November","December","January","February","March"};
        String season = bestSeason.toLowerCase();
        return season.contains(month.toLowerCase()) ||
               (month.equals("December") && season.contains("november")) ||
               (month.equals("January") && season.contains("december"));
    }

    private String recommendTripType(Destination dest, int people, int days) {
        if (dest == null) return "General Tourism";
        if (people == 2 && days <= 4) return "Romantic Getaway 💑";
        if (people >= 4 && days >= 5) return "Group Adventure 👫";
        if (people == 1) return "Solo Explorer 🎒";
        if (days == 1 || days == 2) return "Weekend Escape 📅";
        if ("MOUNTAIN".equals(dest.getType())) return "Adventure Trek 🏔";
        if ("BEACH".equals(dest.getType())) return "Beach Holiday 🏖";
        if ("HERITAGE".equals(dest.getType())) return "Heritage & Culture 🏛";
        if ("PILGRIMAGE".equals(dest.getType())) return "Spiritual Journey 🙏";
        return "Leisure Holiday 🌴";
    }

    private List<String> buildPackingList(Destination dest, String month) {
        List<String> list = new ArrayList<>();
        if (dest == null) return list;

        // Base items always needed
        list.addAll(List.of("Government ID / Passport", "Travel insurance documents", "Emergency cash (₹2,000 minimum)", "Phone charger + power bank", "First aid kit", "Medicines (personal)"));

        // Climate-specific
        String climate = dest.getClimate() != null ? dest.getClimate() : "";
        if (climate.contains("Alpine") || climate.contains("Mountain")) {
            list.addAll(List.of("Thermal innerwear (2 sets)", "Heavy woolen jacket", "Snow boots or trekking shoes", "Gloves + woolen cap + muffler", "Sunscreen SPF 50+", "Lip balm (high altitude)"));
        } else if (climate.contains("Tropical")) {
            list.addAll(List.of("Light cotton clothes (4-5 sets)", "Sunscreen SPF 30+", "Insect repellent", "Comfortable sandals", "Reusable water bottle", "Rain jacket / umbrella"));
        } else if (climate.contains("Arid") || climate.contains("Dry")) {
            list.addAll(List.of("Light cotton clothes", "Stole/dupatta for temples", "Comfortable walking shoes", "Sunglasses + sun hat", "Sunscreen SPF 50+", "Extra water bottles"));
        }

        // Type-specific
        if ("BEACH".equals(dest.getType())) list.addAll(List.of("Swimwear (2 sets)", "Flip flops", "Beach towel", "Waterproof bag"));
        if ("PILGRIMAGE".equals(dest.getType())) list.addAll(List.of("Modest clothing", "Cloth bag (no plastic)", "Comfortable flats / mojris"));
        if ("MOUNTAIN".equals(dest.getType()) || "ADVENTURE".equals(dest.getType())) list.addAll(List.of("Trekking pole", "Headlamp + extra batteries", "Water purification tablets"));

        return list;
    }

    private List<String> getSafetyTips(Destination dest, String month) {
        List<String> tips = new ArrayList<>();
        if (dest == null) return tips;
        tips.add("Share your itinerary with family/friends before departure");
        tips.add("Save local emergency numbers: 112 (Police), 108 (Ambulance), 101 (Fire)");
        tips.add("Carry a physical copy of your booking documents");
        tips.add("Keep hotel/hostel address written in local language for cab drivers");

        String type = dest.getType() != null ? dest.getType() : "";
        if ("BEACH".equals(type)) tips.addAll(List.of("Swim only in designated areas with lifeguards", "Check tide timings before water activities", "Avoid beach after sunset at isolated stretches"));
        if ("MOUNTAIN".equals(type)) tips.addAll(List.of("Acclimatize for 24h before high-altitude treks", "Never trek alone — hire a local guide", "Check road/weather conditions for Rohtang/passes daily", "Carry altitude sickness medicine (Diamox)"));
        if ("PILGRIMAGE".equals(type)) tips.addAll(List.of("Dress modestly at religious sites", "Remove footwear before entering temples", "Do not photograph in restricted shrine areas"));
        return tips;
    }

    private List<Map<String, Object>> getSimilarDestinations(Destination dest, String budget) {
        if (dest == null) return List.of();
        List<Destination> all = destRepo.findByTypeIgnoreCase(dest.getType());
        return all.stream()
            .filter(d -> !d.getName().equals(dest.getName()))
            .limit(3)
            .map(d -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("name", d.getName());
                m.put("state", d.getState());
                m.put("type", d.getType());
                m.put("rating", d.getRating());
                m.put("budgetPerDay", budget.equals("LOW") ? d.getLowBudgetPerDay() : budget.equals("LUXURY") ? d.getLuxuryBudgetPerDay() : d.getMidBudgetPerDay());
                m.put("imageUrl", d.getThumbnailUrl());
                return m;
            })
            .collect(Collectors.toList());
    }

    private String recommendItineraryStyle(String budget, int people, int days) {
        if (days <= 2) return "Highlights Only — focus on 2-3 must-see spots, no rush";
        if (days <= 4) return "Balanced — mix sightseeing with leisure, 2 spots/day";
        if (days >= 7) return "Deep Dive — explore hidden gems, local culture, slow travel";
        return "Standard — 3 spots/day with meals and rest breaks";
    }
}
