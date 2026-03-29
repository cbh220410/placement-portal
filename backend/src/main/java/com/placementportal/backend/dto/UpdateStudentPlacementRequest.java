package com.placementportal.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateStudentPlacementRequest {

    @NotBlank(message = "Placement status is required")
    private String placementStatus;

    private String placedCompany;

    public String getPlacementStatus() {
        return placementStatus;
    }

    public void setPlacementStatus(String placementStatus) {
        this.placementStatus = placementStatus;
    }

    public String getPlacedCompany() {
        return placedCompany;
    }

    public void setPlacedCompany(String placedCompany) {
        this.placedCompany = placedCompany;
    }
}
