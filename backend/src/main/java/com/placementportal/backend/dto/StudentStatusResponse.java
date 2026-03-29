package com.placementportal.backend.dto;

public class StudentStatusResponse {

    private Long id;
    private String name;
    private String email;
    private String placementStatus;
    private String placedCompany;
    private long applicationCount;
    private long interviewCount;

    public StudentStatusResponse(
        Long id,
        String name,
        String email,
        String placementStatus,
        String placedCompany,
        long applicationCount,
        long interviewCount
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.placementStatus = placementStatus;
        this.placedCompany = placedCompany;
        this.applicationCount = applicationCount;
        this.interviewCount = interviewCount;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPlacementStatus() {
        return placementStatus;
    }

    public String getPlacedCompany() {
        return placedCompany;
    }

    public long getApplicationCount() {
        return applicationCount;
    }

    public long getInterviewCount() {
        return interviewCount;
    }
}
