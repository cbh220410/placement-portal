// src/pages/Employer/EmployerDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import EmployerNavbar from './EmployerNavbar';
import { getJobs, getApplications } from '../../utils/storage';
import styles from './EmployerDashboard.module.css';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobListings, setJobListings] = useState([]);
  const [newApplications, setNewApplications] = useState(0);

  useEffect(() => {
    const jobs = getJobs();
    const applications = getApplications();

    // Count applications by job
    const jobsWithCounts = jobs.map((job) => {
      const count = applications.filter((app) => app.jobId === job.id).length;
      return { ...job, applications: count };
    });

    setJobListings(jobsWithCounts);
    setNewApplications(applications.length); // simple logic: all apps are "new"
  }, []);

  return (
    <div className={styles.pageContainer}>
      <EmployerNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>Welcome, {user.name}!</h1>

        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>New Applications</h3>
            <h4 className={styles.statNumber}>{newApplications}</h4>
            <p className={styles.statLabel}>Total applications received</p>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Active Listings</h3>
            <ul className={styles.listingList}>
              {jobListings.length === 0 && (
                <li className={styles.listingItem}>No job listings yet.</li>
              )}

              {jobListings.map((job) => (
                <li key={job.id} className={styles.listingItem}>
                  <p className={styles.listingTitle}>{job.title}</p>
                  <p className={styles.listingMeta}>
                    {job.applications || 0} Applications
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
