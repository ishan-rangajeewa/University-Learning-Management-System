// MaterialService.java
package com.lms.backend.application.service;

import com.lms.backend.domain.model.Course;
import com.lms.backend.domain.model.Material;
import com.lms.backend.application.dto.response.MaterialResponse;
import com.lms.backend.infrastructure.exception.ResourceNotFoundException;
import com.lms.backend.infrastructure.persistence.CourseRepository;
import com.lms.backend.infrastructure.persistence.MaterialRepository;
import com.lms.backend.infrastructure.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final CourseRepository courseRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public MaterialResponse uploadMaterial(String courseId, String title, MultipartFile file, String lecturerId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> ResourceNotFoundException.of("Course", courseId));

        if (course.getLecturer() == null || !course.getLecturer().getId().equals(lecturerId)) {
            throw new AccessDeniedException("Only the owning lecturer can upload materials for this course");
        }

        FileStorageService.StoredFile stored = fileStorageService.store(file);

        Material material = Material.builder()
                .title(title)
                .originalFilename(stored.originalFilename())
                .filePath(stored.filePath())
                .course(course)
                .build();

        return MaterialResponse.from(materialRepository.save(material));
    }

    @Transactional(readOnly = true)
    public List<MaterialResponse> listMaterials(String courseId) {
        return materialRepository.findByCourseId(courseId).stream()
                .map(MaterialResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Material getMaterialEntity(String materialId) {
        return materialRepository.findById(materialId)
                .orElseThrow(() -> ResourceNotFoundException.of("Material", materialId));
    }

    @Transactional(readOnly = true)
    public byte[] downloadMaterial(String materialId) {
        Material material = getMaterialEntity(materialId);
        return fileStorageService.load(material.getFilePath());
    }

    @Transactional
    public void deleteMaterial(String materialId, String lecturerId) {
        Material material = getMaterialEntity(materialId);

        if (material.getCourse().getLecturer() == null
                || !material.getCourse().getLecturer().getId().equals(lecturerId)) {
            throw new AccessDeniedException("Only the owning lecturer can delete this material");
        }

        fileStorageService.delete(material.getFilePath());
        materialRepository.delete(material);
    }
}