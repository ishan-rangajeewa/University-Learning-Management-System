package com.lms.backend.application.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AssignmentRequest(
        @NotBlank(message = "Title is required")
        String title,

        String description,

        @NotNull(message = "Max marks is required")
        @Min(value = 1, message = "Max marks must be at least 1")
        Integer maxMarks,

        @NotNull(message = "Due date is required")
        @Future(message = "Due date must be in the future")
        LocalDateTime dueDate
) {
}