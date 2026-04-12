package com.travel.config;

import com.travel.model.*;
import com.travel.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final DestinationRepository destRepo;
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;

    @Value("${admin.default.email:admin@tripx.com}")
    private String adminEmail;
    @Value("${admin.default.password:Admin@Tripx2024}")
    private String adminPassword;

    public DataInitializer(DestinationRepository dr, UserRepository ur, PasswordEncoder pe) {
        destRepo = dr; userRepo = ur; encoder = pe;
    }

    @Override
    public void run(String... args) {
        createAdminUser();
        if (destRepo.count() == 0) loadDestinations();
    }

    // ── Create default admin ──────────────────────────────────
    private void createAdminUser() {
        if (!userRepo.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName("Tripx Admin");
            admin.setEmail(adminEmail);
            admin.setPassword(encoder.encode(adminPassword));
            admin.setRole("ADMIN");
            admin.setPhone("+91-0000000000");
            admin.setCity("Bengaluru");
            admin.setEnabled(true);
            userRepo.save(admin);
            System.out.println("✅ Admin user created: " + adminEmail);
            System.out.println("   Password: " + adminPassword);
            System.out.println("   ⚠️  CHANGE THIS PASSWORD in production!");
        }
    }

    // ── Load sample destinations ──────────────────────────────
    private void loadDestinations() {
        saveGoa(); saveManali(); saveJaipur(); saveKerala();
        saveAgra(); saveVaranasi(); saveDarjeeling(); saveRishikesh(); saveMysuru();
        System.out.println("✅ 9 sample destinations loaded into database");
    }

    private void saveGoa() {
        Destination d = new Destination();
        d.setName("Goa"); d.setState("Goa"); d.setType("BEACH");
        d.setDescription("India's beach paradise with Portuguese heritage, stunning coastlines, vibrant nightlife and world-class seafood.");
        d.setImageUrl("https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800");
        d.setThumbnailUrl("https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400");
        d.setRating(4.5); d.setReviewCount(12500);
        d.setLatitude(15.2993); d.setLongitude(74.1240);
        d.setBestSeason("November to February"); d.setClimate("Tropical"); d.setLanguage("Konkani, English, Hindi");
        d.setFamousPlaces("[\"Baga Beach\",\"Anjuna Beach\",\"Basilica of Bom Jesus\",\"Fort Aguada\",\"Dudhsagar Falls\",\"Calangute Beach\",\"Chapora Fort\",\"Palolem Beach\"]");
        d.setLocalFood("[\"Fish Curry Rice\",\"Bebinca\",\"Xacuti\",\"Sorpotel\",\"Prawn Balchao\",\"Coconut Feni\",\"Cafreal\"]");
        d.setHotels("[{\"name\":\"Taj Exotica\",\"stars\":5,\"pricePerNight\":15000,\"type\":\"LUXURY\"},{\"name\":\"Kenilworth Beach\",\"stars\":4,\"pricePerNight\":6000,\"type\":\"MID\"},{\"name\":\"OYO Colva\",\"stars\":2,\"pricePerNight\":1500,\"type\":\"LOW\"}]");
        d.setFestivals("[{\"name\":\"Goa Carnival\",\"month\":\"February\",\"description\":\"Colorful street parade\"},{\"name\":\"Sunburn Festival\",\"month\":\"December\",\"description\":\"Asia's biggest EDM festival\"}]");
        d.setWeatherByMonth("{\"January\":{\"temp\":\"25-32°C\",\"rainfall\":\"Low\",\"description\":\"Perfect weather, peak season\"},\"February\":{\"temp\":\"25-33°C\",\"rainfall\":\"Low\",\"description\":\"Carnival month\"},\"June\":{\"temp\":\"26-30°C\",\"rainfall\":\"Very High\",\"description\":\"Monsoon season\"},\"November\":{\"temp\":\"26-33°C\",\"rainfall\":\"Low\",\"description\":\"Ideal weather\"},\"December\":{\"temp\":\"23-32°C\",\"rainfall\":\"Low\",\"description\":\"Christmas celebrations\"}}");
        d.setRecommendedDresses("[\"Light cotton shirts\",\"Shorts\",\"Sundresses\",\"Flip flops\",\"Swimwear\",\"Sun hat\"]");
        d.setTransportOptions("{\"fromBengaluru\":{\"FLIGHT\":{\"duration\":\"1h\",\"price\":\"3000-8000\",\"frequency\":\"Multiple daily\"},\"TRAIN\":{\"duration\":\"12h\",\"price\":\"400-2500\",\"frequency\":\"Few daily\"},\"BUS\":{\"duration\":\"10h\",\"price\":\"600-1500\",\"frequency\":\"Multiple daily\"}}}");
        d.setLowBudgetPerDay(2000); d.setMidBudgetPerDay(5000); d.setLuxuryBudgetPerDay(15000);
        d.setTags("beach,sun,nightlife,seafood,portuguese,water sports");
        destRepo.save(d);
    }

    private void saveManali() {
        Destination d = new Destination();
        d.setName("Manali"); d.setState("Himachal Pradesh"); d.setType("MOUNTAIN");
        d.setDescription("Scenic Himalayan destination with snow-capped peaks, adventure sports, ancient temples and pristine valleys.");
        d.setImageUrl("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800");
        d.setThumbnailUrl("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400");
        d.setRating(4.6); d.setReviewCount(9800); d.setLatitude(32.2432); d.setLongitude(77.1892);
        d.setBestSeason("October to June"); d.setClimate("Alpine"); d.setLanguage("Hindi, Kullu, Pahadi");
        d.setFamousPlaces("[\"Rohtang Pass\",\"Solang Valley\",\"Hadimba Temple\",\"Mall Road\",\"Beas River\",\"Old Manali\",\"Jogini Waterfall\",\"Vashisht Hot Springs\"]");
        d.setLocalFood("[\"Siddu\",\"Dham\",\"Tudkiya Bhath\",\"Madra\",\"Trout Fish\",\"Babru\"]");
        d.setHotels("[{\"name\":\"Span Resort\",\"stars\":5,\"pricePerNight\":12000,\"type\":\"LUXURY\"},{\"name\":\"Apple Country Resort\",\"stars\":4,\"pricePerNight\":5000,\"type\":\"MID\"},{\"name\":\"Zostel Manali\",\"stars\":2,\"pricePerNight\":700,\"type\":\"LOW\"}]");
        d.setFestivals("[{\"name\":\"Winter Carnival\",\"month\":\"January\",\"description\":\"Snow sports and cultural events\"},{\"name\":\"Kullu Dussehra\",\"month\":\"October\",\"description\":\"Legendary week-long festival\"}]");
        d.setWeatherByMonth("{\"January\":{\"temp\":\"-10 to 5°C\",\"rainfall\":\"Snow\",\"description\":\"Heavy snowfall, skiing\"},\"May\":{\"temp\":\"10 to 22°C\",\"rainfall\":\"Low\",\"description\":\"Best weather\"},\"July\":{\"temp\":\"15 to 22°C\",\"rainfall\":\"High\",\"description\":\"Monsoon, landslide risk\"}}");
        d.setRecommendedDresses("[\"Heavy woolen jacket\",\"Thermal innerwear\",\"Snow boots\",\"Gloves\",\"Windproof jacket\",\"Warm socks\"]");
        d.setTransportOptions("{\"fromDelhi\":{\"BUS\":{\"duration\":\"14-16h\",\"price\":\"500-1500\",\"frequency\":\"Multiple daily\"},\"FLIGHT\":{\"duration\":\"1h 15min (to Bhuntar)\",\"price\":\"4000-10000\",\"frequency\":\"2-3 daily\"}}}");
        d.setLowBudgetPerDay(1500); d.setMidBudgetPerDay(4000); d.setLuxuryBudgetPerDay(12000);
        d.setTags("mountains,snow,adventure,trekking,skiing,honeymoon,himalaya");
        destRepo.save(d);
    }

    private void saveJaipur() {
        Destination d = new Destination();
        d.setName("Jaipur"); d.setState("Rajasthan"); d.setType("HERITAGE");
        d.setDescription("The Pink City - a royal blend of majestic forts, vibrant bazaars, Rajput architecture and colorful culture.");
        d.setImageUrl("https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800");
        d.setThumbnailUrl("https://images.unsplash.com/photo-1477587458883-47145ed94245?w=400");
        d.setRating(4.4); d.setReviewCount(15600); d.setLatitude(26.9124); d.setLongitude(75.7873);
        d.setBestSeason("October to March"); d.setClimate("Semi-Arid"); d.setLanguage("Rajasthani, Hindi");
        d.setFamousPlaces("[\"Amber Fort\",\"Hawa Mahal\",\"City Palace\",\"Jantar Mantar\",\"Nahargarh Fort\",\"Jal Mahal\",\"Johari Bazaar\"]");
        d.setLocalFood("[\"Dal Baati Churma\",\"Ghewar\",\"Laal Maas\",\"Pyaaz Kachori\",\"Mawa Kachori\",\"Rajasthani Thali\"]");
        d.setHotels("[{\"name\":\"Rambagh Palace\",\"stars\":5,\"pricePerNight\":25000,\"type\":\"LUXURY\"},{\"name\":\"Jaipur Marriott\",\"stars\":4,\"pricePerNight\":6000,\"type\":\"MID\"},{\"name\":\"Zostel Jaipur\",\"stars\":2,\"pricePerNight\":600,\"type\":\"LOW\"}]");
        d.setFestivals("[{\"name\":\"Jaipur Literature Festival\",\"month\":\"January\",\"description\":\"World's largest free literary event\"},{\"name\":\"Teej Festival\",\"month\":\"August\",\"description\":\"Women's celebration\"}]");
        d.setWeatherByMonth("{\"January\":{\"temp\":\"8-22°C\",\"rainfall\":\"Low\",\"description\":\"Cool and pleasant\"},\"May\":{\"temp\":\"27-42°C\",\"rainfall\":\"Low\",\"description\":\"Very hot\"},\"November\":{\"temp\":\"11-27°C\",\"rainfall\":\"Low\",\"description\":\"Excellent weather\"}}");
        d.setRecommendedDresses("[\"Light cotton clothes\",\"Stole for temples\",\"Comfortable walking shoes\",\"Sunscreen\",\"Sunglasses\"]");
        d.setTransportOptions("{\"fromDelhi\":{\"TRAIN\":{\"duration\":\"4-5h\",\"price\":\"200-1200\",\"frequency\":\"Multiple daily\"},\"BUS\":{\"duration\":\"5h\",\"price\":\"300-800\",\"frequency\":\"Multiple daily\"},\"FLIGHT\":{\"duration\":\"1h\",\"price\":\"3000-7000\",\"frequency\":\"Multiple daily\"}}}");
        d.setLowBudgetPerDay(1200); d.setMidBudgetPerDay(3500); d.setLuxuryBudgetPerDay(20000);
        d.setTags("heritage,forts,palaces,rajasthan,culture,royalty,desert");
        destRepo.save(d);
    }

    private void saveKerala() {
        Destination d = new Destination();
        d.setName("Kerala"); d.setState("Kerala"); d.setType("NATURE");
        d.setDescription("God's Own Country — backwaters, tea gardens, spice plantations, Ayurveda and pristine beaches.");
        d.setImageUrl("https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800");
        d.setThumbnailUrl("https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400");
        d.setRating(4.7); d.setReviewCount(18200); d.setLatitude(10.8505); d.setLongitude(76.2711);
        d.setBestSeason("September to March"); d.setClimate("Tropical Humid"); d.setLanguage("Malayalam");
        d.setFamousPlaces("[\"Alleppey Backwaters\",\"Munnar Tea Gardens\",\"Periyar Wildlife\",\"Kovalam Beach\",\"Fort Kochi\",\"Varkala\",\"Wayanad\"]");
        d.setLocalFood("[\"Kerala Fish Curry\",\"Appam & Stew\",\"Puttu & Kadala\",\"Prawn Moilee\",\"Kerala Sadya\",\"Karimeen Pollichathu\"]");
        d.setHotels("[{\"name\":\"Kumarakom Lake Resort\",\"stars\":5,\"pricePerNight\":20000,\"type\":\"LUXURY\"},{\"name\":\"Houseboat Stay\",\"stars\":3,\"pricePerNight\":8000,\"type\":\"MID\"},{\"name\":\"Zostel Kochi\",\"stars\":2,\"pricePerNight\":700,\"type\":\"LOW\"}]");
        d.setFestivals("[{\"name\":\"Onam\",\"month\":\"August/September\",\"description\":\"Harvest festival with snake boat races\"},{\"name\":\"Thrissur Pooram\",\"month\":\"April/May\",\"description\":\"Grand elephant procession\"}]");
        d.setWeatherByMonth("{\"January\":{\"temp\":\"20-33°C\",\"rainfall\":\"Low\",\"description\":\"Perfect season\"},\"June\":{\"temp\":\"24-30°C\",\"rainfall\":\"Very High\",\"description\":\"Southwest monsoon\"},\"December\":{\"temp\":\"21-31°C\",\"rainfall\":\"Low\",\"description\":\"Excellent weather\"}}");
        d.setRecommendedDresses("[\"Light cotton clothes\",\"Modest clothing for temples\",\"Rain jacket for monsoon\",\"Comfortable sandals\"]");
        d.setTransportOptions("{\"fromBengaluru\":{\"TRAIN\":{\"duration\":\"7-9h\",\"price\":\"300-2000\",\"frequency\":\"Multiple daily\"},\"FLIGHT\":{\"duration\":\"1h 15min\",\"price\":\"3000-8000\",\"frequency\":\"Multiple daily\"}}}");
        d.setLowBudgetPerDay(1800); d.setMidBudgetPerDay(4500); d.setLuxuryBudgetPerDay(18000);
        d.setTags("backwaters,beaches,ayurveda,tea,wildlife,honeymoon");
        destRepo.save(d);
    }

    private void saveAgra() {
        Destination d = new Destination();
        d.setName("Agra"); d.setState("Uttar Pradesh"); d.setType("HERITAGE");
        d.setDescription("Home to the Taj Mahal — one of the Seven Wonders of the World and rich Mughal architecture.");
        d.setImageUrl("https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800");
        d.setThumbnailUrl("https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400");
        d.setRating(4.3); d.setReviewCount(22000); d.setLatitude(27.1767); d.setLongitude(78.0081);
        d.setBestSeason("October to March"); d.setClimate("Semi-Arid"); d.setLanguage("Hindi, Urdu");
        d.setFamousPlaces("[\"Taj Mahal\",\"Agra Fort\",\"Fatehpur Sikri\",\"Itmad-ud-Daulah\",\"Mehtab Bagh\",\"Jama Masjid\"]");
        d.setLocalFood("[\"Petha\",\"Dalmoth\",\"Mughlai Biryani\",\"Jalebi\",\"Bedai\",\"Gajak\"]");
        d.setHotels("[{\"name\":\"Oberoi Amarvilas\",\"stars\":5,\"pricePerNight\":35000,\"type\":\"LUXURY\"},{\"name\":\"Courtyard Marriott\",\"stars\":4,\"pricePerNight\":7000,\"type\":\"MID\"},{\"name\":\"Zostel Agra\",\"stars\":2,\"pricePerNight\":600,\"type\":\"LOW\"}]");
        d.setFestivals("[{\"name\":\"Taj Mahotsav\",\"month\":\"February\",\"description\":\"10-day cultural festival near Taj\"}]");
        d.setWeatherByMonth("{\"January\":{\"temp\":\"5-21°C\",\"rainfall\":\"Low\",\"description\":\"Cool, great for sightseeing\"},\"November\":{\"temp\":\"10-28°C\",\"rainfall\":\"Low\",\"description\":\"Perfect weather\"}}");
        d.setRecommendedDresses("[\"Comfortable walking shoes\",\"Light cotton in summer\",\"Warm layers in winter\",\"Modest attire for monuments\"]");
        d.setTransportOptions("{\"fromDelhi\":{\"TRAIN\":{\"duration\":\"2h (Gatimaan Express)\",\"price\":\"750-1500\",\"frequency\":\"Few daily\"},\"BUS\":{\"duration\":\"3-4h\",\"price\":\"200-600\",\"frequency\":\"Multiple\"}}}");
        d.setLowBudgetPerDay(1000); d.setMidBudgetPerDay(3000); d.setLuxuryBudgetPerDay(25000);
        d.setTags("taj mahal,heritage,mughal,history,wonder,architecture");
        destRepo.save(d);
    }

    private void saveVaranasi() {
        Destination d = new Destination();
        d.setName("Varanasi"); d.setState("Uttar Pradesh"); d.setType("PILGRIMAGE");
        d.setDescription("One of the world's oldest living cities on the sacred Ganges — spirituality, ghats, and ancient temples.");
        d.setImageUrl("https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800");
        d.setThumbnailUrl("https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400");
        d.setRating(4.5); d.setReviewCount(11000); d.setLatitude(25.3176); d.setLongitude(82.9739);
        d.setBestSeason("October to March"); d.setClimate("Humid Subtropical"); d.setLanguage("Hindi, Bhojpuri");
        d.setFamousPlaces("[\"Dashashwamedh Ghat\",\"Kashi Vishwanath Temple\",\"Manikarnika Ghat\",\"Sarnath\",\"Ramnagar Fort\",\"Assi Ghat\",\"Ganga Aarti\"]");
        d.setLocalFood("[\"Banarasi Paan\",\"Kachori Sabzi\",\"Malaiyo\",\"Thandai\",\"Chaat\",\"Litti Chokha\"]");
        d.setHotels("[{\"name\":\"Taj Ganges\",\"stars\":5,\"pricePerNight\":12000,\"type\":\"LUXURY\"},{\"name\":\"Brijrama Palace\",\"stars\":4,\"pricePerNight\":8000,\"type\":\"MID\"},{\"name\":\"Stops Hostel\",\"stars\":2,\"pricePerNight\":500,\"type\":\"LOW\"}]");
        d.setFestivals("[{\"name\":\"Dev Deepawali\",\"month\":\"November\",\"description\":\"1 million lamps on the ghats\"},{\"name\":\"Ganga Mahotsav\",\"month\":\"November\",\"description\":\"Cultural festival on the Ganges\"}]");
        d.setWeatherByMonth("{\"January\":{\"temp\":\"8-20°C\",\"rainfall\":\"Low\",\"description\":\"Cool, pleasant\"},\"November\":{\"temp\":\"15-28°C\",\"rainfall\":\"Low\",\"description\":\"Dev Deepawali season\"}}");
        d.setRecommendedDresses("[\"Modest clothing\",\"Comfortable sandals\",\"Cotton kurta\",\"Stole/dupatta\",\"Warm layer in winter\"]");
        d.setTransportOptions("{\"fromDelhi\":{\"TRAIN\":{\"duration\":\"12h\",\"price\":\"450-2200\",\"frequency\":\"Multiple daily\"},\"FLIGHT\":{\"duration\":\"1h 30min\",\"price\":\"2500-8000\",\"frequency\":\"Multiple daily\"}}}");
        d.setLowBudgetPerDay(800); d.setMidBudgetPerDay(2500); d.setLuxuryBudgetPerDay(12000);
        d.setTags("spiritual,ghat,ganges,temple,pilgrimage,culture,ancient");
        destRepo.save(d);
    }

    private void saveDarjeeling() {
        Destination d = new Destination();
        d.setName("Darjeeling"); d.setState("West Bengal"); d.setType("MOUNTAIN");
        d.setDescription("Queen of Hills with world-famous tea, Toy Train UNESCO heritage, Tiger Hill sunrise and Kanchenjunga views.");
        d.setImageUrl("https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800");
        d.setThumbnailUrl("https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400");
        d.setRating(4.5); d.setReviewCount(7800); d.setLatitude(27.0410); d.setLongitude(88.2663);
        d.setBestSeason("March to May, September to November"); d.setClimate("Subtropical Highland"); d.setLanguage("Nepali, Bengali, Hindi");
        d.setFamousPlaces("[\"Tiger Hill Sunrise\",\"Darjeeling Himalayan Railway (Toy Train)\",\"Batasia Loop\",\"Tea Gardens\",\"Peace Pagoda\",\"Padmaja Naidu Zoo\",\"Happy Valley Tea Estate\"]");
        d.setLocalFood("[\"Momo\",\"Thukpa\",\"Darjeeling Tea\",\"Sel Roti\",\"Gundruk\",\"Aloo Dum\",\"Tongba\"]");
        d.setHotels("[{\"name\":\"Mayfair Darjeeling\",\"stars\":5,\"pricePerNight\":8000,\"type\":\"LUXURY\"},{\"name\":\"Windamere Hotel\",\"stars\":4,\"pricePerNight\":4000,\"type\":\"MID\"},{\"name\":\"Zostel Darjeeling\",\"stars\":2,\"pricePerNight\":600,\"type\":\"LOW\"}]");
        d.setFestivals("[{\"name\":\"Darjeeling Carnival\",\"month\":\"October\",\"description\":\"Cultural festival\"},{\"name\":\"Tihar Festival\",\"month\":\"October\",\"description\":\"Nepali lights festival\"}]");
        d.setWeatherByMonth("{\"March\":{\"temp\":\"8-18°C\",\"rainfall\":\"Low\",\"description\":\"Flowers blooming\"},\"April\":{\"temp\":\"10-19°C\",\"rainfall\":\"Low\",\"description\":\"Best views\"},\"July\":{\"temp\":\"14-18°C\",\"rainfall\":\"Very High\",\"description\":\"Monsoon, cloud cover\"}}");
        d.setRecommendedDresses("[\"Woolen jacket\",\"Light sweater\",\"Rain jacket\",\"Comfortable trekking shoes\",\"Warm cap\"]");
        d.setTransportOptions("{\"fromKolkata\":{\"TRAIN\":{\"duration\":\"12h to NJP\",\"price\":\"350-1800\",\"frequency\":\"Multiple daily\"},\"FLIGHT\":{\"duration\":\"45min to Bagdogra\",\"price\":\"3000-8000\",\"frequency\":\"Multiple daily\"}}}");
        d.setLowBudgetPerDay(1200); d.setMidBudgetPerDay(3500); d.setLuxuryBudgetPerDay(10000);
        d.setTags("tea,toy train,himalaya,sunrise,trekking,colonial,hill station");
        destRepo.save(d);
    }

    private void saveRishikesh() {
        Destination d = new Destination();
        d.setName("Rishikesh"); d.setState("Uttarakhand"); d.setType("ADVENTURE");
        d.setDescription("Yoga capital of the world — river rafting, bungee jumping, ashrams, Beatles connection and Ganga aarti.");
        d.setImageUrl("https://images.unsplash.com/photo-1591018533103-056cc21fa1c4?w=800");
        d.setThumbnailUrl("https://images.unsplash.com/photo-1591018533103-056cc21fa1c4?w=400");
        d.setRating(4.6); d.setReviewCount(9200); d.setLatitude(30.0869); d.setLongitude(78.2676);
        d.setBestSeason("September to June"); d.setClimate("Subtropical"); d.setLanguage("Hindi, Garhwali");
        d.setFamousPlaces("[\"Laxman Jhula\",\"Ram Jhula\",\"Ganga River Rafting\",\"Neer Garh Waterfall\",\"Beatles Ashram\",\"Triveni Ghat Aarti\",\"Parmarth Niketan\",\"Bungee Jumping\"]");
        d.setLocalFood("[\"Aloo Puri\",\"Chole Bhature\",\"Lassi\",\"Satvik Thali\",\"Banana Pancake\",\"Rhododendron Juice\"]");
        d.setHotels("[{\"name\":\"Taj Rishikesh\",\"stars\":5,\"pricePerNight\":12000,\"type\":\"LUXURY\"},{\"name\":\"Aloha on Ganges\",\"stars\":4,\"pricePerNight\":4000,\"type\":\"MID\"},{\"name\":\"Zostel Rishikesh\",\"stars\":2,\"pricePerNight\":500,\"type\":\"LOW\"}]");
        d.setFestivals("[{\"name\":\"International Yoga Festival\",\"month\":\"March\",\"description\":\"World's largest yoga gathering\"},{\"name\":\"Ganga Dussehra\",\"month\":\"June\",\"description\":\"Sacred river festival\"}]");
        d.setWeatherByMonth("{\"October\":{\"temp\":\"15-28°C\",\"rainfall\":\"Low\",\"description\":\"Perfect for rafting\"},\"March\":{\"temp\":\"15-25°C\",\"rainfall\":\"Low\",\"description\":\"Yoga festival season\"},\"July\":{\"temp\":\"22-28°C\",\"rainfall\":\"High\",\"description\":\"Rafting suspended\"}}");
        d.setRecommendedDresses("[\"Light cotton\",\"Quick-dry clothes\",\"Water shoes for rafting\",\"Modest clothes for ashrams\",\"Warm layer for evenings\"]");
        d.setTransportOptions("{\"fromDelhi\":{\"BUS\":{\"duration\":\"5-6h\",\"price\":\"300-800\",\"frequency\":\"Multiple daily\"},\"TRAIN\":{\"duration\":\"5h to Haridwar\",\"price\":\"200-1200\",\"frequency\":\"Multiple daily\"}}}");
        d.setLowBudgetPerDay(1000); d.setMidBudgetPerDay(3000); d.setLuxuryBudgetPerDay(10000);
        d.setTags("yoga,rafting,adventure,spiritual,bungee,ashram,ganga,trekking");
        destRepo.save(d);
    }

    private void saveMysuru() {
        Destination d = new Destination();
        d.setName("Mysuru"); d.setState("Karnataka"); d.setType("HERITAGE");
        d.setDescription("City of Palaces — Mysuru Palace, Dasara festival, silk sarees, sandalwood and Chamundi Hills.");
        d.setImageUrl("https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800");
        d.setThumbnailUrl("https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400");
        d.setRating(4.4); d.setReviewCount(10500); d.setLatitude(12.2958); d.setLongitude(76.6394);
        d.setBestSeason("October to February"); d.setClimate("Tropical Savanna"); d.setLanguage("Kannada, Hindi, English");
        d.setFamousPlaces("[\"Mysuru Palace\",\"Chamundeshwari Temple\",\"Brindavan Gardens\",\"Karanji Lake\",\"St. Philomena's Church\",\"Devaraja Market\",\"Mysuru Zoo\"]");
        d.setLocalFood("[\"Mysore Pak\",\"Masala Dosa\",\"Mysore Rasam\",\"Bisi Bele Bath\",\"Obbattu\",\"Filter Coffee\",\"Mysore Sandesh\"]");
        d.setHotels("[{\"name\":\"Royal Orchid Metropole\",\"stars\":5,\"pricePerNight\":8000,\"type\":\"LUXURY\"},{\"name\":\"Fortune JP Palace\",\"stars\":4,\"pricePerNight\":4000,\"type\":\"MID\"},{\"name\":\"Hotel Maurya\",\"stars\":2,\"pricePerNight\":1200,\"type\":\"LOW\"}]");
        d.setFestivals("[{\"name\":\"Dasara Festival\",\"month\":\"October\",\"description\":\"World famous 10-day grand elephant procession\"},{\"name\":\"Flower Show\",\"month\":\"January\",\"description\":\"Annual flower show at Brindavan\"}]");
        d.setWeatherByMonth("{\"October\":{\"temp\":\"20-30°C\",\"rainfall\":\"Low\",\"description\":\"Dasara season — best time!\"},\"January\":{\"temp\":\"15-28°C\",\"rainfall\":\"Low\",\"description\":\"Pleasant cool weather\"},\"June\":{\"temp\":\"22-30°C\",\"rainfall\":\"High\",\"description\":\"Monsoon season\"}}");
        d.setRecommendedDresses("[\"Light cotton saree/kurta\",\"Comfortable walking shoes\",\"Modest attire for temples\",\"Sun hat\",\"Light jacket for evenings\"]");
        d.setTransportOptions("{\"fromBengaluru\":{\"BUS\":{\"duration\":\"3h\",\"price\":\"150-400\",\"frequency\":\"Every 30 minutes\"},\"TRAIN\":{\"duration\":\"2h\",\"price\":\"60-500\",\"frequency\":\"Multiple daily\"},\"CAB\":{\"duration\":\"3h\",\"price\":\"2000-3000\",\"frequency\":\"On demand\"}}}");
        d.setLowBudgetPerDay(1000); d.setMidBudgetPerDay(2500); d.setLuxuryBudgetPerDay(8000);
        d.setTags("palace,heritage,silk,sandalwood,dasara,garden,culture,karnataka");
        destRepo.save(d);
    }
}
