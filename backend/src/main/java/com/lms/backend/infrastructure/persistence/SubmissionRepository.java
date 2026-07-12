package com.lms.backend.infrastructure.persistence;

import com.lms.backend.domain.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, String> {

    List<Submission> findByAssignmentId(String assignmentId);

    List<Submission> findByStudentId(String studentId);

    Optional<Submission> findByAssignmentIdAndStudentId(String assignmentId, String studentId);

    boolean existsByAssignmentIdAndStudentId(String assignmentId, String studentId);
}