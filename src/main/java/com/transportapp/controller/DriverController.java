package com.transportapp.controller;

import com.transportapp.dao.DriverDao;
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

    public DriverController(DriverDao driverDao) {
        this.driverDao = driverDao;
    }

    @GetMapping
    public List<Driver> list() {
        return driverDao.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Driver driver) {
        driverDao.create(driver);
        return ResponseEntity.ok("Driver created");
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

