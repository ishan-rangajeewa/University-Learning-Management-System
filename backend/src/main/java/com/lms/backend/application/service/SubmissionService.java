// SubmissionService.java
package com.lms.backend.application.service;

import com.lms.backend.application.dto.request.GradeRequest;
import com.lms.backend.application.dto.response.SubmissionResponse;
import com.lms.backend.domain.model.Assignment;
import com.lms.backend.domain.model.Submission;
import com.lms.backend.domain.model.User;
import com.lms.backend.infrastructure.exception.DuplicateResourceException;
import com.lms.backend.infrastructure.exception.ResourceNotFoundException;
import com.lms.backend.infrastructure.persistence.SubmissionRepository;
import com.lms.backend.infrastructure.persistence.UserRepository;
import com.lms.backend.infrastructure.storage.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final AssignmentService assignmentService;
    private final FileStorageService fileStorageService;

    @Transactional
    public SubmissionResponse submit(String assignmentId, MultipartFile file, String studentId) {
        if (submissionRepository.existsByAssignmentIdAndStudentId(assignmentId, studentId)) {
            throw new DuplicateResourceException(
                    "You have already submitted this assignment. Contact your lecturer to resubmit.");
        }

        Assignment assignment = assignmentService.getAssignmentEntity(assignmentId);
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", studentId));

        FileStorageService.StoredFile stored = fileStorageService.store(file);

        Submission submission = Submission.builder()
                .assignment(assignment)
                .student(student)
                .originalFilename(stored.originalFilename())
                .filePath(stored.filePath())
                .build();

        return SubmissionResponse.from(submissionRepository.save(submission));
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> listByAssignment(String assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId).stream()
                .map(SubmissionResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> listMySubmissions(String studentId) {
        return submissionRepository.findByStudentId(studentId).stream()
                .map(SubmissionResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public Submission getSubmissionEntity(String id) {
        return submissionRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Submission", id));
    }

    @Transactional(readOnly = true)
    public byte[] downloadSubmission(String submissionId) {
        Submission submission = getSubmissionEntity(submissionId);
        return fileStorageService.load(submission.getFilePath());
    }

    @Transactional
    public SubmissionResponse grade(String submissionId, GradeRequest request, String lecturerId) {
        Submission submission = getSubmissionEntity(submissionId);

        String courseLecturerId = submission.getAssignment().getCourse().getLecturer() != null
                ? submission.getAssignment().getCourse().getLecturer().getId()
                : null;

        if (courseLecturerId == null || !courseLecturerId.equals(lecturerId)) {
            throw new AccessDeniedException("Only the owning lecturer can grade this submission");
        }

        if (request.marks() > submission.getAssignment().getMaxMarks()) {
            throw new IllegalArgumentException(
                    "Marks cannot exceed the assignment's max marks (" + submission.getAssignment().getMaxMarks() + ")");
        }

        submission.setMarks(request.marks());
        submission.setFeedback(request.feedback());

        return SubmissionResponse.from(submissionRepository.save(submission));
    }
}