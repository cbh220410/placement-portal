package com.placementportal.backend.service;

import com.placementportal.backend.dto.ScheduleInterviewRequest;
import com.placementportal.backend.exception.BadRequestException;
import com.placementportal.backend.model.ApplicationStatus;
import com.placementportal.backend.model.Interview;
import com.placementportal.backend.model.JobApplication;
import com.placementportal.backend.repository.InterviewRepository;
import com.placementportal.backend.repository.JobApplicationRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final JobApplicationRepository applicationRepository;

    public InterviewService(
        InterviewRepository interviewRepository,
        JobApplicationRepository applicationRepository
    ) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
    }

    @Transactional
    public Interview schedule(ScheduleInterviewRequest request) {
        JobApplication application = applicationRepository.findById(request.getApplicationId())
            .orElseThrow(() -> new BadRequestException("Application not found"));

        Interview interview = interviewRepository.findByApplicationId(request.getApplicationId())
            .orElseGet(Interview::new);
        interview.setApplicationId(application.getId());
        interview.setJobId(application.getJobId());
        interview.setStudentId(application.getStudentId());
        interview.setStudentEmail(application.getStudentEmail());
        interview.setStudentName(application.getStudentName());
        interview.setEmployerEmail(request.getEmployerEmail().trim().toLowerCase(Locale.ROOT));
        interview.setEmployerName(request.getEmployerName().trim());
        interview.setDate(request.getDate().trim());
        interview.setTime(request.getTime().trim());
        interview.setStatus("Scheduled");

        application.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        applicationRepository.save(application);

        return interviewRepository.save(interview);
    }

    @Transactional(readOnly = true)
    public List<Interview> listForStudent(String studentEmail) {
        if (studentEmail == null || studentEmail.isBlank()) {
            throw new BadRequestException("Student email is required");
        }
        return interviewRepository.findByStudentEmailOrderByCreatedAtDesc(studentEmail.trim().toLowerCase(Locale.ROOT));
    }

    @Transactional(readOnly = true)
    public List<Interview> listForApplication(Long applicationId) {
        return interviewRepository.findByApplicationIdOrderByCreatedAtDesc(applicationId);
    }
}
