import React, { useEffect, useState } from 'react';
import { BarChart3, BriefcaseBusiness, FileStack, UsersRound } from 'lucide-react';
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
    recentApplications: [],
  });

  const loadDashboard = async () => {
    try {
      const summary = await fetchEmployerSummary(user.email);
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
      recentApplications: applications,
    });
  };

  useEffect(() => {
    loadDashboard();
    const interval = setInterval(loadDashboard, 5000);
    return () => clearInterval(interval);
  }, [user.email]);

  const statCards = [
    {
      label: 'Active job listings',
      value: stats.totalJobs,
      note: 'Open opportunities under your account',
      icon: <BriefcaseBusiness size={18} />,
    },
    {
      label: 'Total applications',
      value: stats.totalApplications,
      note: 'Candidate responses across listings',
      icon: <UsersRound size={18} />,
    },
    {
      label: 'Hiring activity',
      value: Object.keys(stats.applicationsByStatus).length || 0,
      note: 'Statuses currently in play',
      icon: <BarChart3 size={18} />,
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <EmployerNavbar />

      <div className={styles.contentContainer}>
        <section className={styles.heroSection}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Employer workspace</span>
            <h1 className={styles.mainHeading}>Welcome back, {user.name}.</h1>
            <p className={styles.heroText}>
              Manage openings, review response volume, and keep your hiring pipeline moving from
              one dashboard.
            </p>
          </div>

          <div className={styles.heroBadge}>
            <FileStack size={18} />
            <span>Listings and applicants in one view</span>
          </div>
        </section>

        <section className={styles.statGrid}>
          {statCards.map((card) => (
            <article key={card.label} className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statIcon}>{card.icon}</span>
                <span className={styles.statLabel}>{card.label}</span>
              </div>
              <p className={styles.statValue}>{card.value}</p>
              <p className={styles.statNote}>{card.note}</p>
            </article>
          ))}
        </section>

        <section className={styles.panelGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Application status</h2>
              <span className={styles.panelHint}>Current hiring movement</span>
            </div>

            {Object.keys(stats.applicationsByStatus).length > 0 ? (
              <div className={styles.statusList}>
                {Object.entries(stats.applicationsByStatus).map(([status, count]) => (
                  <div key={status} className={styles.statusRow}>
                    <span>{status}</span>
                    <strong>{count}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>Status breakdown appears as applications move through review.</p>
            )}
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Recent applications</h2>
              <span className={styles.panelHint}>Latest candidate activity</span>
            </div>

            {stats.recentApplications.length > 0 ? (
              <div className={styles.list}>
                {stats.recentApplications.slice(0, 5).map((app) => (
                  <div key={app.id} className={styles.listItem}>
                    <p className={styles.listTitle}>{app.studentName}</p>
                    <p className={styles.listMeta}>Status: {app.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>No recent applications yet.</p>
            )}
          </article>
        </section>

        <section className={styles.panelWide}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Active job listings</h2>
            <span className={styles.panelHint}>Your currently visible openings</span>
          </div>

          {stats.jobs.length > 0 ? (
            <div className={styles.listingGrid}>
              {stats.jobs.map((job) => (
                <div key={job.id} className={styles.listingCard}>
                  <p className={styles.listTitle}>{job.title}</p>
                  <p className={styles.listMeta}>{job.location}</p>
                  <p className={styles.listingCount}>
                    {(job.applicationCount ?? job.applications ?? 0)} applications
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>No job listings yet.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default EmployerDashboard;
