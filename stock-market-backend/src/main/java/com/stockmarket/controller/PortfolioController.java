package com.stockmarket.controller;

import com.stockmarket.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;

    // GET /api/portfolio
    @GetMapping
    public ResponseEntity<Map<String, Object>> getPortfolio(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                portfolioService.getPortfolioSummary(userDetails.getUsername()));
    }
}