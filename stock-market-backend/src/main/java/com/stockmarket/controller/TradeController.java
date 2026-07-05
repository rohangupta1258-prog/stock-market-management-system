package com.stockmarket.controller;

import com.stockmarket.dto.TradeRequest;
import com.stockmarket.service.TradeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trade")
@RequiredArgsConstructor
public class TradeController {

    private final TradeService tradeService;

    // POST /api/trade/buy
    @PostMapping("/buy")
    public ResponseEntity<String> buyStock(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TradeRequest request) {
        return ResponseEntity.ok(
                tradeService.buyStock(userDetails.getUsername(), request));
    }

    // POST /api/trade/sell
    @PostMapping("/sell")
    public ResponseEntity<String> sellStock(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody TradeRequest request) {
        return ResponseEntity.ok(
                tradeService.sellStock(userDetails.getUsername(), request));
    }
}