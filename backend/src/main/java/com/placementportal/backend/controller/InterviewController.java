package com.placementportal.backend.controller;

import com.placementportal.backend.dto.ScheduleInterviewRequest;
import com.placementportal.backend.model.Interview;
import com.placementportal.backend.service.InterviewService;
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
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Interview schedule(@Valid @RequestBody ScheduleInterviewRequest request) {
        return interviewService.schedule(request);
    }

    @GetMapping("/student")
    public List<Interview> listForStudent(@RequestParam String email) {
        return interviewService.listForStudent(email);
    }

    @GetMapping("/application/{applicationId}")
    public List<Interview> listForApplication(@PathVariable Long applicationId) {
        return interviewService.listForApplication(applicationId);
    }
}
