package com.transportapp.model;

import java.time.LocalDateTime;

/**
 * Schedule entity representing assignment of a vehicle and driver to a route at a given date/time.
 */
public class Schedule {

    private Long id;
    private Long vehicleId;
    private Long driverId;
    private Long routeId;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;

    public Schedule() {
    }

    public Schedule(Long id, Long vehicleId, Long driverId, Long routeId,
                    LocalDateTime departureTime, LocalDateTime arrivalTime) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.driverId = driverId;
        this.routeId = routeId;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(Long vehicleId) {
        this.vehicleId = vehicleId;
    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public Long getRouteId() {
        return routeId;
    }

    public void setRouteId(Long routeId) {
        this.routeId = routeId;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalDateTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }
}

