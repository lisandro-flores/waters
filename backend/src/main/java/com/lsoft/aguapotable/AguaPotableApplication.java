package com.lsoft.aguapotable;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AguaPotableApplication {
    public static void main(String[] args) {
        SpringApplication.run(AguaPotableApplication.class, args);
    }
}
