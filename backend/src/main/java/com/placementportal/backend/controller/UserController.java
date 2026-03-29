package com.placementportal.backend.controller;

import com.placementportal.backend.dto.UpdateStudentProfileRequest;
import com.placementportal.backend.dto.UserResponse;
import com.placementportal.backend.model.User;
import com.placementportal.backend.service.UserService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponse> listAll() {
        return userService.listAll()
            .stream()
            .map(UserResponse::from)
            .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public UserResponse getById(@PathVariable Long id) {
        return UserResponse.from(userService.getById(id));
    }

    @GetMapping("/by-email")
    public UserResponse getByEmail(@RequestParam String email) {
        return UserResponse.from(userService.getByEmail(email));
    }

    @GetMapping("/students")
    public List<UserResponse> listStudents() {
        return userService.listStudents()
            .stream()
            .map(UserResponse::from)
            .collect(Collectors.toList());
    }

    @PatchMapping("/{id}/profile")
    public UserResponse updateStudentProfile(
        @PathVariable Long id,
        @Valid @RequestBody UpdateStudentProfileRequest request
    ) {
        User user = userService.updateStudentProfile(id, request);
        return UserResponse.from(user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
