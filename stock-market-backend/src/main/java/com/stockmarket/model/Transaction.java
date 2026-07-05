package com.stockmarket.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions",
       indexes = {
           @Index(name = "idx_tx_user",      columnList = "user_id"),
           @Index(name = "idx_tx_stock",     columnList = "stock_id"),
           @Index(name = "idx_tx_timestamp", columnList = "timestamp")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long transactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 4)
    private TransactionType type;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "price_per_share", nullable = false)
    private Double pricePerShare;

    @Column(name = "total_value", nullable = false)
    private Double totalValue;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        timestamp  = LocalDateTime.now();
        totalValue = quantity * pricePerShare;
    }

    public enum TransactionType {
        BUY, SELL
    }
}