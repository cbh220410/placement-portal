// src/pages/Student/JobListingsPage.jsx
import React, { useEffect, useState } from "react";
import StudentNavbar from "./StudentNavbar";
import { getTable, addRow } from "../../storage/db";
import { useAuth } from "../../context/AuthContext";
import styles from "./JobListingsPage.module.css";

const JobListingsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    setJobs(getTable("jobs"));
    setApplications(getTable("applications"));
  }, []);

  const hasApplied = (jobId) => {
    return applications.some(
      (app) => app.jobId === jobId && app.studentEmail === user.email
    );
  };

  const handleApply = (job) => {
    if (hasApplied(job.id)) {
      alert("You have already applied for this job.");
      return;
    }

    const application = {
      id: Date.now(),
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      studentEmail: user.email,
      studentName: user.name,
      status: "Submitted",
      appliedAt: new Date().toISOString(),
    };

    addRow("applications", application);
    setApplications(getTable("applications"));

    alert(`Applied for ${job.title} at ${job.company}!`);
  };

  return (
    <div className={styles.pageContainer}>
      <StudentNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>Available Jobs</h1>

        <div className={styles.jobGrid}>
          {jobs.length === 0 && (
            <p className={styles.noJobs}>No jobs posted yet.</p>
          )}

          {jobs.map((job) => {
            const alreadyApplied = hasApplied(job.id);
            return (
              <div key={job.id} className={styles.jobCard}>
                <h3 className={styles.jobTitle}>{job.title}</h3>
                <p className={styles.jobMeta}>
                  <strong>{job.company}</strong> - {job.location}
                </p>
                <p className={styles.jobDescription}>{job.description}</p>

                {alreadyApplied ? (
                  <button className={styles.appliedButton} disabled>
                    ✔ Applied
                  </button>
                ) : (
                  <button
                    onClick={() => handleApply(job)}
                    className={styles.applyButton}
                  >
                    Apply Now
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JobListingsPage;
