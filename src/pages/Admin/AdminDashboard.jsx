import React, { useEffect, useState } from 'react';
import { Activity, BriefcaseBusiness, ShieldCheck, UsersRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AdminNavbar from './AdminNavbar';
import { fetchJobs, fetchAdminSummary, isBackendUnavailable, deleteJob } from '../../services/portalApi';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalEmployers: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalInterviews: 0,
    applicationsByStatus: [],
  });
  const [jobs, setJobs] = useState([]);
  const [isDeleting, setIsDeleting] = useState({});

  const loadData = async () => {
    try {
      const [summary, allJobs] = await Promise.all([fetchAdminSummary(), fetchJobs()]);
      setStats(summary);
      setJobs(allJobs);
    } catch (error) {
      if (!isBackendUnavailable(error)) {
        console.error('Error loading admin data:', error);
      }
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (window.confirm(`Are you sure you want to delete "${jobTitle}" and all its applications?`)) {
      setIsDeleting((prev) => ({ ...prev, [jobId]: true }));
      try {
        await deleteJob(jobId);
        alert('Job deleted successfully.');
        await loadData();
      } catch (error) {
        alert(error.message || 'Failed to delete job');
      } finally {
        setIsDeleting((prev) => ({ ...prev, [jobId]: false }));
      }
    }
  };

  const statCards = [
    {
      label: 'Total users',
      value: stats.totalUsers,
      note: `${stats.totalStudents} students and ${stats.totalEmployers} employers`,
      icon: <UsersRound size={18} />,
    },
    {
      label: 'Active jobs',
      value: stats.totalJobs,
      note: 'Listings currently available in the system',
      icon: <BriefcaseBusiness size={18} />,
    },
    {
      label: 'Interviews tracked',
      value: stats.totalInterviews,
      note: 'Scheduled interviews across the platform',
      icon: <Activity size={18} />,
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <AdminNavbar />

      <div className={styles.contentContainer}>
        <section className={styles.heroSection}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Admin workspace</span>
            <h1 className={styles.mainHeading}>Welcome back, {user.name}.</h1>
            <p className={styles.heroText}>
              Keep an eye on platform health, user activity, and job operations from one system
              overview.
            </p>
          </div>

          <div className={styles.heroBadge}>
            <ShieldCheck size={18} />
            <span>Oversight across users, jobs, and activity</span>
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
              <h2 className={styles.panelTitle}>System overview</h2>
              <span className={styles.panelHint}>Top-level platform totals</span>
            </div>

            <div className={styles.statusList}>
              <div className={styles.statusRow}>
                <span>Total applications</span>
                <strong>{stats.totalApplications}</strong>
              </div>
              <div className={styles.statusRow}>
                <span>Total interviews</span>
                <strong>{stats.totalInterviews}</strong>
              </div>
              <div className={styles.statusRow}>
                <span>Students</span>
                <strong>{stats.totalStudents}</strong>
              </div>
              <div className={styles.statusRow}>
                <span>Employers</span>
                <strong>{stats.totalEmployers}</strong>
              </div>
            </div>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Application status breakdown</h2>
              <span className={styles.panelHint}>How applications are progressing</span>
            </div>

            {stats.applicationsByStatus?.length > 0 ? (
              <div className={styles.statusList}>
                {stats.applicationsByStatus.map((statusItem) => (
                  <div key={statusItem.status} className={styles.statusRow}>
                    <span>{statusItem.status}</span>
                    <strong>{statusItem.count}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>No application data available yet.</p>
            )}
          </article>
        </section>

        <section className={styles.panelWide}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Manage jobs</h2>
            <span className={styles.panelHint}>Review and remove live listings</span>
          </div>

          {jobs.length === 0 ? (
            <p className={styles.emptyState}>No jobs available.</p>
          ) : (
            <div className={styles.jobGrid}>
              {jobs.map((job) => (
                <article key={job.id} className={styles.jobCard}>
                  <div className={styles.jobMeta}>
                    <p className={styles.jobTitle}>{job.title}</p>
                    <p className={styles.jobSubtext}>{job.company || job.employerName}</p>
                    <p className={styles.jobSubtext}>{job.location}</p>
                    <p className={styles.jobSubtext}>{job.employerEmail}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteJob(job.id, job.title)}
                    disabled={isDeleting[job.id]}
                    className={styles.deleteButton}
                  >
                    {isDeleting[job.id] ? 'Deleting...' : 'Delete job'}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
