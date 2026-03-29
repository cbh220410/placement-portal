// src/pages/PlacementOfficer/OfficerDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OfficerNavbar from './OfficerNavbar';
import { useAuth } from '../../context/AuthContext';
import { fetchOfficerSummary, isBackendUnavailable } from '../../services/portalApi';
import styles from './OfficerDashboard.module.css';

const OfficerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalInterviews: 0,
    applicationStats: []
  });

  const loadSummary = async () => {
    try {
      const summary = await fetchOfficerSummary();
      console.log('✅ Officer Dashboard Updated:', { students: summary.totalStudents, jobs: summary.totalJobs, apps: summary.totalApplications });
      setStats(summary);
      return;
    } catch (error) {
      if (!isBackendUnavailable(error)) {
        console.error('Error loading officer dashboard from backend:', error);
      }
    }

    try {
      const stored = localStorage.getItem('users');
      if (!stored) {
        setStats({
          totalStudents: 0,
          totalJobs: 0,
          totalApplications: 0,
          totalInterviews: 0,
          applicationStats: []
        });
        return;
      }

      const students = JSON.parse(stored).filter((userItem) => userItem.role === 'student');
      const totalStudents = students.length;

      setStats({
        totalStudents,
        totalJobs: 0,
        totalApplications: 0,
        totalInterviews: 0,
        applicationStats: []
      });
    } catch (e) {
      console.error('Error reading students for officer dashboard:', e);
    }
  };

  useEffect(() => {
    loadSummary();
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadSummary, 5000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { label: '🎓 Total Students', value: stats.totalStudents, color: '#60a5fa' },
    { label: '💼 Active Jobs', value: stats.totalJobs, color: '#34d399' },
    { label: '📋 Total Applications', value: stats.totalApplications, color: '#fbbf24' },
    { label: '📅 Total Interviews', value: stats.totalInterviews, color: '#f87171' },
  ];

  const quickActions = [
    {
      title: 'Stats',
      description: 'View detailed placement statistics',
      icon: '📊',
      action: () => {
        console.log('Opening Stats - Dashboard with detailed breakdowns');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    {
      title: 'Users',
      description: 'Manage student placement records',
      icon: '👥',
      action: () => navigate('/officer/student-status')
    },
    {
      title: 'Applications',
      description: 'Track application and placement progress',
      icon: '📋',
      action: () => navigate('/officer')
    }
  ];

  return (
    <div className={styles.pageContainer}>
      <OfficerNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>Welcome, Officer {user.name}!</h1>

        <div className={styles.statsGrid}>
          {cards.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <p className={styles.statLabel}>{stat.label}</p>
              <h2 className={styles.statValue} style={{ color: stat.color }}>
                {stat.value}
              </h2>
            </div>
          ))}
        </div>

        <div className={styles.actionCard}>
          <h3 className={styles.cardHeading}>Quick Actions</h3>
          <ul className={styles.actionList}>
            {quickActions.map((action, index) => (
              <li 
                key={index}
                className={styles.actionItem}
                onClick={action.action}
                style={{ cursor: 'pointer' }}
                title="Click to navigate"
              >
                <span style={{ fontSize: '20px', marginRight: '10px' }}>{action.icon}</span>
                <div>
                  <strong>{action.title}</strong>
                  <p>{action.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.card} style={{ marginTop: '30px' }}>
          <h3 className={styles.cardHeading}>Application Status Summary</h3>
          {stats.applicationStats && stats.applicationStats.length > 0 ? (
            <div>
              {stats.applicationStats.map((statusItem, index) => (
                <div key={index} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <p style={{ margin: '0', display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{statusItem.status}</strong>
                    <span style={{ color: '#007bff', fontWeight: 'bold' }}>{statusItem.count}</span>
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No applications data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
