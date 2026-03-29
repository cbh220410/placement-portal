package com.placementportal.backend.controller;

import com.placementportal.backend.dto.ApplyJobRequest;
import com.placementportal.backend.dto.UpdateApplicationStatusRequest;
import com.placementportal.backend.model.JobApplication;
import com.placementportal.backend.service.ApplicationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplication apply(@Valid @RequestBody ApplyJobRequest request) {
        return applicationService.apply(request);
    }

    @GetMapping("/{id}")
    public JobApplication getById(@PathVariable Long id) {
        return applicationService.getById(id);
    }

    @GetMapping("/student")
    public List<JobApplication> listForStudent(@RequestParam String email) {
        return applicationService.listForStudent(email);
    }

    @GetMapping("/job/{jobId}")
    public List<JobApplication> listForJob(@PathVariable Long jobId) {
        return applicationService.listForJob(jobId);
    }

    @GetMapping("/employer")
    public List<JobApplication> listForEmployer(@RequestParam String email) {
        return applicationService.listForEmployer(email);
    }

    @PatchMapping("/{id}/status")
    public JobApplication updateStatus(
        @PathVariable Long id,
        @Valid @RequestBody UpdateApplicationStatusRequest request
    ) {
        return applicationService.updateStatus(id, request.getStatus());
    }
}
