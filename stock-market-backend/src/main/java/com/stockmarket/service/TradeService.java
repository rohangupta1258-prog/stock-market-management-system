package com.stockmarket.service;

import com.stockmarket.dto.TradeRequest;
import com.stockmarket.exception.CustomException;
import com.stockmarket.model.*;
import com.stockmarket.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class TradeService {

    private final UserRepository        userRepository;
    private final StockRepository       stockRepository;
    private final PortfolioRepository   portfolioRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public String buyStock(String username, TradeRequest request) {

        // 1. Load user and stock
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(
                        "User not found", HttpStatus.NOT_FOUND));

        Stock stock = stockRepository.findById(request.getStockId())
                .orElseThrow(() -> new CustomException(
                        "Stock not found", HttpStatus.NOT_FOUND));

        // 2. Calculate total cost
        double totalCost = stock.getCurrentPrice() * request.getQuantity();

        // 3. Validate balance
        if (user.getBalance() < totalCost) {
            throw new CustomException(
                    "Insufficient balance. Required: $" +
                    String.format("%.2f", totalCost) +
                    ", Available: $" + String.format("%.2f", user.getBalance()),
                    HttpStatus.BAD_REQUEST);
        }

        // 4. Deduct balance
        user.setBalance(user.getBalance() - totalCost);
        userRepository.save(user);

        // 5. Update or create portfolio entry
        Portfolio portfolio = portfolioRepository
                .findByUserAndStock(user, stock)
                .orElse(Portfolio.builder()
                        .user(user)
                        .stock(stock)
                        .quantity(0)
                        .averageBuyPrice(0.0)
                        .build());

        // Recalculate weighted average buy price
        double totalQty      = portfolio.getQuantity() + request.getQuantity();
        double newAvgPrice   = ((portfolio.getQuantity() * portfolio.getAverageBuyPrice())
                               + (request.getQuantity() * stock.getCurrentPrice()))
                               / totalQty;

        portfolio.setQuantity((int) totalQty);
        portfolio.setAverageBuyPrice(newAvgPrice);
        portfolioRepository.save(portfolio);

        // 6. Record transaction
        Transaction transaction = Transaction.builder()
                .user(user)
                .stock(stock)
                .type(Transaction.TransactionType.BUY)
                .quantity(request.getQuantity())
                .pricePerShare(stock.getCurrentPrice())
                .totalValue(totalCost)
                .build();
        transactionRepository.save(transaction);

        log.info("BUY: {} bought {} shares of {} at ${}",
                username, request.getQuantity(),
                stock.getStockSymbol(), stock.getCurrentPrice());

        return "Successfully bought " + request.getQuantity() +
               " shares of " + stock.getStockSymbol();
    }

    @Transactional
    public String sellStock(String username, TradeRequest request) {

        // 1. Load user and stock
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(
                        "User not found", HttpStatus.NOT_FOUND));

        Stock stock = stockRepository.findById(request.getStockId())
                .orElseThrow(() -> new CustomException(
                        "Stock not found", HttpStatus.NOT_FOUND));

        // 2. Check portfolio holding
        Portfolio portfolio = portfolioRepository
                .findByUserAndStock(user, stock)
                .orElseThrow(() -> new CustomException(
                        "You don't own any shares of " + stock.getStockSymbol(),
                        HttpStatus.BAD_REQUEST));

        // 3. Validate quantity
        if (portfolio.getQuantity() < request.getQuantity()) {
            throw new CustomException(
                    "Insufficient shares. You own " + portfolio.getQuantity() +
                    " shares of " + stock.getStockSymbol(),
                    HttpStatus.BAD_REQUEST);
        }

        // 4. Calculate sale proceeds
        double totalProceeds = stock.getCurrentPrice() * request.getQuantity();

        // 5. Credit balance
        user.setBalance(user.getBalance() + totalProceeds);
        userRepository.save(user);

        // 6. Update portfolio
        int remainingQty = portfolio.getQuantity() - request.getQuantity();
        if (remainingQty == 0) {
            // Remove the holding entirely if all shares sold
            portfolioRepository.delete(portfolio);
        } else {
            portfolio.setQuantity(remainingQty);
            portfolioRepository.save(portfolio);
        }

        // 7. Record transaction
        Transaction transaction = Transaction.builder()
                .user(user)
                .stock(stock)
                .type(Transaction.TransactionType.SELL)
                .quantity(request.getQuantity())
                .pricePerShare(stock.getCurrentPrice())
                .totalValue(totalProceeds)
                .build();
        transactionRepository.save(transaction);

        log.info("SELL: {} sold {} shares of {} at ${}",
                username, request.getQuantity(),
                stock.getStockSymbol(), stock.getCurrentPrice());

        return "Successfully sold " + request.getQuantity() +
               " shares of " + stock.getStockSymbol();
    }
}