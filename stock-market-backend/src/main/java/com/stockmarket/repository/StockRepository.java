package com.stockmarket.repository;

import com.stockmarket.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {

    Optional<Stock> findByStockSymbol(String stockSymbol);

    @Query("SELECT s FROM Stock s WHERE " +
           "LOWER(s.stockName) LIKE LOWER(CONCAT('%', :term, '%')) OR " +
           "LOWER(s.stockSymbol) LIKE LOWER(CONCAT('%', :term, '%'))")
    List<Stock> searchStocks(String term);

    List<Stock> findBySectorIgnoreCase(String sector);

    @Query("SELECT s FROM Stock s " +
           "WHERE s.previousPrice IS NOT NULL AND s.previousPrice > 0 " +
           "ORDER BY (s.currentPrice - s.previousPrice) / s.previousPrice DESC")
    List<Stock> findTopGainers();

    @Query("SELECT s FROM Stock s " +
           "WHERE s.previousPrice IS NOT NULL AND s.previousPrice > 0 " +
           "ORDER BY (s.currentPrice - s.previousPrice) / s.previousPrice ASC")
    List<Stock> findTopLosers();
}