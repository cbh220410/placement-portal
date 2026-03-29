package com.placementportal.backend.service;

import com.placementportal.backend.dto.AuthResponse;
import com.placementportal.backend.dto.LoginRequest;
import com.placementportal.backend.dto.SignupRequest;
import com.placementportal.backend.exception.BadRequestException;
import com.placementportal.backend.exception.UnauthorizedException;
import com.placementportal.backend.model.User;
import com.placementportal.backend.model.UserRole;
import com.placementportal.backend.repository.UserRepository;
import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("Email already registered");
        }

        UserRole role = parseRole(request.getRole());

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        User savedUser = userRepository.save(user);
        return toResponse("Registration successful", savedUser);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        User user = userRepository.findByEmail(normalizedEmail)
            .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        return toResponse("Login successful", user);
    }

    private AuthResponse toResponse(String message, User user) {
        return new AuthResponse(
            message,
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole().name().toLowerCase(Locale.ROOT)
        );
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }

    private UserRole parseRole(String role) {
        if (role == null || role.isBlank()) {
            return UserRole.STUDENT;
        }
        try {
            return UserRole.valueOf(role.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid role");
        }
    }
}
