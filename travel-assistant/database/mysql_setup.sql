-- ═══════════════════════════════════════════════════
-- Tripx Travel Assistant — MySQL Setup Script
-- Run this ONCE before starting the Spring Boot app
-- ═══════════════════════════════════════════════════

-- 1. Create database
CREATE DATABASE IF NOT EXISTS tripx_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 2. Create dedicated user (don't use root in production)
CREATE USER IF NOT EXISTS 'tripx_user'@'localhost' IDENTIFIED BY 'Mphasis@123';
GRANT ALL PRIVILEGES ON tripx_db.* TO 'tripx_user'@'localhost';
FLUSH PRIVILEGES;

-- 3. Use the database
USE tripx_db;

-- Note: Spring Boot with ddl-auto=update will auto-create all tables.
-- The DataInitializer will auto-load 9 destinations and create the admin user.

-- ── Admin Credentials (set in application.properties) ──
-- Email:    admin@tripx.com
-- Password: Admin@Tripx2024
-- ⚠️ CHANGE THIS IN PRODUCTION!

-- ── To switch from H2 to MySQL in application.properties: ──
-- 1. Uncomment the MySQL datasource lines
-- 2. Comment out the H2 datasource lines
-- 3. Restart the Spring Boot application

SELECT 'Tripx MySQL setup complete!' AS message;
