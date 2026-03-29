package com.placementportal.backend.repository;

import com.placementportal.backend.model.JobApplication;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByStudentEmailOrderByAppliedAtDesc(String studentEmail);

    List<JobApplication> findByJobIdOrderByAppliedAtDesc(Long jobId);

    List<JobApplication> findByJobIdInOrderByAppliedAtDesc(Collection<Long> jobIds);

    Optional<JobApplication> findByJobIdAndStudentEmail(Long jobId, String studentEmail);

    long countByAppliedAtAfter(LocalDateTime timestamp);

    long countByStudentEmail(String studentEmail);
}
