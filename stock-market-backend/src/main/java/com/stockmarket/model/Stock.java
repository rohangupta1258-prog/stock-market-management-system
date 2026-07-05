package com.stockmarket.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "stocks",
       uniqueConstraints = @UniqueConstraint(columnNames = "stock_symbol"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stockId;

    @NotBlank
    @Column(name = "stock_name", nullable = false, length = 100)
    private String stockName;

    @NotBlank
    @Size(max = 10)
    @Column(name = "stock_symbol", nullable = false, length = 10)
    private String stockSymbol;

    @Column(name = "current_price", nullable = false)
    private Double currentPrice;

    @Column(name = "previous_price")
    private Double previousPrice;

    @Column(name = "market_cap")
    private Double marketCap;

    @Column(length = 50)
    private String sector;

    @Column(length = 255)
    private String description;

    @Column(name = "last_updated")
    @Builder.Default
    private LocalDateTime lastUpdated = LocalDateTime.now();

    @Transient
    public Double getPriceChangePercent() {
        if (previousPrice == null || previousPrice == 0) return 0.0;
        return ((currentPrice - previousPrice) / previousPrice) * 100;
    }

    @Transient
    public Double getPriceChange() {
        if (previousPrice == null) return 0.0;
        return currentPrice - previousPrice;
    }

    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}