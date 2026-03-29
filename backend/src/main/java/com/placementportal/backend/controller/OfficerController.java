package com.placementportal.backend.controller;

import com.placementportal.backend.dto.StudentStatusResponse;
import com.placementportal.backend.dto.UpdateStudentPlacementRequest;
import com.placementportal.backend.dto.UserResponse;
import com.placementportal.backend.service.DashboardService;
import com.placementportal.backend.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/officer")
public class OfficerController {

    private final DashboardService dashboardService;
    private final UserService userService;

    public OfficerController(DashboardService dashboardService, UserService userService) {
        this.dashboardService = dashboardService;
        this.userService = userService;
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        return dashboardService.officerSummary();
    }

    @GetMapping("/student-status")
    public List<StudentStatusResponse> studentStatus() {
        return dashboardService.officerStudentStatus();
    }

    @PatchMapping("/students/{id}/placement")
    public UserResponse updatePlacement(
        @PathVariable Long id,
        @Valid @RequestBody UpdateStudentPlacementRequest request
    ) {
        return UserResponse.from(userService.updatePlacement(id, request));
    }
}
