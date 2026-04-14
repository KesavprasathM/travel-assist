package com.travel.service;
import com.travel.dto.BookingRequest;
import com.travel.model.*;
import com.travel.repository.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class BookingService {
    private final BookingRepository bookingRepo;
    private final TripPlanRepository tripRepo;
    private final UserRepository userRepo;
    public BookingService(BookingRepository br, TripPlanRepository tr, UserRepository ur) { bookingRepo=br;tripRepo=tr;userRepo=ur; }

    public Booking createBooking(BookingRequest req, String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        Booking b = new Booking();
        b.setUser(user);
        if (req.getTripPlanId() != null) b.setTripPlan(tripRepo.findById(req.getTripPlanId()).orElse(null));
        b.setBookingType(req.getBookingType());
        b.setBookingReference("TRV" + System.currentTimeMillis());
        b.setFromLocation(req.getFromLocation());
        b.setToLocation(req.getToLocation());
        b.setTravelDate(req.getTravelDate());
        b.setDepartureTime(req.getDepartureTime());
        b.setArrivalTime(req.getArrivalTime());
        b.setOperatorName(req.getOperatorName());
        b.setSeatClass(req.getSeatClass());
        b.setPassengers(req.getPassengers());
        b.setTotalAmount(req.getTotalAmount());
        b.setPassengerDetails(req.getPassengerDetails());
        b.setStatus("CONFIRMED");
        return bookingRepo.save(b);
    }

    public List<Booking> getUserBookings(String email) {
        User user = userRepo.findByEmail(email).orElseThrow();
        return bookingRepo.findByUserIdOrderByBookedAtDesc(user.getId());
    }

    public Booking getById(Long id) { return bookingRepo.findById(id).orElseThrow(); }

    public Booking cancelBooking(Long id) {
        Booking b = bookingRepo.findById(id).orElseThrow();
        b.setStatus("CANCELLED");
        b.setPaymentStatus("REFUNDED");
        return bookingRepo.save(b);
    }

    // Simulate transport search (local data)
    public List<Map<String, Object>> searchTransports(String from, String to, String date, String type) {
        List<Map<String, Object>> results = new ArrayList<>();
        String[] operators = type.equals("FLIGHT") ? new String[]{"IndiGo","Air India","SpiceJet","Vistara","GoFirst"} :
                             type.equals("TRAIN") ? new String[]{"Rajdhani Express","Shatabdi Express","Duronto","Jan Shatabdi","Garib Rath"} :
                             new String[]{"Savaari","Mega Cabs","OLA Outstation","Uber Intercity","Meru Cabs"};
        String[] classes = type.equals("FLIGHT") ? new String[]{"Economy","Business","First"} :
                           type.equals("TRAIN") ? new String[]{"Sleeper","3AC","2AC","1AC"} :
                           new String[]{"Sedan","SUV","Mini","Prime"};
        Random rand = new Random(Math.abs(from.hashCode() + to.hashCode()));
        int base = type.equals("FLIGHT") ? 3200 : type.equals("TRAIN") ? 600 : 1200;
        for (int i = 0; i < operators.length; i++) {
            Map<String, Object> t = new LinkedHashMap<>();
            t.put("id", "T" + (i+1) + System.currentTimeMillis());
            t.put("operator", operators[i]);
            t.put("type", type);
            t.put("from", from); t.put("to", to); t.put("date", date);
            int hour = 5 + rand.nextInt(14);
            t.put("departure", String.format("%02d:%02d", hour, rand.nextInt(4)*15));
            int dur = type.equals("FLIGHT") ? 1 + rand.nextInt(3) : type.equals("TRAIN") ? 4 + rand.nextInt(12) : 2 + rand.nextInt(4);
            t.put("arrival", String.format("%02d:%02d", (hour + dur) % 24, rand.nextInt(4)*15));
            t.put("duration", dur + "h " + (rand.nextInt(4)*15) + "m");
            List<Map<String,Object>> cls = new ArrayList<>();
            for (String c : classes) {
                int multiplier = 1;
                if (type.equals("FLIGHT")) multiplier = c.equals("Business") ? 2 : c.equals("First") ? 3 : 1;
                if (type.equals("TRAIN")) multiplier = c.equals("2AC") ? 2 : c.equals("1AC") ? 3 : 1;
                if (type.equals("CAB")) multiplier = c.equals("SUV") || c.equals("Prime") ? 2 : 1;
                int price = (base + rand.nextInt(base)) * multiplier;
                cls.add(Map.of("name", c, "price", price, "available", 3 + rand.nextInt(12)));
            }
            t.put("classes", cls);
            t.put("rating", Math.round((3.5 + rand.nextDouble() * 1.5) * 10.0) / 10.0);
            t.put("amenities", type.equals("FLIGHT") ? List.of("Meal","WiFi","USB") :
                                type.equals("TRAIN") ? List.of("Blanket","Pillow","Charging","Pantry") :
                                List.of("Water","Phone Charger","Luggage","Live Tracking"));
            results.add(t);
        }
        return results;
    }
}
