package com.placementportal.backend.service;

import com.placementportal.backend.dto.CreateJobRequest;
import com.placementportal.backend.exception.BadRequestException;
import com.placementportal.backend.model.Job;
import com.placementportal.backend.repository.JobRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @Transactional
    public Job create(CreateJobRequest request) {
        Job job = new Job();
        job.setTitle(request.getTitle().trim());
        job.setCompany(request.getEmployerName().trim());
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
}
