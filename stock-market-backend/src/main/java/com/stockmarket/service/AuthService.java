package com.stockmarket.service;

import com.stockmarket.dto.JwtResponse;
import com.stockmarket.dto.LoginRequest;
import com.stockmarket.dto.RegisterRequest;
import com.stockmarket.exception.CustomException;
import com.stockmarket.model.User;
import com.stockmarket.repository.UserRepository;
import com.stockmarket.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository        userRepository;
    private final PasswordEncoder       passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil               jwtUtil;

    public JwtResponse login(LoginRequest request) {
        // Authenticate username + password
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        // Generate JWT token
        String token = jwtUtil.generateToken(request.getUsername());

        // Fetch full user details for the response
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new CustomException(
                        "User not found", HttpStatus.NOT_FOUND));

        log.info("User logged in: {}", request.getUsername());

        return new JwtResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getBalance(),
                user.getRole());
    }

    public String register(RegisterRequest request) {
        // Check for duplicate username
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new CustomException(
                    "Username already taken", HttpStatus.BAD_REQUEST);
        }

        // Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(
                    "Email already registered", HttpStatus.BAD_REQUEST);
        }

        // Build and save the new user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .balance(10000.00)
                .role("USER")
                .build();

        userRepository.save(user);
        log.info("New user registered: {}", request.getUsername());

        return "User registered successfully";
    }
}