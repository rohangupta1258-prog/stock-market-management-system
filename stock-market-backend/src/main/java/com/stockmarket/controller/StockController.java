package com.stockmarket.controller;

import com.stockmarket.model.Stock;
import com.stockmarket.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    // GET /api/stocks
    @GetMapping
    public ResponseEntity<List<Stock>> getAllStocks() {
        return ResponseEntity.ok(stockService.getAllStocks());
    }

    // GET /api/stocks/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Stock> getStockById(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.getStockById(id));
    }

    // GET /api/stocks/symbol/{symbol}
    @GetMapping("/symbol/{symbol}")
    public ResponseEntity<Stock> getStockBySymbol(@PathVariable String symbol) {
        return ResponseEntity.ok(stockService.getStockBySymbol(symbol));
    }

    // GET /api/stocks/search?term=apple
    @GetMapping("/search")
    public ResponseEntity<List<Stock>> searchStocks(@RequestParam String term) {
        return ResponseEntity.ok(stockService.searchStocks(term));
    }

    // GET /api/stocks/sector?name=Technology
    @GetMapping("/sector")
    public ResponseEntity<List<Stock>> getStocksBySector(@RequestParam String name) {
        return ResponseEntity.ok(stockService.getStocksBySector(name));
    }

    // GET /api/stocks/gainers
    @GetMapping("/gainers")
    public ResponseEntity<List<Stock>> getTopGainers() {
        return ResponseEntity.ok(stockService.getTopGainers());
    }

    // GET /api/stocks/losers
    @GetMapping("/losers")
    public ResponseEntity<List<Stock>> getTopLosers() {
        return ResponseEntity.ok(stockService.getTopLosers());
    }
}