package com.stockmarket.repository;

import com.stockmarket.model.Portfolio;
import com.stockmarket.model.Stock;
import com.stockmarket.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    List<Portfolio> findByUser(User user);

    Optional<Portfolio> findByUserAndStock(User user, Stock stock);

    @Query("SELECT COALESCE(SUM(p.quantity * p.stock.currentPrice), 0) " +
           "FROM Portfolio p WHERE p.user = :user")
    Double getTotalPortfolioValue(User user);

    @Query("SELECT COALESCE(SUM(p.quantity * p.averageBuyPrice), 0) " +
           "FROM Portfolio p WHERE p.user = :user")
    Double getTotalInvestedValue(User user);
}