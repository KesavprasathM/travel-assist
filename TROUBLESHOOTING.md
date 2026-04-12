# 🆘 Troubleshooting Guide - Travel Assistant

## Quick Fixes

### Everything Won't Start?
```bash
# 1. Check if ports are available
# Windows:
netstat -ano | findstr :8080
netstat -ano | findstr :4200

# Mac/Linux:
lsof -i :8080
lsof -i :4200
```

### Maven/Java Issues

**"mvn not found"**
- Download Maven: https://maven.apache.org/download.cgi
- Set MAVEN_HOME and add to PATH
- Verify: `mvn -version`

**"Java version not supported"**
```bash
# Check version (need 17+)
java -version

# Download Java 21 from:
# https://www.oracle.com/java/technologies/downloads/
```

**"Cannot find module com.travel"**
```bash
cd travel-assistant/backend
mvn clean compile
mvn spring-boot:run
```

---

### Frontend Issues

**"npm ERR! 404"**
```bash
cd travel-assistant/frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**"Angular CLI not found"**
```bash
# Must be in frontend directory
cd travel-assistant/frontend
npm install -g @angular/cli
npm start
```

**"Port 4200 already in use"**
```bash
# Windows:
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:4200 | xargs kill -9

# Or use different port:
ng serve --port 4201
```

---

### Backend Issues

**"Port 8080 already in use"**
```bash
# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:8080 | xargs kill -9

# Or specify different port in application.properties:
# server.port=9090
```

**"Database connection failed"**
- This is normal! Project uses H2 by default
- If you see H2 errors, it will still work
- Check logs for "HikariPool" message

**"Cannot compile project"**
```bash
cd travel-assistant/backend
mvn clean install -DskipTests
mvn spring-boot:run
```

**"Hibernate error"**
```bash
# This is often just a warning, not critical
# If app won't start, try:
mvn clean
mvn install
mvn spring-boot:run
```

---

### API Not Responding

**Check if backend is running:**
```bash
curl http://localhost:8080/api/destinations
```

Expected response:
```json
{
  "success": true,
  "message": "OK",
  "data": [...]
}
```

If not working:
1. Check backend terminal for errors
2. Verify port 8080 is listening
3. Restart backend with: `mvn clean spring-boot:run`

---

### Admin Login Not Working

**Current credentials:**
```
Email:    admin@tripx.com
Password: Admin@Tripx2026
```

**If login fails:**
1. Check backend logs for errors
2. Verify API is responding to login endpoint:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tripx.com","password":"Admin@Tripx2026"}'
```
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try incognito/private window

---

### Frontend Shows Blank Page

**Possible causes:**
1. Backend not running - check console
2. Port 4200 wrong - verify with `ng serve` output
3. Cache issue - clear browser cache
4. Build error - check terminal for compilation errors

**Solutions:**
```bash
# Clear Angular cache
ng cache clean

# or manually:
rm -rf .angular/cache

# Rebuild
ng serve --poll=2000
```

---

### Slow Performance

**Backend taking time to start:**
- First run compiles everything (~30 seconds normal)
- Uses H2 in-memory database (fast after startup)
- Loads 9 destinations on startup

**Frontend taking time to compile:**
- First `ng serve` generates source maps (~20 seconds)
- Subsequent reloads are faster (few seconds)
- Use `ng serve --poll=2000` for file watching

---

### Lost Admin Access

**If you forgot credentials:**
1. Database resets each restart (H2 in-memory)
2. Admin is recreated automatically
3. Use default: admin@tripx.com / Admin@Tripx2024

**To create new admin (MySQL only):**
```sql
INSERT INTO users (email, password, name, role)
VALUES ('newadmin@email.com', '<bcrypt_hash>', 'Admin', 'ROLE_ADMIN');
```

---

### Specific Error Messages

**"Listening on port 8080"**
✅ Backend started successfully

**"Application bundle generation complete"**
✅ Frontend compiled successfully

**"ng serve"：Port already in use**
```bash
ng serve --port 4201  # Use different port
```

**"HikariPool-1 - Starting"**
✅ Database connection initiating

**"Tomcat started on port 8080"**
✅ Backend ready to serve requests

---

### Complete Restart Procedure

If nothing works, try this:

```bash
# 1. Stop everything (Ctrl+C in both terminals)

# 2. Clean build
cd travel-assistant/backend
mvn clean install -DskipTests

cd ../frontend
rm -rf node_modules
npm install

# 3. Start fresh
# Terminal 1:
cd travel-assistant/backend
mvn spring-boot:run

# Terminal 2:
cd travel-assistant/frontend
npm start
```

---

### Check System Requirements

```bash
# Java (need 17+)
java -version

# Maven (need 3.6+)
mvn -version

# Node.js (need 14+)
node -version

# npm (need 6+)
npm -version
```

---

### Still Not Working?

**Check these files exist:**
- `travel-assistant/backend/pom.xml` ✓
- `travel-assistant/frontend/package.json` ✓
- `travel-assistant/frontend/angular.json` ✓

**Check logs:**
```bash
# Backend errors usually in terminal
# Frontend errors in browser console (F12)
# Backend logs: travel-assistant/backend/target/application.log
```

**Verify connectivity:**
```bash
# Backend responding?
curl http://localhost:8080

# Frontend loading?
curl http://localhost:4200

# API working?
curl http://localhost:8080/api/destinations
```

---

## Common Scenarios

### Scenario 1: Backend Running, Frontend Not
**Solution:**
```bash
cd travel-assistant/frontend
npm install
npm start
```

### Scenario 2: Frontend Running, Backend Not
**Solution:**
```bash
cd travel-assistant/backend
mvn clean spring-boot:run
```

### Scenario 3: Both Won't Start
**Solution:**
1. Check port 8080 and 4200 are free
2. Verify Java 17+ installed
3. Verify Maven installed
4. Verify Node.js installed
5. Try complete restart (see above)

### Scenario 4: Getting 404 Errors on API
**Solution:**
- Verify backend URL is http://localhost:8080
- Check backend is compiled: `mvn compile`
- Restart backend
- Check CORS settings in backend

---

## Windows-Specific Issues

**PowerShell execution policy error:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Git Bash vs CMD vs PowerShell:**
- Use CMD or PowerShell for Maven commands
- Use any terminal for NPM commands

---

## Mac-Specific Issues

**Maven not found after installation:**
```bash
# Add to ~/.bash_profile or ~/.zshrc
export PATH="/usr/local/opt/maven/libexec/bin:$PATH"

# Then reload:
source ~/.bash_profile
```

---

## Linux-Specific Issues

**Permission denied on script:**
```bash
chmod +x run_all.sh
./run_all.sh
```

**Port already in use (ports below 1024):**
```bash
# Restart needed, or use:
sudo netstat -tulpn | grep LISTEN
```

---

**Last Resort: Docker 🐳**

If everything fails, use Docker:
```bash
# Build
docker build -t travel-assistant-backend travel-assistant/backend
docker build -t travel-assistant-frontend travel-assistant/frontend

# Run
docker run -p 8080:8080 travel-assistant-backend
docker run -p 4200:4200 travel-assistant-frontend
```

---

**Still stuck? Check the HOW_TO_RUN.md for detailed setup instructions!**
