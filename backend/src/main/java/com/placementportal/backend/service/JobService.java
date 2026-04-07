package com.placementportal.backend.service;

import com.placementportal.backend.dto.CreateJobRequest;
import com.placementportal.backend.exception.BadRequestException;
import com.placementportal.backend.model.Job;
import com.placementportal.backend.model.JobApplication;
import com.placementportal.backend.repository.InterviewRepository;
import com.placementportal.backend.repository.JobApplicationRepository;
import com.placementportal.backend.repository.JobRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;

    public JobService(
        JobRepository jobRepository,
        JobApplicationRepository applicationRepository,
        InterviewRepository interviewRepository
    ) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
    }

    @Transactional
    public Job create(CreateJobRequest request) {
        Job job = new Job();
        job.setTitle(request.getTitle().trim());
        job.setCompany(request.getCompany().trim());
        job.setLocation(request.getLocation().trim());
        job.setDescription(request.getDescription().trim());
        job.setRequirements(request.getRequirements() == null ? null : request.getRequirements().trim());
        job.setEmployerEmail(request.getEmployerEmail().trim().toLowerCase());
        job.setEmployerName(request.getEmployerName().trim());
        return jobRepository.save(job);
    }

    @Transactional(readOnly = true)
    public List<Job> listAll() {
        return jobRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<Job> listByEmployerEmail(String employerEmail) {
        if (employerEmail == null || employerEmail.isBlank()) {
            throw new BadRequestException("Employer email is required");
        }
        return jobRepository.findByEmployerEmailOrderByCreatedAtDesc(employerEmail.trim().toLowerCase());
    }

    @Transactional(readOnly = true)
    public Job getById(Long id) {
        return jobRepository.findById(id)
            .orElseThrow(() -> new BadRequestException("Job not found"));
    }

    @Transactional
    public void deleteJob(Long id) {
        Job job = getById(id);
        List<JobApplication> applications = applicationRepository.findByJobId(job.getId());
        List<Long> applicationIds = applications.stream()
            .map(JobApplication::getId)
            .collect(Collectors.toList());

        if (!applicationIds.isEmpty()) {
            interviewRepository.deleteByApplicationIdIn(applicationIds);
        }
        applicationRepository.deleteByJobId(job.getId());
        jobRepository.delete(job);
    }
}
