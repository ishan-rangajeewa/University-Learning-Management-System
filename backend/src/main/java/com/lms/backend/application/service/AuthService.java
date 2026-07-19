package com.lms.backend.application.service;

import com.lms.backend.application.dto.request.ChangePasswordRequest;
import com.lms.backend.application.dto.request.LoginRequest;
import com.lms.backend.application.dto.request.RegisterRequest;
import com.lms.backend.application.dto.request.ResetPasswordRequest;
import com.lms.backend.application.dto.response.AuthResponse;
import com.lms.backend.domain.enums.Role;
import com.lms.backend.domain.model.User;
import com.lms.backend.infrastructure.email.EmailService;
import com.lms.backend.infrastructure.email.OtpService;
import com.lms.backend.infrastructure.exception.DuplicateResourceException;
import com.lms.backend.infrastructure.exception.ResourceNotFoundException;
import com.lms.backend.infrastructure.persistence.UserRepository;
import com.lms.backend.infrastructure.security.JwtService;
import com.lms.backend.infrastructure.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
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
    private final OtpService otpService;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("Username already taken: " + request.username());
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateResourceException("Email already registered: " + request.email());
        }

        User user = User.builder()
                .username(request.username())
                .firstname(request.firstname())
                .lastname(request.lastname())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .build();

        User savedUser = userRepository.save(user);
        UserPrincipal principal = new UserPrincipal(savedUser);
        String token = jwtService.generateToken(principal);

        return new AuthResponse(token, savedUser.getId(), savedUser.getUsername(),savedUser.getFirstname(),savedUser.getLastname(), savedUser.getRole());
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

        return new AuthResponse(token, user.getId(), user.getUsername(),user.getFirstname(),user.getLastname(), user.getRole());
    }

    public void changePassword(String userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(()-> ResourceNotFoundException.of("User", userId));
        if(!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadCredentialsException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    public void ensureDefaultAdmin(String username, String password, String email, String firstname, String lastname) {
        if(userRepository.existsByUsername(username)) {
            return;
        }
        User admin = User.builder()
                .username(username)
                .firstname(firstname)
                .lastname(lastname)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(Role.ROLE_ADMIN).build();

        userRepository.save(admin);
    }

    public void forgotPassword(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw ResourceNotFoundException.of("User", email);
        }
        String otp = otpService.generateOtp(email);
        emailService.sendOtpEmail(email, otp);
    }

    public void resetPassword(ResetPasswordRequest request){
        boolean isValid = otpService.verifyOtp(request.email(), request.otp());
        if (!isValid) {
            throw new BadCredentialsException("Invalid OTP");
        }
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(()-> ResourceNotFoundException.of("User", request.email()));
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

    }
}