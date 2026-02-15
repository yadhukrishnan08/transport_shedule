package com.transportapp.controller;

import com.transportapp.dao.MaintenanceLogDao;
import com.transportapp.model.MaintenanceLog;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Maintenance logs (repair history and cost).
 */
@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "*")
public class MaintenanceController {

    private final MaintenanceLogDao maintenanceLogDao;

    public MaintenanceController(MaintenanceLogDao maintenanceLogDao) {
        this.maintenanceLogDao = maintenanceLogDao;
    }

    @GetMapping
    public List<MaintenanceLog> list() {
        return maintenanceLogDao.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody MaintenanceLog log) {
        maintenanceLogDao.create(log);
        return ResponseEntity.ok("Maintenance log created");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        maintenanceLogDao.delete(id);
        return ResponseEntity.ok("Maintenance log deleted");
    }
}

