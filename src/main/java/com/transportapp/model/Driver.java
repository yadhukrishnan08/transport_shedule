package com.transportapp.model;

/**
 * Driver entity representing a driver who can be assigned to a depot and routes.
 */
public class Driver {

    private Long id;
    private String name;
    private String licenseNumber;
    private String phone;
    private String depot;

    public Driver() {
    }

    public Driver(Long id, String name, String licenseNumber, String phone, String depot) {
        this.id = id;
        this.name = name;
        this.licenseNumber = licenseNumber;
        this.phone = phone;
        this.depot = depot;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepot() {
        return depot;
    }

    public void setDepot(String depot) {
        this.depot = depot;
    }
}

