package com.transportapp.model;

/**
 * Vehicle entity representing a public transport vehicle (bus, minibus, etc.).
 */
public class Vehicle {

    private Long id;
    private String registrationNumber;
    private String type;
    private String depot;
    private String status; // Available / On Route / Under Repair

    public Vehicle() {
    }

    public Vehicle(Long id, String registrationNumber, String type, String depot, String status) {
        this.id = id;
        this.registrationNumber = registrationNumber;
        this.type = type;
        this.depot = depot;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDepot() {
        return depot;
    }

    public void setDepot(String depot) {
        this.depot = depot;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

