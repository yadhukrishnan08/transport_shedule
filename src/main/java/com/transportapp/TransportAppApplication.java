package com.transportapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Public Transport Fleet Scheduling & Breakdown Management System.
 *
 * This starts an embedded Tomcat server and exposes REST endpoints that are
 * consumed by the HTML/JavaScript frontend located under src/main/resources/static.
 */
@SpringBootApplication
public class TransportAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(TransportAppApplication.class, args);
    }
}

