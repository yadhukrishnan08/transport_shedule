package com.transportapp.controller;

import com.transportapp.dao.DriverDao;
import com.transportapp.dao.UserDao;
import com.transportapp.model.Driver;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller exposing CRUD operations for Drivers.
 */
@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "*")
public class DriverController {

    private final DriverDao driverDao;
    private final UserDao userDao;

    public DriverController(DriverDao driverDao, UserDao userDao) {
        this.driverDao = driverDao;
        this.userDao = userDao;
    }

    @GetMapping
    public List<Driver> list() {
        return driverDao.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Driver driver) {
        // Generate unique username: first name(lowercase) + 4 random digits
        String baseName = driver.getName().trim().split("\\s+")[0].toLowerCase();
        String username;
        int maxAttempts = 10;
        int attempts = 0;

        do {
            int randomCode = 1000 + (int) (Math.random() * 9000); // 1000-9999
            username = baseName + randomCode;
            attempts++;
        } while (userDao.findByUsername(username) != null && attempts < maxAttempts);

        if (userDao.findByUsername(username) != null) {
            return ResponseEntity.badRequest().body("Could not generate unique username. Please try again.");
        }

        // Create User account
        com.transportapp.model.User user = new com.transportapp.model.User();
        user.setUsername(username);
        user.setPassword("password"); // Default password
        user.setRole("DRIVER");
        userDao.create(user);

        // Assign username to driver and save
        driver.setUsername(username);
        driverDao.create(driver);

        return ResponseEntity.ok("Driver created with username: " + username + " and default password: 'password'");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Driver driver) {
        driver.setId(id);
        driverDao.update(driver);
        return ResponseEntity.ok("Driver updated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        driverDao.delete(id);
        return ResponseEntity.ok("Driver deleted");
    }
}
