// MaterialResponse.java
package com.lms.backend.application.dto.response;

import com.lms.backend.domain.model.Material;
import java.time.LocalDateTime;

public record MaterialResponse(
        String id,
        String title,
        String originalFilename,
        LocalDateTime uploadedAt,
        String courseId
) {
    public static MaterialResponse from(Material material) {
        return new MaterialResponse(
                material.getId(),
                material.getTitle(),
                material.getOriginalFilename(),
                material.getUploadedAt(),
                material.getCourse().getId()
        );
    }
}