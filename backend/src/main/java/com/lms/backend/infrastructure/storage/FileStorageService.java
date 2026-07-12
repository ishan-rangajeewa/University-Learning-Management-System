package com.lms.backend.infrastructure.storage;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    StoredFile store(MultipartFile file);

    byte[] load(String filePath);

    void delete(String filePath);

    record StoredFile(String originalFilename, String filePath) {
    }
}