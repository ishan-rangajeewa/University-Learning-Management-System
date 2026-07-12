// EnrollmentController.java
package com.lms.backend.presentation.controller;

import com.lms.backend.application.dto.response.EnrollmentResponse;
import com.lms.backend.application.service.EnrollmentService;
import com.lms.backend.infrastructure.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping("/api/courses/{courseId}/enroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<EnrollmentResponse> enroll(
            @PathVariable String courseId,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(enrollmentService.enroll(courseId, principal.getId()));
    }

    @DeleteMapping("/api/courses/{courseId}/enroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Void> unenroll(
            @PathVariable String courseId,
            @AuthenticationPrincipal UserPrincipal principal) {
        enrollmentService.unenroll(courseId, principal.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/enrollments/my-enrollments")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<EnrollmentResponse>> getMyEnrollments(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(enrollmentService.getMyEnrollments(principal.getId()));
    }

    @GetMapping("/api/courses/{courseId}/enrollments")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<List<EnrollmentResponse>> getCourseEnrollments(@PathVariable String courseId) {
        return ResponseEntity.ok(enrollmentService.getCourseEnrollments(courseId));
    }
}