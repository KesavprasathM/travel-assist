package com.travel.service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.travel.dto.ChatRequest;
import com.travel.dto.ChatResponse;
import com.travel.model.Destination;
import com.travel.repository.DestinationRepository;
import org.springframework.stereotype.Service;
import java.security.Principal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ChatService {
    private final DestinationRepository destinationRepository;
    private final BookingService bookingService;
    private final ObjectMapper mapper = new ObjectMapper();

    public ChatService(DestinationRepository destinationRepository, BookingService bookingService) {
        this.destinationRepository = destinationRepository;
        this.bookingService = bookingService;
    }

    public ChatResponse handle(ChatRequest request, Principal principal) {
        ChatResponse response = new ChatResponse();
        Map<String, Object> context = new LinkedHashMap<>();
        if (request.getContext() != null) {
            context.putAll(request.getContext());
        }

        String message = request.getMessage() != null ? request.getMessage().trim() : "";
        if (message.isBlank()) {
            response.setReply("Please type your question for Dora. For example, 'Plan a 5-day trip to Goa' or 'Suggest hotels in Jaipur'.");
            response.setContext(context);
            response.setQuickReplies(List.of("Plan a 5-day trip to Goa", "Tell me about Jaipur festivals", "Show hotel options in Kerala"));
            return response;
        }

        Destination destination = resolveDestination(message, context);
        if (destination != null) {
            context.put("destination", destination.getName());
        }

        Integer durationDays = extractDays(message);
        if (durationDays != null) {
            context.put("durationDays", durationDays);
        }

        String budgetType = extractBudgetType(message);
        if (budgetType != null) {
            context.put("budgetType", budgetType);
            context.put("hotelCategory", budgetType);
        }

        String transportMode = extractTransportMode(message);
        if (transportMode != null) {
            context.put("transportMode", transportMode);
        }

        String foodPreference = extractFoodPreference(message);
        if (foodPreference != null) {
            context.put("foodPreference", foodPreference);
        }

        if (message.toLowerCase().contains("help") || message.toLowerCase().contains("what can you")) {
            response.setReply("I am Dora, your India travel guide. I can help with destination plans, hotels, local food, festivals, transport options, and cost estimates. Try: 'Plan a 5-day trip to Goa', 'Suggest luxury hotels in Jaipur' or 'What local food is famous in Kerala?'");
            response.setContext(context);
            response.setQuickReplies(List.of("Plan a 5-day trip to Goa", "Suggest budget hotels in Jaipur", "What local food is famous in Kerala?"));
            return response;
        }

        if (isBookingIntent(message)) {
            if (destination == null) {
                response.setReply("Please tell me which Indian destination you want to book for. I can simulate hotel and transport reservations within India.");
                response.setContext(context);
                response.setQuickReplies(List.of("Book a hotel in Goa", "Book a train to Jaipur", "Show transport options to Kerala"));
                return response;
            }
            String budget = budgetType != null ? budgetType : normalizeContextString(context.get("budgetType"), "MID");
            if (message.toLowerCase().contains("hotel") || message.toLowerCase().contains("stay") || message.toLowerCase().contains("room")) {
                List<String> hotels = getHotelRecommendations(destination, budget, 2);
                String booked = hotels.isEmpty() ? "a great hotel" : hotels.get(0);
                response.setReply("I checked availability at " + booked + " in " + destination.getName() + ". Booking is simulated and confirmed for your stay. You can next ask me to book transport or review the itinerary.");
                response.setHotelOptions(hotels);
                response.setContext(context);
                response.setQuickReplies(List.of("Show transport options to " + destination.getName(), "Plan a 4-day trip to " + destination.getName(), "Tell me the local food in " + destination.getName()));
                return response;
            }
            if (message.toLowerCase().contains("flight") || message.toLowerCase().contains("train") || message.toLowerCase().contains("bus") || message.toLowerCase().contains("cab") || message.toLowerCase().contains("taxi")) {
                String from = normalizeContextString(context.get("from"), "Bengaluru");
                String to = normalizeContextString(context.get("to"), destination.getName());
                String mode = transportMode != null ? transportMode : extractTransportMode(message);
                if (mode == null) mode = "TRAIN";
                String date = LocalDate.now().plusDays(5).format(DateTimeFormatter.ISO_DATE);
                List<Map<String, Object>> options = bookingService.searchTransports(from, to, date, mode);
                response.setReply("I found available " + mode.toLowerCase() + " options from " + from + " to " + to + ". Booking is simulated and the best option is reserved, subject to your confirmation.");
                response.setTransportOptions(options);
                response.setContext(context);
                response.setQuickReplies(List.of("Confirm transport booking", "Show hotel options in " + to, "Plan a 3-day itinerary for " + to));
                return response;
            }
            response.setReply("Are you looking to book a hotel or transport for " + destination.getName() + "? I can simulate both.");
            response.setContext(context);
            response.setQuickReplies(List.of("Book a hotel in " + destination.getName(), "Book a train to " + destination.getName(), "Plan a trip to " + destination.getName()));
            return response;
        }

        if (isPlanningIntent(message)) {
            if (destination == null) {
                response.setReply("Please tell me which Indian destination you would like to plan for. I support destinations like Goa, Jaipur, Kerala, Agra and many more.");
            } else if (durationDays == null && context.get("durationDays") == null) {
                response.setReply("How many days do you want for this trip? Please provide the duration in days so I can create a day-wise itinerary.");
            } else {
                int days = durationDays != null ? durationDays : Integer.parseInt(context.get("durationDays").toString());
                String budget = budgetType != null ? budgetType : normalizeContextString(context.get("budgetType"), "MID");
                response.setReply(buildItinerary(destination, days, budget));
                response.setQuickReplies(List.of(
                    "Book a " + budget.toLowerCase() + " hotel in " + destination.getName(),
                    "Show transport options to " + destination.getName(),
                    "What food should I try in " + destination.getName() + "?"
                ));
                response.setContext(context);
                return response;
            }
            response.setContext(context);
            response.setQuickReplies(List.of("Plan a 5-day trip to Goa", "Tell me about Jaipur festivals", "Show hotel options in Kerala"));
            return response;
        }

        if (message.toLowerCase().contains("hotel") || message.toLowerCase().contains("stay") || message.toLowerCase().contains("accommodation")) {
            if (destination == null) {
                response.setReply("Please specify the Indian destination you'd like hotel recommendations for.");
            } else {
                String budget = budgetType != null ? budgetType : normalizeContextString(context.get("budgetType"), "MID");
                List<String> hotels = getHotelRecommendations(destination, budget, 3);
                response.setReply("Here are top " + budget.toLowerCase() + " hotel suggestions in " + destination.getName() + ": " + String.join(" / ", hotels) + ".\nYou can ask me to 'Book a hotel' or 'Confirm availability'.");
                response.setHotelOptions(hotels);
                response.setQuickReplies(List.of("Book a hotel in " + destination.getName(), "Show transport options to " + destination.getName(), "Tell me about local festivals in " + destination.getName()));
            }
            response.setContext(context);
            return response;
        }

        if (message.toLowerCase().contains("food") || message.toLowerCase().contains("dish") || message.toLowerCase().contains("cuisine")) {
            if (destination == null) {
                response.setReply("Tell me the Indian destination first and I will share the best local foods and day-wise meal ideas.");
            } else {
                List<String> foods = parseTextArray(destination.getLocalFood());
                response.setReply("Popular local foods in " + destination.getName() + " include: " + String.join(", ", foods) + ".\nI can also build a day-wise food plan if you tell me how many days you are staying.");
                response.setQuickReplies(List.of("Plan a 3-day food itinerary for " + destination.getName(), "What is the best festival food in " + destination.getName(), "Suggest local snacks in " + destination.getName()));
            }
            response.setContext(context);
            return response;
        }

        if (message.toLowerCase().contains("culture") || message.toLowerCase().contains("festival") || message.toLowerCase().contains("tradition") || message.toLowerCase().contains("heritage")) {
            if (destination == null) {
                response.setReply("Let me know the destination and I will share the most celebrated festivals, cultural highlights, and traditions.");
            } else {
                List<String> festivals = parseTextArray(destination.getFestivals());
                response.setReply("For " + destination.getName() + ", the local culture is best experienced through: " + String.join(", ", festivals) + ".\nAsk me for a festival-based itinerary or the best time to visit during these celebrations.");
                response.setQuickReplies(List.of("When is the best time to visit " + destination.getName(), "Plan a festival itinerary for " + destination.getName(), "Tell me more about " + destination.getName() + " culture"));
            }
            response.setContext(context);
            return response;
        }

        if (message.toLowerCase().contains("transport") || message.toLowerCase().contains("flight") || message.toLowerCase().contains("train") || message.toLowerCase().contains("bus") || message.toLowerCase().contains("cab") || message.toLowerCase().contains("fare")) {
            if (destination == null) {
                response.setReply("Please tell me the destination so I can provide transport options and estimated fares within India.");
            } else {
                String from = normalizeContextString(context.get("from"), "Bengaluru");
                String to = normalizeContextString(context.get("to"), destination.getName());
                String mode = transportMode != null ? transportMode : "TRAIN";
                String date = LocalDate.now().plusDays(5).format(DateTimeFormatter.ISO_DATE);
                List<Map<String, Object>> options = bookingService.searchTransports(from, to, date, mode);
                response.setReply(buildTransportSummary(to, from, mode, date, options));
                response.setTransportOptions(options);
                response.setContext(context);
                response.setQuickReplies(List.of("Book a " + mode.toLowerCase() + " ticket to " + to, "Show hotels in " + to, "Plan a 4-day trip to " + to));
                return response;
            }
            response.setContext(context);
            return response;
        }

        if (message.toLowerCase().contains("cost") || message.toLowerCase().contains("price") || message.toLowerCase().contains("estimate") || message.toLowerCase().contains("budget")) {
            if (destination == null) {
                response.setReply("Share the destination first and I will estimate hotel, food, and local transport costs for your India trip.");
            } else {
                String budget = budgetType != null ? budgetType : normalizeContextString(context.get("budgetType"), "MID");
                int days = durationDays != null ? durationDays : (context.get("durationDays") != null ? Integer.parseInt(context.get("durationDays").toString()) : 3);
                response.setReply(buildCostEstimate(destination, budget, days));
                response.setContext(context);
                response.setQuickReplies(List.of("Plan a " + days + "-day trip to " + destination.getName(), "Suggest " + budget.toLowerCase() + " hotels in " + destination.getName(), "Show transport options to " + destination.getName()));
                return response;
            }
            response.setContext(context);
            return response;
        }

        if (destination != null) {
            response.setReply("I understood that you want information about " + destination.getName() + ". You can ask me to plan a multi-day itinerary, suggest hotels, local food, culture, and transport estimates.");
            response.setContext(context);
            response.setQuickReplies(List.of("Plan a 5-day trip to " + destination.getName(), "Suggest hotels in " + destination.getName(), "Tell me the top festivals in " + destination.getName()));
            return response;
        }

        response.setReply("Dora can help you with Indian travel planning. Try: 'Plan a 5-day trip to Goa', 'Suggest luxury hotels in Jaipur', or 'Show transport options to Kerala'.");
        response.setContext(context);
        response.setQuickReplies(List.of("Plan a 5-day trip to Goa", "Suggest budget hotels in Jaipur", "Tell me about Kerala food"));
        return response;
    }

    private boolean isPlanningIntent(String message) {
        String lower = message.toLowerCase();
        return lower.contains("plan") || lower.contains("itinerary") || lower.contains("day-wise") || lower.contains("day wise") || lower.contains("schedule");
    }

    private Destination resolveDestination(String message, Map<String, Object> context) {
        if (context.get("destination") != null) {
            String destName = context.get("destination").toString();
            return destinationRepository.findByNameIgnoreCase(destName).orElse(null);
        }
        String lower = message.toLowerCase();
        for (Destination dest : destinationRepository.findAll()) {
            if (lower.contains(dest.getName().toLowerCase())) {
                return dest;
            }
        }
        return null;
    }

    private Integer extractDays(String message) {
        Pattern pattern = Pattern.compile("(\\d+)\\s*(?:day|days|night|nights)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(message);
        if (matcher.find()) {
            try { return Integer.parseInt(matcher.group(1)); } catch (NumberFormatException ignored) {}
        }
        return null;
    }

    private String extractBudgetType(String message) {
        String text = message.toLowerCase();
        if (text.contains("luxury") || text.contains("premium") || text.contains("high-end")) return "LUXURY";
        if (text.contains("budget") || text.contains("cheap") || text.contains("economy")) return "LOW";
        if (text.contains("mid") || text.contains("mid-range") || text.contains("moderate")) return "MID";
        return null;
    }

    private String extractTransportMode(String message) {
        String text = message.toLowerCase();
        if (text.contains("flight")) return "FLIGHT";
        if (text.contains("train")) return "TRAIN";
        if (text.contains("bus")) return "BUS";
        if (text.contains("cab") || text.contains("taxi") || text.contains("car")) return "CAB";
        return null;
    }

    private String extractFoodPreference(String message) {
        String text = message.toLowerCase();
        if (text.contains("vegan") || text.contains("vegetarian") || text.contains("non-veg")) return text.contains("vegan") ? "Vegan" : text.contains("vegetarian") ? "Vegetarian" : "Non-Veg";
        return null;
    }

    private String normalizeContextString(Object raw, String defaultValue) {
        if (raw == null) return defaultValue;
        String value = raw.toString().trim();
        return value.isBlank() ? defaultValue : value;
    }

    private int normalizeContextInt(Object raw, int defaultValue) {
        if (raw instanceof Number) {
            return ((Number) raw).intValue();
        }
        if (raw == null) return defaultValue;
        try {
            return Integer.parseInt(raw.toString().trim());
        } catch (NumberFormatException ignored) {
            return defaultValue;
        }
    }

    private List<String> parseTextArray(String raw) {
        if (raw == null || raw.isBlank()) return Collections.emptyList();
        try {
            var root = mapper.readTree(raw);
            if (root.isArray()) {
                List<String> values = new ArrayList<>();
                for (var element : root) {
                    if (element.isTextual()) {
                        values.add(element.asText());
                    } else if (element.has("name")) {
                        values.add(element.get("name").asText());
                    } else {
                        values.add(element.toString().replaceAll("[\\[\\]\"]", ""));
                    }
                }
                return values;
            }
        } catch (Exception ignored) {
        }
        String cleaned = raw.replaceAll("[\\[\\]\"]", "");
        String[] parts = cleaned.split(",");
        List<String> result = new ArrayList<>();
        for (String part : parts) {
            String value = part.trim();
            if (!value.isEmpty()) result.add(value);
        }
        return result;
    }

    private List<String> getHotelRecommendations(Destination destination, String budgetType, int max) {
        List<String> hotels = new ArrayList<>();
        if (destination.getHotels() == null) return hotels;
        try {
            List<Map<String, Object>> hotelList = mapper.readValue(destination.getHotels(), new TypeReference<List<Map<String, Object>>>() {});
            for (Map<String, Object> hotel : hotelList) {
                String type = hotel.getOrDefault("type", "MID").toString();
                if (budgetType.equals("MID") || type.equalsIgnoreCase(budgetType)) {
                    hotels.add(hotel.getOrDefault("name", "Hotel").toString());
                }
            }
            if (hotels.isEmpty()) {
                for (Map<String, Object> hotel : hotelList) {
                    hotels.add(hotel.getOrDefault("name", "Hotel").toString());
                }
            }
        } catch (Exception ignored) {
        }
        return hotels.subList(0, Math.min(max, hotels.size()));
    }

    private String buildItinerary(Destination destination, int days, String budgetType) {
        List<String> places = parseTextArray(destination.getFamousPlaces());
        List<String> foods = parseTextArray(destination.getLocalFood());
        List<String> hotels = getHotelRecommendations(destination, budgetType, 2);
        String hotelNames = hotels.isEmpty() ? "Local recommended hotels" : String.join(" / ", hotels);

        StringBuilder builder = new StringBuilder();
        builder.append("✅ Travel Plan (" + days + "-Day Trip – " + destination.getName() + ")\n");
        builder.append("📍 Destination: " + destination.getName() + "\n");
        builder.append("🗓 Duration: " + days + " Days\n");
        builder.append("🏨 Stay Preference: " + capitalize(budgetType) + "\n\n");

        for (int day = 1; day <= days; day++) {
            builder.append("DAY " + day + ":\n");
            String morning = selectItem(places, (day - 1) * 2);
            String afternoon = selectItem(places, (day - 1) * 2 + 1);
            String evening = "Evening leisure with local culture and a market visit";
            if (day == days) { evening = "Relaxation, souvenir shopping and a cultural show"; }
            builder.append("Morning (8:00–12:00): " + morning + "\n");
            builder.append("Afternoon (12:00–5:00): " + afternoon + "\n");
            builder.append("Evening (5:00–9:00): " + evening + "\n");
            String food = selectItem(foods, day - 1);
            builder.append("Food: " + food + "\n\n");
        }

        builder.append("🏨 Hotel Recommendation:\n" + hotelNames + "\n\n");
        builder.append(buildCostEstimate(destination, budgetType, days));
        return builder.toString();
    }

    private String buildCostEstimate(Destination destination, String budgetType, int days) {
        int hotelLow, hotelHigh, foodLow, foodHigh, travelLow, travelHigh;
        switch (budgetType) {
            case "LOW": hotelLow = destination.getLowBudgetPerDay(); hotelHigh = Math.max(destination.getLowBudgetPerDay(), destination.getMidBudgetPerDay() / 2); foodLow = 350; foodHigh = 600; travelLow = 300; travelHigh = 700; break;
            case "LUXURY": hotelLow = destination.getLuxuryBudgetPerDay(); hotelHigh = destination.getLuxuryBudgetPerDay() + 5000; foodLow = 1200; foodHigh = 2000; travelLow = 1200; travelHigh = 2200; break;
            default: hotelLow = destination.getMidBudgetPerDay(); hotelHigh = Math.max(destination.getMidBudgetPerDay(), destination.getLuxuryBudgetPerDay() / 2); foodLow = 700; foodHigh = 1200; travelLow = 700; travelHigh = 1500; break;
        }
        int totalLow = days * (hotelLow + foodLow + travelLow);
        int totalHigh = days * (hotelHigh + foodHigh + travelHigh);
        return "💰 Estimated Cost:\nHotel: ₹" + hotelLow + "–₹" + hotelHigh + " per night\nFood: ₹" + foodLow + "–₹" + foodHigh + " per day\nLocal travel & entry: ₹" + travelLow + "–₹" + travelHigh + " per day\nTotal " + days + "-day cost: ₹" + totalLow + "–₹" + totalHigh + " (approx.)";
    }

    private String buildTransportSummary(String to, String from, String mode, String date, List<Map<String, Object>> options) {
        StringBuilder builder = new StringBuilder();
        builder.append("Transport options from " + from + " to " + to + " on " + date + " via " + mode + ":\n");
        int bestPrice = Integer.MAX_VALUE;
        String bestOptionText = "";
        for (Map<String, Object> option : options) {
            Object classesObj = option.get("classes");
            if (classesObj instanceof List<?>) {
                for (Object clazz : (List<?>) classesObj) {
                    if (clazz instanceof Map<?, ?>) {
                        Map<?, ?> classMap = (Map<?, ?>) clazz;
                        Object priceObj = classMap.get("price");
                        if (priceObj != null) {
                            try {
                                int priceValue = Integer.parseInt(priceObj.toString());
                                if (priceValue < bestPrice) {
                                    bestPrice = priceValue;
                                    String className = classMap.getOrDefault("name", "").toString();
                                    String operator = option.getOrDefault("operator", "Option").toString();
                                    bestOptionText = operator + " " + className;
                                }
                            } catch (NumberFormatException ignored) {
                            }
                        }
                    }
                }
            }
        }
        if (bestPrice != Integer.MAX_VALUE) {
            builder.append("Best price: ₹" + bestPrice + " via " + mode + " (" + bestOptionText.trim() + ")\n\n");
        }
        for (int i = 0; i < Math.min(3, options.size()); i++) {
            Map<String, Object> option = options.get(i);
            String operator = option.getOrDefault("operator", "Option").toString();
            String duration = option.getOrDefault("duration", "N/A").toString();
            String price = "N/A";
            Object classesObj = option.get("classes");
            if (classesObj instanceof List<?> && !((List<?>) classesObj).isEmpty()) {
                List<?> clsList = (List<?>) classesObj;
                Object firstClass = clsList.get(0);
                if (firstClass instanceof Map<?, ?>) {
                    Map<?, ?> classMap = (Map<?, ?>) firstClass;
                    Object priceObj = classMap.get("price");
                    price = priceObj != null ? priceObj.toString() : "N/A";
                    Object classNameObj = classMap.get("name");
                    String className = classNameObj != null ? classNameObj.toString() : "";
                    if (!className.isBlank()) {
                        price = className + " ₹" + price;
                    }
                } else {
                    price = firstClass.toString();
                }
            }
            builder.append("• " + operator + " - " + duration + " / " + price + "\n");
        }
        builder.append("Ask me to book the best option when you are ready.");
        return builder.toString();
    }

    private boolean isBookingIntent(String message) {
        String lower = message.toLowerCase();
        return lower.contains("book") || lower.contains("reserve") || lower.contains("confirm");
    }

    private String selectItem(List<String> items, int index) {
        if (items.isEmpty()) return "Local sightseeing and cultural discovery";
        return items.get(index % items.size());
    }

    private String capitalize(String text) {
        if (text == null || text.isBlank()) return "Mid-Range";
        return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
    }
}
