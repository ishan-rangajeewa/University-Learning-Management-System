// application/dto/response/UserResponse.java
package com.lms.backend.application.dto.response;

import com.lms.backend.domain.enums.Role;
import com.lms.backend.domain.model.User;

import java.time.LocalDateTime;

public record UserResponse(
        String id,
        String firstName,
        String lastName,
        String username,
        String email,
        Role role,
        boolean active,
        LocalDateTime createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstname(),
                user.getLastname(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.isActive(),
                user.getCreatedAt()
        );
    }
}