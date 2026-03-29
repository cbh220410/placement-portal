package com.placementportal.backend.dto;

import com.placementportal.backend.model.User;
import java.util.Locale;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
    private String skills;
    private String bio;
    private String resume;
    private String placementStatus;
    private String placedCompany;

    public static UserResponse from(User user) {
        UserResponse response = new UserResponse();
        String placement = "Unplaced";
        if (user.getPlacementStatus() != null) {
            placement = user.getPlacementStatus().name().substring(0, 1)
                + user.getPlacementStatus().name().substring(1).toLowerCase(Locale.ROOT);
        }
        response.id = user.getId();
        response.name = user.getName();
        response.email = user.getEmail();
        response.role = user.getRole().name().toLowerCase(Locale.ROOT);
        response.skills = user.getSkills();
        response.bio = user.getBio();
        response.resume = user.getResume();
        response.placementStatus = placement;
        response.placedCompany = user.getPlacedCompany() == null ? "-" : user.getPlacedCompany();
        return response;
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

    public String getRole() {
        return role;
    }

    public String getSkills() {
        return skills;
    }

    public String getBio() {
        return bio;
    }

    public String getResume() {
        return resume;
    }

    public String getPlacementStatus() {
        return placementStatus;
    }

    public String getPlacedCompany() {
        return placedCompany;
    }
}
