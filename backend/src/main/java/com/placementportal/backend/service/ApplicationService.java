package com.placementportal.backend.service;

import com.placementportal.backend.dto.ApplyJobRequest;
import com.placementportal.backend.exception.BadRequestException;
import com.placementportal.backend.model.ApplicationStatus;
import com.placementportal.backend.model.Job;
import com.placementportal.backend.model.JobApplication;
import com.placementportal.backend.model.User;
import com.placementportal.backend.repository.JobApplicationRepository;
import com.placementportal.backend.repository.JobRepository;
import com.placementportal.backend.repository.UserRepository;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApplicationService {

    private static final Set<String> STATUS_VALUES = Set.of(
        "SUBMITTED",
        "IN_REVIEW",
        "INTERVIEW_SCHEDULED",
        "SELECTED",
        "REJECTED"
    );

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApplicationService(
        JobApplicationRepository applicationRepository,
        JobRepository jobRepository,
        UserRepository userRepository
    ) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public JobApplication apply(ApplyJobRequest request) {
        String studentEmail = normalizeEmail(request.getStudentEmail());
        Job job = jobRepository.findById(request.getJobId())
            .orElseThrow(() -> new BadRequestException("Job not found"));

        if (applicationRepository.findByJobIdAndStudentEmail(job.getId(), studentEmail).isPresent()) {
            throw new BadRequestException("You have already applied for this job");
        }

        JobApplication application = new JobApplication();
        application.setJobId(job.getId());
        application.setJobTitle(job.getTitle());
        application.setCompany(job.getCompany());
        application.setStudentEmail(studentEmail);
        application.setStudentName(request.getStudentName().trim());
        application.setStatus(ApplicationStatus.SUBMITTED);

        Long studentId = request.getStudentId();
        if (studentId == null) {
            studentId = userRepository.findByEmail(studentEmail).map(User::getId).orElse(null);
        }
        application.setStudentId(studentId);

        return applicationRepository.save(application);
    }

    @Transactional(readOnly = true)
    public List<JobApplication> listForStudent(String studentEmail) {
        return applicationRepository.findByStudentEmailOrderByAppliedAtDesc(normalizeEmail(studentEmail));
    }

    @Transactional(readOnly = true)
    public List<JobApplication> listForJob(Long jobId) {
        return applicationRepository.findByJobIdOrderByAppliedAtDesc(jobId);
    }

    @Transactional(readOnly = true)
    public List<JobApplication> listForEmployer(String employerEmail) {
        List<Long> jobIds = jobRepository.findByEmployerEmailOrderByCreatedAtDesc(normalizeEmail(employerEmail))
            .stream()
            .map(Job::getId)
            .collect(Collectors.toList());
        if (jobIds.isEmpty()) {
            return Collections.emptyList();
        }
        return applicationRepository.findByJobIdInOrderByAppliedAtDesc(jobIds);
    }

    @Transactional(readOnly = true)
    public JobApplication getById(Long id) {
        return applicationRepository.findById(id)
            .orElseThrow(() -> new BadRequestException("Application not found"));
    }

    @Transactional
    public JobApplication updateStatus(Long id, String statusValue) {
        JobApplication application = getById(id);
        ApplicationStatus status = parseStatus(statusValue);
        application.setStatus(status);
        return applicationRepository.save(application);
    }

    private ApplicationStatus parseStatus(String value) {
        if (value == null || value.isBlank()) {
            throw new BadRequestException("Status is required");
        }
        String normalized = value
            .trim()
            .toUpperCase(Locale.ROOT)
            .replace(' ', '_');
        if (!STATUS_VALUES.contains(normalized)) {
            throw new BadRequestException("Invalid application status");
        }
        return ApplicationStatus.valueOf(normalized);
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new BadRequestException("Email is required");
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
