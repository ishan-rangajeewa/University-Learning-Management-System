package com.lms.backend.presentation.controller;

import com.lms.backend.application.dto.response.UserResponse;
import com.lms.backend.domain.enums.Role;
import com.lms.backend.domain.model.User;
import com.lms.backend.infrastructure.persistence.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/students")
    @PreAuthorize("hasAnyRole('ADMIN', 'LECTURER')")
    public ResponseEntity<List<UserResponse>> getStudents() {
        List<UserResponse> students = userRepository.findByRole(Role.ROLE_STUDENT)
                .stream()
                .map(UserResponse::from)
                .toList();
        return ResponseEntity.ok(students);
    }
}