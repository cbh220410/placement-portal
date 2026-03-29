package com.placementportal.backend.repository;

import com.placementportal.backend.model.Interview;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    List<Interview> findByStudentEmailOrderByCreatedAtDesc(String studentEmail);

    List<Interview> findByApplicationIdOrderByCreatedAtDesc(Long applicationId);

    Optional<Interview> findByApplicationId(Long applicationId);

    long countByStudentEmail(String studentEmail);
}
