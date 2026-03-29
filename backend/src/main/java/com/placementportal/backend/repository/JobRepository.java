package com.placementportal.backend.repository;

import com.placementportal.backend.model.Job;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findAllByOrderByCreatedAtDesc();

    List<Job> findByEmployerEmailOrderByCreatedAtDesc(String employerEmail);
}
