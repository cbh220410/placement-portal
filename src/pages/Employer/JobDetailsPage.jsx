import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmployerNavbar from "./EmployerNavbar";
import { getTable, updateRow } from "../../storage/db";
import { fetchJobApplications, fetchJobById, isBackendUnavailable, updateApplicationStatus } from "../../services/portalApi";
import ApplicationItem from "./ApplicationItem";
import styles from "./JobDetailsPage.module.css";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const loadJobData = async () => {
      try {
        const [jobData, jobApps] = await Promise.all([
          fetchJobById(jobId),
          fetchJobApplications(jobId),
        ]);
        setJob(jobData || null);
        setApplications(jobApps);
        return;
      } catch (error) {
        if (!isBackendUnavailable(error)) {
          console.error("Failed loading job details from backend:", error);
        }
      }

      const jobs = getTable("jobs");
      const foundJob = jobs.find((j) => Number(j.id) === Number(jobId));
      setJob(foundJob || null);
      const allApps = getTable("applications");
      const jobApps = allApps.filter((app) => Number(app.jobId) === Number(jobId));
      setApplications(jobApps);
    };

    loadJobData();
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const updated = await updateApplicationStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (Number(app.id) === Number(applicationId) ? updated : app))
      );
      return;
    } catch (error) {
      if (!isBackendUnavailable(error)) {
        alert(error.message || "Failed to update status");
        return;
      }
    }

    updateRow("applications", applicationId, { status: newStatus });
    const allApps = getTable("applications");
    const jobApps = allApps.filter((app) => Number(app.jobId) === Number(jobId));
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
          <strong>{job.company}</strong> - {job.location}
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

