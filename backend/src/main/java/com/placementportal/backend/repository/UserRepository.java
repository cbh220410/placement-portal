package com.placementportal.backend.repository;

import com.placementportal.backend.model.User;
import com.placementportal.backend.model.UserRole;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRoleOrderByCreatedAtDesc(UserRole role);

    long countByRole(UserRole role);
}
