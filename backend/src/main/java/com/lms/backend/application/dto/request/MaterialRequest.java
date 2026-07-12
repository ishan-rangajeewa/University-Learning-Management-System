package com.lms.backend.application.dto.request;

import jakarta.validation.constraints.NotBlank;

public record MaterialRequest(
        @NotBlank(message = "Title is required")
        String title
) {
}