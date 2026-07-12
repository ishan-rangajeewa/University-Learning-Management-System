// MaterialController.java
package com.lms.backend.presentation.controller;

import com.lms.backend.application.dto.response.MaterialResponse;
import com.lms.backend.application.service.MaterialService;
import com.lms.backend.domain.model.Material;
import com.lms.backend.infrastructure.security.UserPrincipal;
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
public class MaterialController {

    private final MaterialService materialService;

    @PostMapping(value = "/api/courses/{courseId}/materials", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<MaterialResponse> uploadMaterial(
            @PathVariable String courseId,
            @RequestParam String title,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(materialService.uploadMaterial(courseId, title, file, principal.getId()));
    }

    @GetMapping("/api/courses/{courseId}/materials")
    public ResponseEntity<List<MaterialResponse>> listMaterials(@PathVariable String courseId) {
        return ResponseEntity.ok(materialService.listMaterials(courseId));
    }

    @GetMapping("/api/materials/{materialId}/download")
    public ResponseEntity<ByteArrayResource> downloadMaterial(@PathVariable String materialId) {
        Material material = materialService.getMaterialEntity(materialId);
        byte[] data = materialService.downloadMaterial(materialId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + material.getOriginalFilename() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new ByteArrayResource(data));
    }

    @DeleteMapping("/api/materials/{materialId}")
    @PreAuthorize("hasRole('LECTURER')")
    public ResponseEntity<Void> deleteMaterial(
            @PathVariable String materialId,
            @AuthenticationPrincipal UserPrincipal principal) {
        materialService.deleteMaterial(materialId, principal.getId());
        return ResponseEntity.noContent().build();
    }
}