# ✈️ Travel Assistant - Complete Setup & Running Guide

## Prerequisites

Before running this project, ensure you have the following installed:

### Required Software:
1. **Java 17 or higher** - Download from [oracle.com](https://www.oracle.com/java/technologies/downloads/)
2. **Maven 3.9+** - Download from [maven.apache.org](https://maven.apache.org/download.cgi)
3. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
4. **MySQL 8.0+** (optional, project uses H2 by default)

### Verify Installation:
```bash
java -version
mvn -version
node -version
npm -version
```

---

## Project Structure

```
TG-Assistant/
├── travel-assistant/
│   ├── backend/          ← Spring Boot API
│   ├── frontend/         ← Angular UI
│   └── database/         ← MySQL scripts
├── HOW_TO_RUN.md         ← This file
└── package.json
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Start Backend (Java/Spring Boot)

**Navigate to backend folder:**
```bash
cd travel-assistant/backend
```

**Run the backend:**
```bash
mvn spring-boot:run
```

**Expected Output:**
```
Tomcat started on port 8080 (http)
Started TravelAssistantApplication in X.XXX seconds
```

✅ Backend is now running on: **http://localhost:8080**

---

### Step 2: Start Frontend (Angular)

**Open a NEW terminal and navigate to frontend folder:**
```bash
cd travel-assistant/frontend
```

**Install dependencies (first time only):**
```bash
npm install
```

**Run the frontend:**
```bash
npm start
```

**Or use Angular CLI directly:**
```bash
ng serve
```

**Expected Output:**
```
✔ Building...
...
✓ Application bundle generation complete. [X.XXX seconds]
Watch mode enabled. Watching for file changes...
  ➜  Local:   http://localhost:4200/
```

✅ Frontend is now running on: **http://localhost:4200**

---

### Step 3: Access the Application

**Open your browser and visit:**
- **Application:** http://localhost:4200
- **Admin Dashboard:** http://localhost:4200/admin

---

## 🔐 Admin Credentials

```
Email:    admin@tripx.com
Password: Admin@Tripx2026
```

---

## 📊 API Endpoints

### Public Endpoints:
```bash
# Get all destinations
GET http://localhost:8080/api/destinations

# Register user
POST http://localhost:8080/api/auth/register

# User login
POST http://localhost:8080/api/auth/login
```

### Admin Endpoints:
```bash
# Admin login
POST http://localhost:8080/api/auth/login
Body: {
  "email": "admin@tripx.com",
  "password": "Admin@Tripx2026"
}

# Get all users (Admin only)
GET http://localhost:8080/api/admin/users

# Get all bookings (Admin only)
GET http://localhost:8080/api/admin/bookings

# Get dashboard stats (Admin only)
GET http://localhost:8080/api/admin/dashboard/stats
```

---

## 💾 Database Setup

### Default (H2 In-Memory Database)
✅ No setup required! The project uses H2 by default.
✅ Admin user is auto-created on first run.
✅ 9 sample destinations are pre-loaded.

### Switch to MySQL (Optional)

**1. Create MySQL database:**
```bash
mysql -u root -p < travel-assistant/database/mysql_setup.sql
```

**2. Edit `travel-assistant/backend/src/main/resources/application.properties`:**

**Comment out H2 section:**
```properties
# spring.datasource.url=jdbc:h2:mem:testdb
# spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

**Uncomment MySQL section:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/tripx_db?useSSL=false&serverTimezone=UTC
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=tripx_user
spring.datasource.password=YourStrongPassword@123
```

**3. Restart backend:**
```bash
mvn spring-boot:run
```

---

## 🎨 Features

### User Features:
- ✅ Browse destinations with details
- ✅ View real-time weather
- ✅ Search and book trips
- ✅ Make payments (Multiple methods)
- ✅ View booking history
- ✅ Write reviews

### Admin Features:
- 📊 Dashboard with analytics
- 👥 Manage users (view, block/unblock)
- 🎟️ View all bookings
- 💳 Track payments
- ✈️ Manage trip plans
- 🏖️ Add/Edit destinations

---

## 🛠️ Troubleshooting

### Port Already in Use

**frontend (4200):**
```bash
# Kill process on port 4200
# Windows:
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:4200 | xargs kill -9
```

**Backend (8080):**
```bash
# Kill process on port 8080
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8080 | xargs kill -9
```

### Maven Not Found
```bash
# Set MAVEN_HOME environment variable
# Or download Maven from: https://maven.apache.org/download.cgi
# Extract and add to PATH
```

### Node Modules Issues
```bash
# Clear npm cache and reinstall
cd travel-assistant/frontend
rm -rf node_modules package-lock.json
npm install
```

### Backend Won't Start
```bash
# Check Java version (must be 17+)
java -version

# Check if port 8080 is available
netstat -an | grep 8080

# Check Maven installation
mvn -version

# Clean and rebuild
mvn clean install
mvn spring-boot:run
```

### Frontend Build Error
```bash
# Clear Angular cache
ng cache clean

# Or manually delete cache:
# Windows: rm -r .angular/cache
# Mac/Linux: rm -rf .angular/cache

# Reinstall dependencies
npm install
npm start
```

---

## 🚀 Running in Development Mode

### Backend with Hot Reload:
```bash
cd travel-assistant/backend
mvn clean install
mvn spring-boot:run
```

### Frontend with Hot Reload:
```bash
cd travel-assistant/frontend
ng serve --poll=2000
```

The `--poll` flag enables file watching for changes.

---

## 📦 Building for Production

### Backend:
```bash
cd travel-assistant/backend
mvn clean package
# JAR file will be in: target/tripx-travel-assistant-3.0.0.jar
```

### Frontend:
```bash
cd travel-assistant/frontend
ng build --configuration production
# Build output will be in: dist/travel-assistant-frontend/
```

---

## 🐳 Running with Docker (Optional)

### Backend Docker Build:
```bash
cd travel-assistant/backend
docker build -t travel-assistant-backend .
docker run -p 8080:8080 travel-assistant-backend
```

### Frontend Docker Build:
```bash
cd travel-assistant/frontend
docker build -t travel-assistant-frontend .
docker run -p 4200:4200 travel-assistant-frontend
```

---

## 🔄 Full Restart Process

**If something goes wrong, do a complete restart:**

```bash
# Kill both processes
# Then in Terminal 1:
cd travel-assistant/backend
mvn clean spring-boot:run

# In Terminal 2:
cd travel-assistant/frontend
npm start
```

---

## 📝 Environment Variables (Optional)

Create `.env` file in backend:
```
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=yourpassword
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.MySQL8Dialect
```

---

## ✅ Verification Checklist

After running, verify:

- [ ] Backend running: `curl http://localhost:8080/api/destinations`
- [ ] Frontend loading: Open http://localhost:4200
- [ ] Can see destinations list
- [ ] Admin login works: http://localhost:4200/admin
- [ ] API responding with data

---

## 📞 Support

If you encounter issues:

1. Check that both Java and Node.js are installed
2. Ensure ports 4200 and 8080 are not blocked
3. Check firewall settings
4. Try running in a different terminal
5. Clear cache and reinstall dependencies

---

## 🎯 Next Steps

1. **User Registration:** Create a test account
2. **Browse Destinations:** Explore available travel packages
3. **Make a Booking:** Test the booking flow
4. **Admin Panel:** Access admin features with default credentials
5. **Customize:** Modify destinations, add features, etc.

---

**Happy Traveling! 🌍✈️**
