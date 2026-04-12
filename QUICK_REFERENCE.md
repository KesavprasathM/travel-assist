# 🚀 Travel Assistant - Quick Reference Card

## Commands at a Glance

### Start Backend (Java/Spring Boot)
```bash
cd travel-assistant/backend
mvn spring-boot:run
```
✅ Runs on: **http://localhost:8080**

### Start Frontend (Angular)
```bash
cd travel-assistant/frontend
npm start
```
✅ Runs on: **http://localhost:4200**

### Start Both (Windows)
```bash
RUN_ALL.bat
```

### Start Both (Mac/Linux)
```bash
chmod +x run_all.sh
./run_all.sh
```

---

## URLs

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend | http://localhost:4200 | Web Application |
| Backend | http://localhost:8080 | REST API |
| Admin Dashboard | http://localhost:4200/admin | Admin Panel |
| API Docs | http://localhost:8080/swagger-ui.html | API Documentation |

---

## Credentials

```
Email:    admin@tripx.com
Password: Admin@Tripx2026
```

---

## Test API Endpoints

```bash
# Get all destinations
curl http://localhost:8080/api/destinations

# Admin login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tripx.com","password":"Admin@Tripx2026"}'

# Get users (requires JWT token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/admin/users
```

---

## First Time Setup

### 1️⃣ Install Dependencies
```bash
# Java 17+
java -version

# Maven 3.9+
mvn -version

# Node.js 18+
node -version
```

### 2️⃣ Install Frontend Packages
```bash
cd travel-assistant/frontend
npm install
```

### 3️⃣ Build Backend
```bash
cd travel-assistant/backend
mvn clean install
```

---

## Troubleshooting

| Problem | Command |
|---------|---------|
| Port 4200 in use | `ng serve --port 4201` |
| Port 8080 in use | Change `server.port` in application.properties |
| npm not found | `npm install -g npm` |
| Maven not found | Download from maven.apache.org |
| Java not found | Download Java 21 from oracle.com |

---

## File Locations

```
travel-assistant/
├── backend/
│   ├── pom.xml                    ← Maven config
│   ├── src/main/resources/
│   │   └── application.properties ← Database config
│   └── target/                    ← Compiled files
├── frontend/
│   ├── package.json               ← npm config
│   ├── angular.json               ← Angular config
│   ├── src/
│   │   ├── index.html
│   │   └── app/
│   │       ├── components/
│   │       └── services/
│   └── dist/                      ← Build output
└── database/
    └── mysql_setup.sql            ← MySQL schema
```

---

## Hot Tips

✅ Backend auto-creates admin on first run  
✅ 9 sample destinations pre-loaded  
✅ H2 database needs no setup  
✅ Frontend hot-reloads on file changes  
✅ Check browser console (F12) for frontend errors  
✅ Check terminal logs for backend errors  
✅ API docs available at localhost:8080/swagger-ui.html

---

## Environment Variables (Optional)

Create `.env` in backend folder:
```
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=password
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.MySQL8Dialect
SERVER_PORT=8080
```

---

## Terminal Tips

### Keep Logs While Developing
```bash
# Backend - shows all requests
mvn spring-boot:run

# Frontend - shows compilation errors
ng serve --poll=2000
```

### Clear Everything & Start Fresh
```bash
# Backend cleanup
cd travel-assistant/backend
mvn clean install

# Frontend cleanup
cd travel-assistant/frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Browser DevTools

**Frontend Debugging (F12):**
- Network tab: Check API calls
- Console: Check JavaScript errors
- Application: Check cookies/storage

**Backend Debugging:**
- Check terminal output
- 404 errors mean endpoint not found
- 500 errors mean server error (check logs)

---

## Database

**Switch from H2 to MySQL:**
1. Edit `application.properties` in backend
2. Uncomment MySQL lines
3. Comment H2 lines
4. Run: `mysql -u root -p < travel-assistant/database/mysql_setup.sql`
5. Restart backend

---

## Known Issues

| Issue | Fix |
|-------|-----|
| Admin can't login | Use default credentials exactly as shown |
| No destinations showing | Backend might not be running |
| API returns 404 | Check backend is on port 8080 |
| Page shows blank | Check browser console for errors (F12) |
| Slow startup | First run compiles everything (normal) |

---

## Performance Optimization

```bash
# Faster frontend development
ng serve --poll=2000 --configuration=development

# Faster backend startup
mvn spring-boot:run -Dspring-boot.run.arguments="--server.ssl.enabled=false"
```

---

## Useful Links

- [Maven Docs](https://maven.apache.org/guides/)
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [Angular Docs](https://angular.io/docs)
- [Bootstrap Docs](https://getbootstrap.com/docs)

---

## Contact & Support

1. Check `HOW_TO_RUN.md` for detailed setup
2. Check `TROUBLESHOOTING.md` for common issues
3. Review browser console for frontend errors (F12)
4. Review terminal for backend errors

---

**Happy Coding! 🎉**
