// src/pages/Employer/EmployerDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import EmployerNavbar from './EmployerNavbar';
import { getJobs, getApplications } from '../../utils/storage';
import { fetchEmployerSummary, isBackendUnavailable } from '../../services/portalApi';
import styles from './EmployerDashboard.module.css';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplications: 0,
    jobs: [],
    applicationsByStatus: {},
    recentApplications: []
  });

  const loadDashboard = async () => {
    try {
      const summary = await fetchEmployerSummary(user.email);
      console.log('✅ Employer Dashboard Updated:', { jobs: summary.totalJobs, apps: summary.totalApplications });
      setStats(summary);
      return;
    } catch (error) {
      if (!isBackendUnavailable(error)) {
        console.error('Failed loading employer summary:', error);
      }
    }

    const jobs = getJobs();
    const applications = getApplications();
    const jobsWithCounts = jobs.map((job) => {
      const count = applications.filter((app) => app.jobId === job.id).length;
      return { ...job, applications: count };
    });
    setStats({
      totalJobs: jobs.length,
      totalApplications: applications.length,
      jobs: jobsWithCounts,
      applicationsByStatus: {},
      recentApplications: applications
    });
  };

  useEffect(() => {
    loadDashboard();
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadDashboard, 5000);
    return () => clearInterval(interval);
  }, [user.email]);

  return (
    <div className={styles.pageContainer}>
      <EmployerNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>Welcome, {user.name}!</h1>

        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>📊 Dashboard Stats</h3>
            <p className={styles.infoText}>Active Job Listings: <strong>{stats.totalJobs}</strong></p>
            <p className={styles.infoText}>Total Applications: <strong>{stats.totalApplications}</strong></p>
            {Object.keys(stats.applicationsByStatus).length > 0 && (
              <div>
                <p className={styles.infoText} style={{ marginTop: '12px', fontWeight: 'bold' }}>By Status:</p>
                {Object.entries(stats.applicationsByStatus).map(([status, count]) => (
                  <p key={status} className={styles.infoText} style={{ marginLeft: '10px' }}>
                    {status}: <strong>{count}</strong>
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardHeading}>💼 Active Job Listings</h3>
            <ul className={styles.listingList}>
              {stats.jobs.length === 0 && (
                <li className={styles.listingItem}>No job listings yet.</li>
              )}

              {stats.jobs.map((job) => (
                <li key={job.id} className={styles.listingItem}>
                  <p className={styles.listingTitle}>{job.title}</p>
                  <p className={styles.listingMeta}>
                    📍 {job.location} | 📋 {job.applicationCount || 0} Applications
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {stats.recentApplications.length > 0 && (
            <div className={styles.card}>
              <h3 className={styles.cardHeading}>📧 Recent Applications</h3>
              <ul className={styles.listingList}>
                {stats.recentApplications.slice(0, 5).map((app) => (
                  <li key={app.id} className={styles.listingItem}>
                    <p className={styles.listingTitle}>{app.studentName}</p>
                    <p className={styles.listingMeta}>
                      Status: <strong>{app.status}</strong>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
