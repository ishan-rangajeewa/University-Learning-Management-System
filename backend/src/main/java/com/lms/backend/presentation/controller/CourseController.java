// CourseController.java
package com.lms.backend.presentation.controller;

import com.lms.backend.application.dto.request.CourseRequest;
import com.lms.backend.application.dto.response.CourseResponse;
import com.lms.backend.application.service.CourseService;
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
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<CourseResponse> createCourse(
            @Valid @RequestBody CourseRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(courseService.createCourse(request, principal.getId()));
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponse> getCourseById(@PathVariable String id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<List<CourseResponse>> getMyCourses(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(courseService.getCoursesByLecturer(principal.getId()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<CourseResponse> updateCourse(
            @PathVariable String id,
            @Valid @RequestBody CourseRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(courseService.updateCourse(id, request, principal.getId()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<Void> deleteCourse(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        courseService.deleteCourse(id, principal.getId());
        return ResponseEntity.noContent().build();
    }
}