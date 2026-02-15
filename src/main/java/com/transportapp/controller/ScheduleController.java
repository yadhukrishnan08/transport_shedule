package com.transportapp.controller;

import com.transportapp.dao.ScheduleDao;
import com.transportapp.model.Schedule;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Fleet Scheduling.
 */
@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "*")
public class ScheduleController {

    private final ScheduleDao scheduleDao;

    public ScheduleController(ScheduleDao scheduleDao) {
        this.scheduleDao = scheduleDao;
    }

    @GetMapping
    public List<Schedule> list() {
        return scheduleDao.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Schedule schedule) {
        scheduleDao.create(schedule);
        return ResponseEntity.ok("Schedule created");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Schedule schedule) {
        schedule.setId(id);
        scheduleDao.update(schedule);
        return ResponseEntity.ok("Schedule updated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        scheduleDao.delete(id);
        return ResponseEntity.ok("Schedule deleted");
    }
}

