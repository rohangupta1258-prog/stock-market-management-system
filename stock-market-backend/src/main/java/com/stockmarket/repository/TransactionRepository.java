package com.stockmarket.repository;

import com.stockmarket.model.Transaction;
import com.stockmarket.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserOrderByTimestampDesc(User user);

    List<Transaction> findTop5ByUserOrderByTimestampDesc(User user);
}