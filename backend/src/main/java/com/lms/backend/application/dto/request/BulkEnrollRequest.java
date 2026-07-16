package com.lms.backend.application.dto.request;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record BulkEnrollRequest(
        @NotEmpty(message = "Select at least one student")
        List<String> studentIds
) {}