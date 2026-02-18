package com.transportapp.controller;

import com.transportapp.dao.BreakdownDao;
import com.transportapp.model.Breakdown;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * REST controller for Breakdown reporting and status updates.
 */
@RestController
@RequestMapping("/api/breakdowns")
@CrossOrigin(origins = "*")
public class BreakdownController {

    private final BreakdownDao breakdownDao;

    public BreakdownController(BreakdownDao breakdownDao) {
        this.breakdownDao = breakdownDao;
    }

    @GetMapping
    public List<Breakdown> list() {
        return breakdownDao.findAll();
    }

    @PostMapping
    public ResponseEntity<?> report(@RequestBody Breakdown breakdown) {
        // Automatically set report time and default status if not provided
        if (breakdown.getReportedAt() == null) {
            breakdown.setReportedAt(LocalDateTime.now());
        }
        if (breakdown.getStatus() == null || breakdown.getStatus().isBlank()) {
            breakdown.setStatus("Reported");
        }
        breakdownDao.create(breakdown);
        return ResponseEntity.ok("Breakdown reported");
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        breakdownDao.updateStatus(id, status);
        return ResponseEntity.ok("Breakdown status updated");
    }
}

