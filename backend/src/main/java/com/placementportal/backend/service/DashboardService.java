package com.placementportal.backend.service;

import com.placementportal.backend.dto.StudentStatusResponse;
import com.placementportal.backend.model.Interview;
import com.placementportal.backend.model.Job;
import com.placementportal.backend.model.JobApplication;
import com.placementportal.backend.model.PlacementStatus;
import com.placementportal.backend.model.User;
import com.placementportal.backend.model.UserRole;
import com.placementportal.backend.repository.InterviewRepository;
import com.placementportal.backend.repository.JobApplicationRepository;
import com.placementportal.backend.repository.JobRepository;
import com.placementportal.backend.repository.UserRepository;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;

    public DashboardService(
        UserRepository userRepository,
        JobRepository jobRepository,
        JobApplicationRepository applicationRepository,
        InterviewRepository interviewRepository
    ) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> adminSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("totalUsers", userRepository.count());
        summary.put("totalStudents", userRepository.countByRole(UserRole.STUDENT));
        summary.put("totalEmployers", userRepository.countByRole(UserRole.EMPLOYER));
        summary.put("totalOfficers", userRepository.countByRole(UserRole.OFFICER));
        summary.put("totalAdmins", userRepository.countByRole(UserRole.ADMIN));
        summary.put("activeJobs", jobRepository.count());
        summary.put("totalApplications", applicationRepository.count());
        return summary;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> employerSummary(String employerEmail) {
        String normalizedEmail = employerEmail.trim().toLowerCase(Locale.ROOT);
        List<Job> jobs = jobRepository.findByEmployerEmailOrderByCreatedAtDesc(normalizedEmail);
        List<Long> jobIds = jobs.stream().map(Job::getId).collect(Collectors.toList());
        List<JobApplication> applications = jobIds.isEmpty()
            ? List.of()
            : applicationRepository.findByJobIdInOrderByAppliedAtDesc(jobIds);

        List<Map<String, Object>> listings = jobs.stream().map(job -> {
            long count = applications.stream().filter(app -> app.getJobId().equals(job.getId())).count();
            Map<String, Object> item = new HashMap<>();
            item.put("id", job.getId());
            item.put("title", job.getTitle());
            item.put("location", job.getLocation());
            item.put("applications", count);
            return item;
        }).collect(Collectors.toList());

        Map<String, Object> summary = new HashMap<>();
        summary.put("newApplications", applications.size());
        summary.put("activeListings", listings);
        return summary;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> studentSummary(String studentEmail) {
        String normalizedEmail = studentEmail.trim().toLowerCase(Locale.ROOT);
        long applicationCount = applicationRepository.countByStudentEmail(normalizedEmail);
        long interviewCount = interviewRepository.countByStudentEmail(normalizedEmail);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalApplications", applicationCount);
        summary.put("interviewCount", interviewCount);
        return summary;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> officerSummary() {
        List<User> students = userRepository.findByRoleOrderByCreatedAtDesc(UserRole.STUDENT);
        long totalStudents = students.size();
        long placedStudents = students.stream()
            .filter(student -> student.getPlacementStatus() == PlacementStatus.PLACED)
            .count();
        long unplacedStudents = totalStudents - placedStudents;

        Set<String> companies = students.stream()
            .filter(student -> student.getPlacementStatus() == PlacementStatus.PLACED)
            .map(User::getPlacedCompany)
            .filter(company -> company != null && !company.isBlank() && !"-".equals(company) && !"TBD".equalsIgnoreCase(company))
            .map(String::trim)
            .collect(Collectors.toSet());

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalStudents", totalStudents);
        summary.put("placedStudents", placedStudents);
        summary.put("unplacedStudents", unplacedStudents);
        summary.put("companiesRegistered", companies.size());
        return summary;
    }

    @Transactional(readOnly = true)
    public List<StudentStatusResponse> officerStudentStatus() {
        List<User> students = userRepository.findByRoleOrderByCreatedAtDesc(UserRole.STUDENT);
        List<JobApplication> allApplications = applicationRepository.findAll();
        List<Interview> allInterviews = interviewRepository.findAll();

        return students.stream().map(student -> {
            long applicationCount = allApplications.stream()
                .filter(app -> app.getStudentEmail().equalsIgnoreCase(student.getEmail()))
                .count();
            long interviewCount = allInterviews.stream()
                .filter(intv -> intv.getStudentEmail().equalsIgnoreCase(student.getEmail()))
                .count();

            PlacementStatus status = student.getPlacementStatus() == null
                ? PlacementStatus.UNPLACED
                : student.getPlacementStatus();
            String placementStatus = status.name().substring(0, 1)
                + status.name().substring(1).toLowerCase(Locale.ROOT);

            return new StudentStatusResponse(
                student.getId(),
                student.getName(),
                student.getEmail(),
                placementStatus,
                student.getPlacedCompany(),
                applicationCount,
                interviewCount
            );
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> reports() {
        Map<String, Object> metrics = adminSummary();

        List<JobApplication> applications = applicationRepository.findAll();
        YearMonth now = YearMonth.now();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("MMM yyyy");
        List<Map<String, Object>> monthlyApplications = new ArrayList<>();

        for (int i = 5; i >= 0; i--) {
            YearMonth month = now.minusMonths(i);
            long count = applications.stream()
                .filter(app -> app.getAppliedAt() != null && YearMonth.from(app.getAppliedAt()).equals(month))
                .count();
            Map<String, Object> monthEntry = new LinkedHashMap<>();
            monthEntry.put("month", month.format(monthFormatter));
            monthEntry.put("applications", count);
            monthlyApplications.add(monthEntry);
        }

        metrics.put("monthlyApplications", monthlyApplications);
        return metrics;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> anomalies() {
        List<Map<String, Object>> anomalies = new ArrayList<>();
        List<JobApplication> applications = applicationRepository.findAll();
        List<Job> jobs = jobRepository.findAll();

        LocalDateTime oneDayAgo = LocalDateTime.now().minusHours(24);
        Map<String, Long> rapidApplyMap = applications.stream()
            .filter(app -> app.getAppliedAt() != null && app.getAppliedAt().isAfter(oneDayAgo))
            .collect(Collectors.groupingBy(JobApplication::getStudentEmail, Collectors.counting()));

        rapidApplyMap.forEach((email, count) -> {
            if (count >= 15) {
                Map<String, Object> item = new HashMap<>();
                item.put("type", "High Application Rate");
                item.put("user", email);
                item.put("details", "Applied to " + count + " jobs in the last 24 hours.");
                item.put("severity", "High");
                anomalies.add(item);
            }
        });

        Map<String, Long> duplicateJobs = jobs.stream()
            .collect(Collectors.groupingBy(
                job -> (job.getEmployerEmail() + "|" + job.getTitle() + "|" + job.getLocation()).toLowerCase(Locale.ROOT),
                Collectors.counting()
            ));
        duplicateJobs.forEach((key, count) -> {
            if (count > 1) {
                String[] parts = key.split("\\|", 3);
                Map<String, Object> item = new HashMap<>();
                item.put("type", "Duplicate Job Posting");
                item.put("user", parts[0]);
                item.put("details", "Posted duplicate listing for \"" + parts[1] + "\" at " + parts[2] + ".");
                item.put("severity", "Medium");
                anomalies.add(item);
            }
        });

        if (anomalies.isEmpty()) {
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("type", "No Active Anomalies");
            fallback.put("user", "System");
            fallback.put("details", "No suspicious activity detected in current dataset.");
            fallback.put("severity", "Low");
            anomalies.add(fallback);
        }

        return anomalies;
    }
}
