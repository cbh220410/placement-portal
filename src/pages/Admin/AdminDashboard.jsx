// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminNavbar from './AdminNavbar';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeJobs, setActiveJobs] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);

  useEffect(() => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      setTotalUsers(users.length);

      const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
      setActiveJobs(jobs.length);

      const apps = JSON.parse(localStorage.getItem('applications') || '[]');
      setTotalApplications(apps.length);
    } catch (err) {
      console.error('Error loading admin stats:', err);
    }
  }, []);

  return (
    <div className={styles.pageContainer}>
      <AdminNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>Welcome, Admin {user.name}!</h1>
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>System Overview</h3>
            <p className={styles.infoText}>Total Users: {totalUsers}</p>
            <p className={styles.infoText}>Active Jobs: {activeJobs}</p>
            <p className={styles.infoText}>Total Applications: {totalApplications}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
