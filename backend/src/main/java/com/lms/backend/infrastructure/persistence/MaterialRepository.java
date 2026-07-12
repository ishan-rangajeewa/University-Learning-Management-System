package com.lms.backend.infrastructure.persistence;

import com.lms.backend.domain.model.Material;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;



public interface MaterialRepository extends JpaRepository<Material, String> {

    List<Material> findByCourseId(String courseId);
}