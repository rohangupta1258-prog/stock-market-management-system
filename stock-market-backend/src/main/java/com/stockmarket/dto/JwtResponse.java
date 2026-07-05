package com.stockmarket.dto;

import lombok.Data;

@Data
public class JwtResponse {

    private String token;
    private String type = "Bearer";
    private Long   id;
    private String username;
    private String email;
    private Double balance;
    private String role;

    public JwtResponse(String token, Long id, String username,
                       String email, Double balance, String role) {
        this.token    = token;
        this.id       = id;
        this.username = username;
        this.email    = email;
        this.balance  = balance;
        this.role     = role;
    }
}