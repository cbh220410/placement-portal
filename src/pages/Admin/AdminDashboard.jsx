// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
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
    applicationsByStatus: []
  });
  const [jobs, setJobs] = useState([]);
  const [isDeleting, setIsDeleting] = useState({});

  const loadData = async () => {
    try {
      const [summary, allJobs] = await Promise.all([
        fetchAdminSummary(),
        fetchJobs()
      ]);
      console.log('✅ Admin Dashboard Updated:', { users: summary.totalUsers, jobs: summary.totalJobs, apps: summary.totalApplications });
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
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (window.confirm(`Are you sure you want to delete "${jobTitle}" and all its applications?`)) {
      setIsDeleting(prev => ({ ...prev, [jobId]: true }));
      try {
        await deleteJob(jobId);
        alert('Job deleted successfully!');
        await loadData();
      } catch (error) {
        alert(error.message || 'Failed to delete job');
      } finally {
        setIsDeleting(prev => ({ ...prev, [jobId]: false }));
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <AdminNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>Welcome, Admin {user.name}!</h1>
        
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>System Overview</h3>
            <p className={styles.infoText}>👥 Total Users: <strong>{stats.totalUsers}</strong></p>
            <p className={styles.infoText}>🎓 Students: <strong>{stats.totalStudents}</strong></p>
            <p className={styles.infoText}>🏢 Employers: <strong>{stats.totalEmployers}</strong></p>
            <p className={styles.infoText}>💼 Active Jobs: <strong>{stats.totalJobs}</strong></p>
            <p className={styles.infoText}>📋 Applications: <strong>{stats.totalApplications}</strong></p>
            <p className={styles.infoText}>📅 Interviews: <strong>{stats.totalInterviews}</strong></p>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Application Status Breakdown</h3>
            {stats.applicationsByStatus && stats.applicationsByStatus.length > 0 ? (
              <div>
                {stats.applicationsByStatus.map((statusItem) => (
                  <p key={statusItem.status} className={styles.infoText}>
                    {statusItem.status}: <strong>{statusItem.count}</strong>
                  </p>
                ))}
              </div>
            ) : (
              <p className={styles.infoText}>No applications yet</p>
            )}
          </div>
        </div>

        <div style={{ marginTop: '40px' }}>
          <h2 className={styles.sectionHeading}>Manage Jobs</h2>
          {jobs.length === 0 ? (
            <p>No jobs available.</p>
          ) : (
            <table className={styles.table} style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Job Title</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Company</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Location</th>
                  <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Posted By</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{job.title}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{job.company || job.employerName}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{job.location}</td>
                    <td style={{ padding: '12px', borderBottom: '1px solid #eee' }}>{job.employerEmail}</td>
                    <td style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #eee' }}>
                      <button
                        onClick={() => handleDeleteJob(job.id, job.title)}
                        disabled={isDeleting[job.id]}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: isDeleting[job.id] ? 'not-allowed' : 'pointer',
                          opacity: isDeleting[job.id] ? 0.6 : 1
                        }}
                      >
                        {isDeleting[job.id] ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
