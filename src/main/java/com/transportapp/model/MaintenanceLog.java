package com.transportapp.model;

import java.time.LocalDate;

/**
 * MaintenanceLog entity representing repair history and cost for a vehicle.
 */
public class MaintenanceLog {

    private Long id;
    private Long vehicleId;
    private LocalDate serviceDate;
    private String description;
    private Double cost;
    private Long assignedTo;

    public MaintenanceLog() {
    }

    public MaintenanceLog(Long id, Long vehicleId, LocalDate serviceDate, String description, Double cost,
            Long assignedTo) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.serviceDate = serviceDate;
        this.description = description;
        this.cost = cost;
        this.assignedTo = assignedTo;
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

    public LocalDate getServiceDate() {
        return serviceDate;
    }

    public void setServiceDate(LocalDate serviceDate) {
        this.serviceDate = serviceDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public Long getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(Long assignedTo) {
        this.assignedTo = assignedTo;
    }
}
