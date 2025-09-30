package com.co.smartplanner_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableScheduling
public class SmartPlannerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartPlannerApplication.class, args);
    }

}
