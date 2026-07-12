package com.lms.backend.application.service;

import com.lms.backend.application.dto.request.LoginRequest;
import com.lms.backend.application.dto.request.RegisterRequest;
import com.lms.backend.application.dto.response.AuthResponse;
import com.lms.backend.domain.model.User;
import com.lms.backend.infrastructure.exception.DuplicateResourceException;
import com.lms.backend.infrastructure.persistence.UserRepository;
import com.lms.backend.infrastructure.security.JwtService;
import com.lms.backend.infrastructure.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("Username already taken: " + request.username());
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already registered: " + request.email());
        }

        User user = User.builder()
                .username(request.username())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .build();

        User savedUser = userRepository.save(user);
        UserPrincipal principal = new UserPrincipal(savedUser);
        String token = jwtService.generateToken(principal);

        return new AuthResponse(token, savedUser.getId(), savedUser.getUsername(), savedUser.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        // Delegates credential checking to the AuthenticationProvider configured in
        // SecurityConfig (CustomUserDetailsService + BCryptPasswordEncoder).
        // Throws BadCredentialsException on failure, handled by GlobalExceptionHandler.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );

        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found: " + request.username()));

        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtService.generateToken(principal);

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getRole());
    }
}