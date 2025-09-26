package com.co.smartplanner_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SmartplannerBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartplannerBackendApplication.class, args);
	}

}
