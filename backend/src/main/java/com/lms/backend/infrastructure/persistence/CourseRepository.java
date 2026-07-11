package com.lms.backend.infrastructure.persistence;

import com.lms.backend.domain.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, String> {

    Optional<Course> findByCourseCode(String courseCode);

    List<Course> findByLecturerId(String lecturerId);

    boolean existsByCourseCode(String courseCode);
}