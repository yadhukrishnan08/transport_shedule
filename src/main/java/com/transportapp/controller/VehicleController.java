package com.transportapp.controller;

import com.transportapp.dao.VehicleDao;
import com.transportapp.model.Vehicle;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller exposing CRUD operations for Vehicles.
 */
@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {

    private final VehicleDao vehicleDao;

    public VehicleController(VehicleDao vehicleDao) {
        this.vehicleDao = vehicleDao;
    }

    @GetMapping
    public List<Vehicle> list() {
        return vehicleDao.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Vehicle vehicle) {
        System.out.println("DEBUG: Creating vehicle: " + vehicle.getRegistrationNumber());
        vehicleDao.create(vehicle);
        return ResponseEntity.ok("Vehicle created");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Vehicle vehicle) {
        vehicle.setId(id);
        vehicleDao.update(vehicle);
        return ResponseEntity.ok("Vehicle updated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        vehicleDao.delete(id);
        return ResponseEntity.ok("Vehicle deleted");
    }
}
