package com.travel.service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.travel.dto.TripPlanRequest;
import com.travel.model.*;
import com.travel.repository.*;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class TripPlanService {
    private final TripPlanRepository tripRepo;
    private final DestinationRepository destRepo;
    private final UserRepository userRepo;
    private final ObjectMapper mapper = new ObjectMapper();

    public TripPlanService(TripPlanRepository tr, DestinationRepository dr, UserRepository ur) {
        tripRepo=tr; destRepo=dr; userRepo=ur;
    }

    public TripPlan createPlan(TripPlanRequest req, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        TripPlan plan = new TripPlan();
        plan.setUser(user);
        plan.setSource(req.getSource());
        plan.setDestination(req.getDestination());
        plan.setStartDate(req.getStartDate());
        plan.setEndDate(req.getEndDate());
        int days = (int)(req.getEndDate().toEpochDay() - req.getStartDate().toEpochDay()) + 1;
        plan.setDurationDays(days);
        plan.setNumberOfPeople(req.getNumberOfPeople());
        plan.setBudgetType(req.getBudgetType());
        plan.setTransportMode(req.getTransportMode());

        // Generate day-wise plan
        Destination dest = destRepo.findByNameIgnoreCase(req.getDestination()).orElse(null);
        plan.setDayWisePlan(generateDayWisePlan(dest, days, req.getBudgetType()));

        int perDay = dest != null ? getBudgetPerDay(dest, req.getBudgetType()) : 3000;
        plan.setTotalBudget(perDay * days * req.getNumberOfPeople());
        plan.setStatus("PLANNED");
        return tripRepo.save(plan);
    }

    private int getBudgetPerDay(Destination dest, String budgetType) {
        return switch (budgetType.toUpperCase()) {
            case "LOW" -> dest.getLowBudgetPerDay();
            case "MID" -> dest.getMidBudgetPerDay();
            case "LUXURY" -> dest.getLuxuryBudgetPerDay();
            default -> dest.getMidBudgetPerDay();
        };
    }

    private String generateDayWisePlan(Destination dest, int days, String budget) {
        List<Map<String, Object>> plan = new ArrayList<>();
        String[] activities = dest != null && dest.getFamousPlaces() != null
            ? dest.getFamousPlaces().replace("[","").replace("]","").replace("\"","").split(",")
            : new String[]{"City Tour", "Local Market", "Museum Visit", "Scenic Spot"};
        String[] foods = dest != null && dest.getLocalFood() != null
            ? dest.getLocalFood().replace("[","").replace("]","").replace("\"","").split(",")
            : new String[]{"Local Breakfast", "Street Food", "Regional Thali"};

        for (int d = 1; d <= days; d++) {
            Map<String, Object> day = new LinkedHashMap<>();
            day.put("day", d);
            day.put("title", "Day " + d + " - " + (dest != null ? dest.getName() : "Exploration"));
            List<Map<String, String>> slots = new ArrayList<>();
            slots.add(Map.of("time","07:00 AM","activity","Morning Walk & Freshen Up","type","LEISURE"));
            slots.add(Map.of("time","08:30 AM","activity","Breakfast at Hotel","type","FOOD"));
            if (activities.length > (d-1)*2) slots.add(Map.of("time","10:00 AM","activity",activities[(d-1)*2 % activities.length].trim(),"type","SIGHTSEEING"));
            slots.add(Map.of("time","01:00 PM","activity","Lunch: " + foods[d % foods.length].trim(),"type","FOOD"));
            if (activities.length > (d-1)*2+1) slots.add(Map.of("time","02:30 PM","activity",activities[((d-1)*2+1) % activities.length].trim(),"type","SIGHTSEEING"));
            slots.add(Map.of("time","06:00 PM","activity","Evening Leisure & Shopping","type","LEISURE"));
            slots.add(Map.of("time","08:00 PM","activity","Dinner at Local Restaurant","type","FOOD"));
            day.put("schedule", slots);
            day.put("estimatedCost", budget.equals("LOW") ? 1500*d : budget.equals("MID") ? 3000*d : 8000*d);
            plan.add(day);
        }
        try { return mapper.writeValueAsString(plan); } catch (Exception e) { return "[]"; }
    }

    public List<TripPlan> getUserPlans(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return tripRepo.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public TripPlan getPlanById(Long id) { return tripRepo.findById(id).orElseThrow(); }

    public TripPlan updateStatus(Long id, String status) {
        TripPlan p = tripRepo.findById(id).orElseThrow();
        p.setStatus(status);
        p.setUpdatedAt(LocalDateTime.now());
        return tripRepo.save(p);
    }
}
