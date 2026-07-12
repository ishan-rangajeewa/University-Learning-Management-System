package com.lms.backend.application.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record GradeRequest(
        @NotNull(message = "Marks are required")
        @Min(value = 0, message = "Marks cannot be negative")
        Integer marks,

        String feedback
) {
}