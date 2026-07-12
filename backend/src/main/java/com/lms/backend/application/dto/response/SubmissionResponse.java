// SubmissionResponse.java
package com.lms.backend.application.dto.response;

import com.lms.backend.domain.model.Submission;
import java.time.LocalDateTime;

public record SubmissionResponse(
        String id,
        String assignmentId,
        String studentId,
        String studentUsername,
        String originalFilename,
        LocalDateTime submittedAt,
        Integer marks,
        String feedback
) {
    public static SubmissionResponse from(Submission submission) {
        return new SubmissionResponse(
                submission.getId(),
                submission.getAssignment().getId(),
                submission.getStudent().getId(),
                submission.getStudent().getUsername(),
                submission.getOriginalFilename(),
                submission.getSubmittedAt(),
                submission.getMarks(),
                submission.getFeedback()
        );
    }
}