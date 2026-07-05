package com.stockmarket.service;

import com.stockmarket.exception.CustomException;
import com.stockmarket.model.Stock;
import com.stockmarket.repository.StockRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockService {

    private final StockRepository stockRepository;

    // Get all stocks
    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }

    // Get stock by ID
    public Stock getStockById(Long id) {
        return stockRepository.findById(id)
                .orElseThrow(() -> new CustomException(
                        "Stock not found with id: " + id, HttpStatus.NOT_FOUND));
    }

    // Get stock by symbol
    public Stock getStockBySymbol(String symbol) {
        return stockRepository.findByStockSymbol(symbol.toUpperCase())
                .orElseThrow(() -> new CustomException(
                        "Stock not found: " + symbol, HttpStatus.NOT_FOUND));
    }

    // Search stocks by name or symbol
    public List<Stock> searchStocks(String term) {
        return stockRepository.searchStocks(term);
    }

    // Filter stocks by sector
    public List<Stock> getStocksBySector(String sector) {
        return stockRepository.findBySectorIgnoreCase(sector);
    }

    // Top 5 gainers
    public List<Stock> getTopGainers() {
        List<Stock> gainers = stockRepository.findTopGainers();
        return gainers.stream()
                .filter(s -> s.getPriceChangePercent() > 0)
                .limit(5)
                .toList();
    }

    // Top 5 losers
    public List<Stock> getTopLosers() {
        List<Stock> losers = stockRepository.findTopLosers();
        return losers.stream()
                .filter(s -> s.getPriceChangePercent() < 0)
                .limit(5)
                .toList();
    }

    /**
     * Simulates live price updates every 30 seconds.
     * In production, replace this with a real market data API.
     * Price changes randomly by -2% to +2%.
     */
    @Scheduled(fixedRate = 30000)
    public void simulatePriceUpdates() {
        List<Stock> stocks = stockRepository.findAll();
        for (Stock stock : stocks) {
            double changePercent = (Math.random() * 4) - 2; // -2% to +2%
            double oldPrice      = stock.getCurrentPrice();
            double newPrice      = oldPrice * (1 + changePercent / 100);
            newPrice             = Math.round(newPrice * 100.0) / 100.0;

            stock.setPreviousPrice(oldPrice);
            stock.setCurrentPrice(newPrice);
            stockRepository.save(stock);
        }
        log.debug("Stock prices updated");
    }
}