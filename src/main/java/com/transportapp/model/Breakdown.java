package com.transportapp.model;

import java.time.LocalDateTime;

/**
 * Breakdown entity representing a vehicle breakdown report and its status.
 */
public class Breakdown {

    private Long id;
    private Long vehicleId;
    private Long scheduleId; // optional, if occurred during a schedule
    private LocalDateTime reportedAt;
    private String description;
    private String status; // Reported / In Repair / Resolved

    public Breakdown() {
    }

    public Breakdown(Long id, Long vehicleId, Long scheduleId,
                     LocalDateTime reportedAt, String description, String status) {
        this.id = id;
        this.vehicleId = vehicleId;
        this.scheduleId = scheduleId;
        this.reportedAt = reportedAt;
        this.description = description;
        this.status = status;
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

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public LocalDateTime getReportedAt() {
        return reportedAt;
    }

    public void setReportedAt(LocalDateTime reportedAt) {
        this.reportedAt = reportedAt;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

