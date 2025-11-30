import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmployerNavbar from "./EmployerNavbar";
import { getTable, updateRow } from "../../storage/db";
import ApplicationItem from "./ApplicationItem";
import styles from "./JobDetailsPage.module.css";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);

  // Load job + applications for this job
  useEffect(() => {
    const jobs = getTable("jobs");
    const foundJob = jobs.find((j) => j.id === Number(jobId));
    setJob(foundJob || null);

    const allApps = getTable("applications");
    const jobApps = allApps.filter((app) => app.jobId === Number(jobId));
    setApplications(jobApps);
  }, [jobId]);

  // Called when status is changed in ApplicationItem
  const handleStatusChange = (applicationId, newStatus) => {
    updateRow("applications", applicationId, { status: newStatus });
    const allApps = getTable("applications");
    const jobApps = allApps.filter((app) => app.jobId === Number(jobId));
    setApplications(jobApps);
  };

  if (!job) {
    return (
      <div className={styles.pageContainer}>
        <EmployerNavbar />
        <div className={styles.contentContainer}>
          <h1 className={styles.notFoundHeading}>Job not found!</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <EmployerNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>{job.title}</h1>
        <p className={styles.jobMeta}>
          <strong>{job.company}</strong> · {job.location}
        </p>
        <p className={styles.jobDescription}>{job.description}</p>

        <h2 className={styles.applicationsHeading}>
          Applications ({applications.length})
        </h2>

        {applications.length === 0 && (
          <p className={styles.noApplications}>No applications yet.</p>
        )}

        <div className={styles.applicationsGrid}>
          {applications.map((app) => (
            <ApplicationItem
              key={app.id}
              application={app}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
