// application/dto/response/AuthResponse.java
package com.lms.backend.application.dto.response;

import com.lms.backend.domain.enums.Role;

public record AuthResponse(
        String token,
        String userId,
        String username,
        Role role
) {
}