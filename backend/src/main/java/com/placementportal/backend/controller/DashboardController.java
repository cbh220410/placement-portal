package com.placementportal.backend.controller;

import com.placementportal.backend.exception.BadRequestException;
import com.placementportal.backend.service.DashboardService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/admin")
    public Map<String, Object> adminSummary() {
        return dashboardService.adminSummary();
    }

    @GetMapping("/employer")
    public Map<String, Object> employerSummary(@RequestParam String email) {
        requireEmail(email);
        return dashboardService.employerSummary(email);
    }

    @GetMapping("/student")
    public Map<String, Object> studentSummary(@RequestParam String email) {
        requireEmail(email);
        return dashboardService.studentSummary(email);
    }

    @GetMapping("/reports")
    public Map<String, Object> reports() {
        return dashboardService.reports();
    }

    @GetMapping("/anomalies")
    public List<Map<String, Object>> anomalies() {
        return dashboardService.anomalies();
    }

    private void requireEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new BadRequestException("Email is required");
        }
    }
}
