package com.transportapp.controller;

import com.transportapp.dao.RouteDao;
import com.transportapp.model.Route;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller exposing CRUD operations for Routes.
 */
@RestController
@RequestMapping("/api/routes")
@CrossOrigin(origins = "*")
public class RouteController {

    private final RouteDao routeDao;

    public RouteController(RouteDao routeDao) {
        this.routeDao = routeDao;
    }

    @GetMapping
    public List<Route> list() {
        return routeDao.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Route route) {
        routeDao.create(route);
        return ResponseEntity.ok("Route created");
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Route route) {
        route.setId(id);
        routeDao.update(route);
        return ResponseEntity.ok("Route updated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        routeDao.delete(id);
        return ResponseEntity.ok("Route deleted");
    }
}

