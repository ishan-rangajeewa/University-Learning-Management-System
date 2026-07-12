package com.lms.backend.infrastructure.storage;

import com.lms.backend.infrastructure.exception.FileStorageException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalFileStorageService implements FileStorageService {

    private final Path storageLocation;

    public LocalFileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.storageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.storageLocation);
        } catch (IOException e) {
            throw new FileStorageException("Could not create the upload directory: " + this.storageLocation, e);
        }
    }

    @Override
    public StoredFile store(MultipartFile file) {
        String originalFilename = StringUtils.cleanPath(
                file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");

        if (originalFilename.contains("..")) {
            throw new FileStorageException("Filename contains invalid path sequence: " + originalFilename);
        }

        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex >= 0) {
            extension = originalFilename.substring(dotIndex);
        }
        String storedName = UUID.randomUUID() + extension;

        try {
            Path targetLocation = this.storageLocation.resolve(storedName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return new StoredFile(originalFilename, storedName);
        } catch (IOException e) {
            throw new FileStorageException("Failed to store file: " + originalFilename, e);
        }
    }

    @Override
    public byte[] load(String filePath) {
        try {
            Path file = this.storageLocation.resolve(filePath).normalize();
            if (!file.startsWith(this.storageLocation)) {
                throw new FileStorageException("Cannot access file outside the storage directory");
            }
            return Files.readAllBytes(file);
        } catch (IOException e) {
            throw new FileStorageException("Failed to read file: " + filePath, e);
        }
    }

    @Override
    public void delete(String filePath) {
        try {
            Path file = this.storageLocation.resolve(filePath).normalize();
            Files.deleteIfExists(file);
        } catch (IOException e) {
            throw new FileStorageException("Failed to delete file: " + filePath, e);
        }
    }
}