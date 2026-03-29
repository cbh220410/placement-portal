package com.placementportal.backend.controller;

import com.placementportal.backend.dto.CreateJobRequest;
import com.placementportal.backend.model.Job;
import com.placementportal.backend.service.JobService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Job create(@Valid @RequestBody CreateJobRequest request) {
        return jobService.create(request);
    }

    @GetMapping
    public List<Job> listAll() {
        return jobService.listAll();
    }

    @GetMapping("/{id}")
    public Job getById(@PathVariable Long id) {
        return jobService.getById(id);
    }

    @GetMapping("/employer")
    public List<Job> listByEmployer(@RequestParam String email) {
        return jobService.listByEmployerEmail(email);
    }
}
