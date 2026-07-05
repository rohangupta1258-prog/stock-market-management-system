package com.stockmarket.service;

import com.stockmarket.exception.CustomException;
import com.stockmarket.model.Transaction;
import com.stockmarket.model.User;
import com.stockmarket.repository.TransactionRepository;
import com.stockmarket.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository        userRepository;

    // Get all transactions for a user
    public List<Transaction> getTransactions(String username) {
        User user = getUser(username);
        return transactionRepository.findByUserOrderByTimestampDesc(user);
    }

    // Get only the 5 most recent transactions (for dashboard)
    public List<Transaction> getRecentTransactions(String username) {
        User user = getUser(username);
        return transactionRepository.findTop5ByUserOrderByTimestampDesc(user);
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new CustomException(
                        "User not found", HttpStatus.NOT_FOUND));
    }
}