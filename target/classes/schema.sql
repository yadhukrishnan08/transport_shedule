-- Schema for Public Transport Fleet Scheduling & Breakdown Management System

CREATE DATABASE IF NOT EXISTS transport_db;
USE transport_db;

-- =========================
-- Users (Admin accounts)
-- =========================
-- DROP TABLE IF EXISTS maintenance_logs;
-- DROP TABLE IF EXISTS breakdowns;
-- DROP TABLE IF EXISTS schedules;
-- DROP TABLE IF EXISTS routes;
-- DROP TABLE IF EXISTS drivers;
-- DROP TABLE IF EXISTS vehicles;
-- DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL
);

-- =========================
-- Vehicles
-- =========================
CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    depot VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'Available' -- Available / On Route / Under Repair
);

-- =========================
-- Drivers
-- =========================
CREATE TABLE IF NOT EXISTS drivers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(20),
    depot VARCHAR(100),
    username VARCHAR(50) UNIQUE -- Link to users table username
);

-- =========================
-- Routes
-- =========================
CREATE TABLE IF NOT EXISTS routes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    distance_km VARCHAR(20)
);

-- =========================
-- Schedules
-- =========================
CREATE TABLE IF NOT EXISTS schedules (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id BIGINT NOT NULL,
    driver_id BIGINT NOT NULL,
    route_id BIGINT NOT NULL,
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME,
    CONSTRAINT fk_schedule_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
    CONSTRAINT fk_schedule_driver FOREIGN KEY (driver_id) REFERENCES drivers (id),
    CONSTRAINT fk_schedule_route FOREIGN KEY (route_id) REFERENCES routes (id)
);

-- =========================
-- Breakdowns
-- =========================
CREATE TABLE IF NOT EXISTS breakdowns (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id BIGINT NOT NULL,
    schedule_id BIGINT NULL,
    reported_at DATETIME NOT NULL,
    description VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'Reported', -- Reported / In Repair / Resolved
    CONSTRAINT fk_breakdown_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
    CONSTRAINT fk_breakdown_schedule FOREIGN KEY (schedule_id) REFERENCES schedules (id)
);

-- =========================
-- Maintenance Logs
-- =========================
CREATE TABLE IF NOT EXISTS maintenance_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vehicle_id BIGINT NOT NULL,
    service_date DATE NOT NULL,
    description VARCHAR(255),
    cost DECIMAL(10,2),
    status VARCHAR(30) DEFAULT 'Scheduled',
    assigned_to BIGINT,
    CONSTRAINT fk_maintenance_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
    CONSTRAINT fk_maintenance_user FOREIGN KEY (assigned_to) REFERENCES users (id)
);

