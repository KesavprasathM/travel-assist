# ✈ Tripx Travel Assistant v3.0
## Full-Stack: Java 17 + Spring Boot 3.2 + Angular 17 + MySQL/H2

---

## ✅ Direct Answers to Your Questions

| Question | Answer |
|----------|--------|
| Is data stored in MySQL? | YES — all bookings, users, payments, trips saved to MySQL |
| Can I use H2 for development? | YES — switch by commenting one line in application.properties |
| Is there an admin backend page? | YES — go to http://localhost:4200/admin |
| Can admin see who booked? | YES — full user name, email, phone, city |
| Can admin see prices? | YES — every payment, booking amount, revenue totals |
| Can admin see travel routes? | YES — From → To, dates, transport type, trip plan |
| Is admin login protected? | YES — separate JWT, ROLE_ADMIN required for all /api/admin/* |
| Can I update the frontend later? | YES — Angular standalone components, each page is independent |

---

## 🚀 Quick Start

### Step 1 — MySQL Setup (for production)
```sql
-- Run database/mysql_setup.sql in MySQL Workbench or terminal:
mysql -u root -p < database/mysql_setup.sql
```

Then in `backend/src/main/resources/application.properties`:
```properties
# Uncomment MySQL lines, comment out H2 lines
spring.datasource.url=jdbc:mysql://localhost:3306/tripx_db?useSSL=false&serverTimezone=UTC
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=tripx_user
spring.datasource.password=YourStrongPassword@123
```

### Step 2 — Start Backend
```bash
cd backend
mvn spring-boot:run
```
✅ On first run: Admin user auto-created, 9 destinations auto-loaded

### Step 3 — Start Frontend
```bash
cd frontend
npm install
ng serve
```

---

## 🔐 Admin Dashboard

**URL:** http://localhost:4200/admin

**Default Credentials:**
```
Email:    admin@tripx.com
Password: Admin@Tripx2024
```
⚠️ Change these in `application.properties` before going live!

### What Admin Can See:

#### 📊 Dashboard
- Total users, bookings, revenue, trips, reviews
- Today's bookings & revenue
- Revenue breakdown by destination (bar chart)
- Top destination, top transport mode
- Pending payments & cancelled booking alerts

#### 👥 Users Panel
- Full list of all registered users
- Name, email, phone, city, join date
- Search by name or email
- Click any user → see ALL their bookings, trips, payments, total spent
- Block / Unblock any user

#### 🎟 Bookings Panel
- Every booking: reference number, user name, route (From→To)
- Travel date, passengers, total amount
- Payment status (PAID/PENDING/REFUNDED)
- Booking status (CONFIRMED/CANCELLED)
- Filter by status or transport type (FLIGHT/TRAIN/BUS/CAB)

#### 💳 Payments Panel
- Every payment: transaction ID, user, amount
- Payment method (CARD/UPI/NETBANKING/WALLET)
- Card last 4 digits or UPI ID
- Payment status
- Filter by SUCCESS/FAILED/PENDING/REFUNDED

#### ✈ Trip Plans Panel
- Every trip: user, source city, destination
- Dates, number of people, budget type
- Transport mode, total budget
- Filter by destination

#### 🏖 Destinations Management
- Add new destinations
- Edit existing (budget, description, image, season)
- Delete destinations

---

## 📁 Project Structure

```
tripx-travel-assistant/
├── database/
│   └── mysql_setup.sql          ← Run this for MySQL setup
├── backend/                     ← Spring Boot
│   ├── pom.xml                  ← MySQL + H2 + Jsoup + Rome + OpenPDF
│   └── src/main/java/com/travel/
│       ├── model/               ← User, Destination, TripPlan, Booking, Payment, Review
│       ├── repository/          ← JPA repos with admin queries
│       ├── service/             ← AuthService, AdminService, BookingService...
│       ├── controller/          ← REST APIs incl. AdminController
│       ├── security/            ← JWT with role extraction (ADMIN vs USER)
│       └── config/              ← SecurityConfig + DataInitializer (creates admin)
└── frontend/                    ← Angular 17
    └── src/app/
        ├── components/
        │   ├── admin/           ← Full admin dashboard (standalone component)
        │   ├── home/            ← Landing page
        │   ├── auth/            ← Login + Register
        │   ├── destinations/    ← Destination detail with live weather + map
        │   ├── planner/         ← AI trip planner
        │   ├── booking/         ← Transport search + booking
        │   ├── payment/         ← Card/UPI/NetBanking/Wallet
        │   ├── history/         ← User booking + trip history
        │   ├── weather/         ← Live weather widget
        │   └── map/             ← Leaflet.js map
        ├── services/            ← HTTP services
        ├── guards/              ← Auth guard
        └── interceptors/        ← JWT interceptor
```

---

## 🔌 Open Source Data (No Paid API)
| Source | Used For | Cost |
|--------|----------|------|
| Open-Meteo | Live weather forecast | FREE |
| OSM Nominatim | City → coordinates | FREE |
| Overpass API | Nearby hotels/restaurants | FREE |
| Wikipedia REST | Destination descriptions | FREE |
| GDACS RSS | Disaster alerts | FREE |
| Leaflet.js + OSM | Interactive maps | FREE |
| OpenPDF | PDF itinerary export | FREE |

---

## 🛡 Security
- Passwords: BCrypt hashed (never stored plain)
- JWT: Role-based (USER vs ADMIN in token payload)
- Admin routes: Double protection (@PreAuthorize + SecurityConfig)
- CORS: Restricted to localhost:4200
- MySQL: Separate user with limited privileges (not root)
- Input validation: Hibernate Validator on all DTOs

---

## 🔄 How to Update Frontend Later
Each page is a **standalone Angular component** — you can update them independently:
```bash
# Edit any component:
frontend/src/app/components/home/home.component.ts      ← Home page
frontend/src/app/components/booking/booking.component.ts ← Booking page
frontend/src/app/components/admin/admin.component.ts    ← Admin panel
# etc.

# After editing, Angular hot-reloads automatically during ng serve
# For production build:
ng build --configuration production
```
