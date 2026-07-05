package com.stockmarket;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StockMarketBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(StockMarketBackendApplication.class, args);
        System.out.println("""
                ╔══════════════════════════════════════════╗
                ║   Stock Market System — Backend Started  ║
                ║   API running at http://localhost:8080   ║
                ╚══════════════════════════════════════════╝
                """);
    }
}