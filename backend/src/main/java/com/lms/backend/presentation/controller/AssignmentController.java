// AssignmentController.java
package com.lms.backend.presentation.controller;

import com.lms.backend.application.dto.request.AssignmentRequest;
import com.lms.backend.application.dto.response.AssignmentResponse;
import com.lms.backend.application.service.AssignmentService;
import com.lms.backend.infrastructure.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @PostMapping("/api/courses/{courseId}/assignments")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<AssignmentResponse> createAssignment(
            @PathVariable String courseId,
            @Valid @RequestBody AssignmentRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(assignmentService.createAssignment(courseId, request, principal.getId()));
    }

    @GetMapping("/api/courses/{courseId}/assignments")
    public ResponseEntity<List<AssignmentResponse>> listAssignments(@PathVariable String courseId) {
        return ResponseEntity.ok(assignmentService.listAssignments(courseId));
    }

    @GetMapping("/api/assignments/{id}")
    public ResponseEntity<AssignmentResponse> getAssignment(@PathVariable String id) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(id));
    }

    @PutMapping("/api/assignments/{id}")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<AssignmentResponse> updateAssignment(
            @PathVariable String id,
            @Valid @RequestBody AssignmentRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(assignmentService.updateAssignment(id, request, principal.getId()));
    }

    @DeleteMapping("/api/assignments/{id}")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<Void> deleteAssignment(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        assignmentService.deleteAssignment(id, principal.getId());
        return ResponseEntity.noContent().build();
    }
}