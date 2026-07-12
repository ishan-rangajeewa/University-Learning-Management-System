// SubmissionController.java
package com.lms.backend.presentation.controller;

import com.lms.backend.application.dto.request.GradeRequest;
import com.lms.backend.application.dto.response.SubmissionResponse;
import com.lms.backend.application.service.SubmissionService;
import com.lms.backend.domain.model.Submission;
import com.lms.backend.infrastructure.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping(value = "/api/assignments/{assignmentId}/submissions", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SubmissionResponse> submit(
            @PathVariable String assignmentId,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(submissionService.submit(assignmentId, file, principal.getId()));
    }

    @GetMapping("/api/assignments/{assignmentId}/submissions")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<List<SubmissionResponse>> listByAssignment(@PathVariable String assignmentId) {
        return ResponseEntity.ok(submissionService.listByAssignment(assignmentId));
    }

    @GetMapping("/api/submissions/my-submissions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<SubmissionResponse>> listMySubmissions(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(submissionService.listMySubmissions(principal.getId()));
    }

    @GetMapping("/api/submissions/{submissionId}/download")
    public ResponseEntity<ByteArrayResource> download(@PathVariable String submissionId) {
        Submission submission = submissionService.getSubmissionEntity(submissionId);
        byte[] data = submissionService.downloadSubmission(submissionId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + submission.getOriginalFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new ByteArrayResource(data));
    }

    @PutMapping("/api/submissions/{submissionId}/grade")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<SubmissionResponse> grade(
            @PathVariable String submissionId,
            @Valid @RequestBody GradeRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(submissionService.grade(submissionId, request, principal.getId()));
    }
}