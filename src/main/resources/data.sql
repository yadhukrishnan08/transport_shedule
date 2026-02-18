-- Sample data for quick demo

USE transport_db;

-- Users (Admin, Drivers, Mechanics)
INSERT INTO users (username, password, role) VALUES
('admin', 'admin', 'ADMIN'),
('ravi', 'password', 'DRIVER'),
('anil', 'password', 'DRIVER'),
('suresh', 'password', 'DRIVER'),
('mech1', 'password', 'MECHANIC'),
('mech2', 'password', 'MECHANIC')
ON DUPLICATE KEY UPDATE password = VALUES(password), role = VALUES(role);

-- Vehicles
INSERT INTO vehicles (registration_number, type, depot, status) VALUES
('KL-01-AB-1234', 'Bus', 'Central Depot', 'Available'),
('KL-02-CD-5678', 'Mini Bus', 'North Depot', 'On Route'),
('KL-03-EF-9012', 'Bus', 'South Depot', 'Under Repair')
ON DUPLICATE KEY UPDATE type = VALUES(type), depot = VALUES(depot), status = VALUES(status);

-- Drivers (linked to users via username)
INSERT INTO drivers (name, license_number, phone, depot, username) VALUES
('Ravi Kumar', 'LIC-DR-1001', '9876543210', 'Central Depot', 'ravi'),
('Anil Singh', 'LIC-DR-1002', '9876500000', 'North Depot', 'anil'),
('Suresh Das', 'LIC-DR-1003', '9876511111', 'South Depot', 'suresh')
ON DUPLICATE KEY UPDATE name = VALUES(name), phone = VALUES(phone), depot = VALUES(depot), username = VALUES(username);

-- Routes
INSERT INTO routes (code, origin, destination, distance_km) VALUES
('R001', 'Central Station', 'Airport', '25'),
('R002', 'City Center', 'IT Park', '15'),
('R003', 'Old Town', 'University', '18')
ON DUPLICATE KEY UPDATE origin = VALUES(origin), destination = VALUES(destination), distance_km = VALUES(distance_km);

-- Example schedules (using NOW() for simplicity)
INSERT INTO schedules (vehicle_id, driver_id, route_id, departure_time, arrival_time) VALUES
(1, 1, 1, NOW(), DATE_ADD(NOW(), INTERVAL 1 HOUR)),
(2, 2, 2, DATE_ADD(NOW(), INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 3 HOUR))
ON DUPLICATE KEY UPDATE departure_time = VALUES(departure_time), arrival_time = VALUES(arrival_time);

-- Example breakdown
INSERT INTO breakdowns (vehicle_id, schedule_id, reported_at, description, status) VALUES
(3, NULL, NOW(), 'Engine overheating reported at depot', 'In Repair')
ON DUPLICATE KEY UPDATE description = VALUES(description), status = VALUES(status);

-- Example maintenance logs
INSERT INTO maintenance_logs (vehicle_id, service_date, description, cost) VALUES
(1, DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'Oil change and inspection', 2500.00),
(3, DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'Engine repair after overheating', 15000.00);

