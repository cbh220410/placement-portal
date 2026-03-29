package com.placementportal.backend.service;

import com.placementportal.backend.dto.UpdateStudentPlacementRequest;
import com.placementportal.backend.dto.UpdateStudentProfileRequest;
import com.placementportal.backend.exception.BadRequestException;
import com.placementportal.backend.model.PlacementStatus;
import com.placementportal.backend.model.User;
import com.placementportal.backend.model.UserRole;
import com.placementportal.backend.repository.UserRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<User> listAll() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public User getById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new BadRequestException("User not found"));
    }

    @Transactional(readOnly = true)
    public User getByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new BadRequestException("Email is required");
        }
        return userRepository.findByEmail(email.trim().toLowerCase(Locale.ROOT))
            .orElseThrow(() -> new BadRequestException("User not found"));
    }

    @Transactional(readOnly = true)
    public List<User> listStudents() {
        return userRepository.findByRoleOrderByCreatedAtDesc(UserRole.STUDENT);
    }

    @Transactional
    public User updateStudentProfile(Long id, UpdateStudentProfileRequest request) {
        User user = getById(id);
        if (user.getRole() != UserRole.STUDENT) {
            throw new BadRequestException("Only student profiles can be updated");
        }
        user.setName(request.getName().trim());
        user.setSkills(trimOrNull(request.getSkills()));
        user.setBio(trimOrNull(request.getBio()));
        user.setResume(trimOrNull(request.getResume()));
        return userRepository.save(user);
    }

    @Transactional
    public User updatePlacement(Long id, UpdateStudentPlacementRequest request) {
        User user = getById(id);
        if (user.getRole() != UserRole.STUDENT) {
            throw new BadRequestException("Only student placement can be updated");
        }

        PlacementStatus status = parsePlacementStatus(request.getPlacementStatus());
        user.setPlacementStatus(status);

        if (status == PlacementStatus.PLACED) {
            String company = trimOrNull(request.getPlacedCompany());
            user.setPlacedCompany(company == null ? "TBD" : company);
        } else {
            user.setPlacedCompany("-");
        }
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = getById(id);
        userRepository.delete(user);
    }

    private PlacementStatus parsePlacementStatus(String statusValue) {
        if (statusValue == null || statusValue.isBlank()) {
            throw new BadRequestException("Placement status is required");
        }
        try {
            return PlacementStatus.valueOf(statusValue.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid placement status");
        }
    }

    private String trimOrNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
