package com.stockmarket.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "portfolio",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "stock_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long portfolioId;

    @ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id", nullable = false)
@ToString.Exclude
@EqualsAndHashCode.Exclude
@com.fasterxml.jackson.annotation.JsonIgnore
private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "average_buy_price", nullable = false)
    private Double averageBuyPrice;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Transient
    public Double getTotalInvestedValue() {
        return quantity * averageBuyPrice;
    }

    @Transient
    public Double getCurrentMarketValue() {
        return quantity * stock.getCurrentPrice();
    }

    @Transient
    public Double getProfitLoss() {
        return getCurrentMarketValue() - getTotalInvestedValue();
    }

    @Transient
    public Double getProfitLossPercent() {
        if (getTotalInvestedValue() == 0) return 0.0;
        return (getProfitLoss() / getTotalInvestedValue()) * 100;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}