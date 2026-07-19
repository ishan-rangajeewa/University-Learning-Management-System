package com.lms.backend.infrastructure.config;

import com.lms.backend.application.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final AuthService authService;

    @Value("${admin.default.username}")
    private String defaultUsername;

    @Value("${admin.default.password}")
    private String defaultPassword;

    @Value("${admin.default.email}")
    private String defaultEmail;

    @Value("${admin.default.firstname}")
    private String defaultFirstname;

    @Value("${admin.default.lastname}")
    private String defaultLastname;

    @Override
    public void run(String... args) {
        authService.ensureDefaultAdmin(
                defaultUsername, defaultPassword, defaultEmail, defaultFirstname, defaultLastname);
        log.info("Default admin check complete for '{}'.", defaultUsername);
    }
}