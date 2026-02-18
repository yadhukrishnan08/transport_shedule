package com.transportapp.model;

/**
 * Route entity representing a transport route.
 */
public class Route {

    private Long id;
    private String code;
    private String origin;
    private String destination;
    private String distanceKm;

    public Route() {
    }

    public Route(Long id, String code, String origin, String destination, String distanceKm) {
        this.id = id;
        this.code = code;
        this.origin = origin;
        this.destination = destination;
        this.distanceKm = distanceKm;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(String distanceKm) {
        this.distanceKm = distanceKm;
    }
}

