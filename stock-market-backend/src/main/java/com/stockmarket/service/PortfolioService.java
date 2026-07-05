package com.stockmarket.service;

import com.stockmarket.exception.CustomException;
import com.stockmarket.model.Portfolio;
import com.stockmarket.model.User;
import com.stockmarket.repository.PortfolioRepository;
import com.stockmarket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository      userRepository;

    // Get all holdings for a user
    public List<Portfolio> getPortfolio(String username) {
        User user = getUser(username);
        return portfolioRepository.findByUser(user);
    }

    // Get portfolio summary with totals
    public Map<String, Object> getPortfolioSummary(String username) {
        User user = getUser(username);

        List<Portfolio> holdings     = portfolioRepository.findByUser(user);
        Double currentValue          = portfolioRepository.getTotalPortfolioValue(user);
        Double investedValue         = portfolioRepository.getTotalInvestedValue(user);
        double profitLoss            = currentValue - investedValue;
        double profitLossPercent     = investedValue == 0 ? 0 :
                                       (profitLoss / investedValue) * 100;

        Map<String, Object> summary = new HashMap<>();
        summary.put("holdings",          holdings);
        summary.put("totalCurrentValue", currentValue);
        summary.put("totalInvestedValue",investedValue);
        summary.put("totalProfitLoss",   profitLoss);
        summary.put("profitLossPercent", profitLossPercent);
        summary.put("cashBalance",       user.getBalance());
        summary.put("totalAssets",       currentValue + user.getBalance());

        return summary;
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(
                        "User not found", HttpStatus.NOT_FOUND));
    }
}