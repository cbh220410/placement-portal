package com.placementportal.backend.config;

import com.placementportal.backend.model.PlacementStatus;
import com.placementportal.backend.model.User;
import com.placementportal.backend.model.UserRole;
import com.placementportal.backend.repository.UserRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner seedUsers(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            List<User> seedUsers = List.of(
                buildUser(
                    "Student User",
                    "student@example.com",
                    passwordEncoder,
                    UserRole.STUDENT,
                    "React, JavaScript, HTML",
                    "Motivated student seeking internships.",
                    "resume.pdf",
                    PlacementStatus.UNPLACED,
                    "-"
                ),
                buildUser(
                    "Employer User",
                    "employer@example.com",
                    passwordEncoder,
                    UserRole.EMPLOYER,
                    null,
                    null,
                    null,
                    PlacementStatus.UNPLACED,
                    "-"
                ),
                buildUser(
                    "System Admin",
                    "admin@example.com",
                    passwordEncoder,
                    UserRole.ADMIN,
                    null,
                    null,
                    null,
                    PlacementStatus.UNPLACED,
                    "-"
                ),
                buildUser(
                    "Placement Officer",
                    "officer@example.com",
                    passwordEncoder,
                    UserRole.OFFICER,
                    null,
                    null,
                    null,
                    PlacementStatus.UNPLACED,
                    "-"
                )
            );
            userRepository.saveAll(seedUsers);
        };
    }

    private User buildUser(
        String name,
        String email,
        PasswordEncoder passwordEncoder,
        UserRole role,
        String skills,
        String bio,
        String resume,
        PlacementStatus placementStatus,
        String placedCompany
    ) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode("password123"));
        user.setRole(role);
        user.setSkills(skills);
        user.setBio(bio);
        user.setResume(resume);
        user.setPlacementStatus(placementStatus);
        user.setPlacedCompany(placedCompany);
        return user;
    }
}
