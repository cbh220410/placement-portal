import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, GraduationCap, LayoutDashboard, Users } from 'lucide-react';
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
    applicationStats: [],
  });

  const loadSummary = async () => {
    try {
      const summary = await fetchOfficerSummary();
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
          applicationStats: [],
        });
        return;
      }

      const students = JSON.parse(stored).filter((userItem) => userItem.role === 'student');
      setStats({
        totalStudents: students.length,
        totalJobs: 0,
        totalApplications: 0,
        totalInterviews: 0,
        applicationStats: [],
      });
    } catch (e) {
      console.error('Error reading students for officer dashboard:', e);
    }
  };

  useEffect(() => {
    loadSummary();
    const interval = setInterval(loadSummary, 5000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    { label: 'Total students', value: stats.totalStudents, note: 'Profiles under placement tracking', icon: <GraduationCap size={18} /> },
    { label: 'Active jobs', value: stats.totalJobs, note: 'Open opportunities linked to drives', icon: <LayoutDashboard size={18} /> },
    { label: 'Applications', value: stats.totalApplications, note: 'Campus-wide application volume', icon: <ClipboardList size={18} /> },
    { label: 'Interviews', value: stats.totalInterviews, note: 'Scheduled across the portal', icon: <Users size={18} /> },
  ];

  const quickActions = [
    {
      title: 'Review dashboard stats',
      description: 'Stay current on placement movement and summary data.',
      action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
    {
      title: 'Manage student status',
      description: 'Update placement outcomes and monitor student records.',
      action: () => navigate('/officer/student-status'),
    },
    {
      title: 'Track applications',
      description: 'Use the status summary to spot movement or bottlenecks.',
      action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <OfficerNavbar />

      <div className={styles.contentContainer}>
        <section className={styles.heroSection}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Placement officer workspace</span>
            <h1 className={styles.mainHeading}>Welcome back, {user.name}.</h1>
            <p className={styles.heroText}>
              Oversee campus placement activity, student progress, and application movement from
              one coordinated view.
            </p>
          </div>

          <div className={styles.heroBadge}>
            <Users size={18} />
            <span>Campus coordination in one place</span>
          </div>
        </section>

        <section className={styles.statGrid}>
          {cards.map((card) => (
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
              <h2 className={styles.panelTitle}>Quick actions</h2>
              <span className={styles.panelHint}>Common placement tasks</span>
            </div>

            <div className={styles.actionList}>
              {quickActions.map((action, index) => (
                <button key={action.title} className={styles.actionItem} onClick={action.action}>
                  <span className={styles.actionIndex}>0{index + 1}</span>
                  <span className={styles.actionBody}>
                    <strong>{action.title}</strong>
                    <span>{action.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Application status summary</h2>
              <span className={styles.panelHint}>Snapshot of placement flow</span>
            </div>

            {stats.applicationStats?.length > 0 ? (
              <div className={styles.statusList}>
                {stats.applicationStats.map((statusItem) => (
                  <div key={statusItem.status} className={styles.statusRow}>
                    <span>{statusItem.status}</span>
                    <strong>{statusItem.count}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>No applications data available yet.</p>
            )}
          </article>
        </section>
      </div>
    </div>
  );
};

export default OfficerDashboard;
