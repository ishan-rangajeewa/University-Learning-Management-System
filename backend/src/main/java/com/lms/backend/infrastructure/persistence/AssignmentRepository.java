package com.lms.backend.infrastructure.persistence;

import com.lms.backend.domain.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, String> {

    List<Assignment> findByCourseId(String courseId);
}