package com.stockmarket.controller;

import com.stockmarket.model.Transaction;
import com.stockmarket.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    // GET /api/transactions
    @GetMapping
    public ResponseEntity<List<Transaction>> getTransactions(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                transactionService.getTransactions(userDetails.getUsername()));
    }

    // GET /api/transactions/recent
    @GetMapping("/recent")
    public ResponseEntity<List<Transaction>> getRecentTransactions(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
                transactionService.getRecentTransactions(userDetails.getUsername()));
    }
}