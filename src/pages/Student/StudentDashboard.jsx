// src/pages/Student/StudentDashboard.jsx
import React, { useEffect, useState } from 'react';
import StudentNavbar from './StudentNavbar';
import { useAuth } from '../../context/AuthContext';
import { getApplications, getInterviews } from '../../utils/storage';
import { fetchStudentSummary, isBackendUnavailable } from '../../services/portalApi';
import styles from './StudentDashboard.module.css';

const getProfileCompletion = (profileData) => {
  const totalFields = 5;
  let completedFields = 0;
  if (profileData.name) completedFields++;
  if (profileData.resume) completedFields++;
  if (profileData.skills && profileData.skills.length > 0) completedFields++;
  if (profileData.education) completedFields++;
  if (profileData.experience) completedFields++;
  return (completedFields / totalFields) * 100;
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviewCount: 0,
    applications: [],
    interviews: [],
    applicationsByStatus: {},
    interviewsByStatus: {}
  });

  const profileData = {
    name: user.name,
    resume: 'resume.pdf',
    skills: ['React', 'JavaScript', 'HTML'],
    education: 'University of XYZ',
    experience: null,
  };

  const profileCompletion = getProfileCompletion(profileData);

  const loadSummary = async () => {
    try {
      const summary = await fetchStudentSummary(user.email);
      console.log('✅ Student Dashboard Updated:', { apps: summary.totalApplications, interviews: summary.interviewCount });
      setStats(summary);
      return;
    } catch (error) {
      if (!isBackendUnavailable(error)) {
        console.error('Failed loading student dashboard summary:', error);
      }
    }

    const allApps = getApplications().filter(
      (app) => app.studentEmail === user.email
    );
    
    const allInterviews = getInterviews().filter(
      (intv) => intv.studentEmail === user.email
    );

    setStats({
      totalApplications: allApps.length,
      interviewCount: allInterviews.length,
      applications: allApps,
      interviews: allInterviews,
      applicationsByStatus: {},
      interviewsByStatus: {}
    });
  };

  useEffect(() => {
    loadSummary();
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadSummary, 5000);
    return () => clearInterval(interval);
  }, [user.email]);

  const totalApplications = stats.totalApplications;
  const interviewCount = stats.interviewCount;

  return (
    <div className={styles.pageContainer}>
      <StudentNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>Welcome, {user.name}!</h1>

        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <h3 className={styles.cardHeading}>Profile Completion</h3>
            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBar}
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            <p className={styles.cardText}>
              Your profile is <strong>{profileCompletion.toFixed(0)}%</strong> complete.
            </p>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardHeading}>📊 Application Stats</h3>
            <div className={styles.statsContainer}>
              <div>
                <h4 className={styles.statNumber}>{totalApplications}</h4>
                <p className={styles.statLabel}>Jobs Applied</p>
              </div>
              <div>
                <h4 className={styles.statNumber}>{interviewCount}</h4>
                <p className={styles.statLabel}>Interviews</p>
              </div>
            </div>
            {Object.keys(stats.applicationsByStatus).length > 0 && (
              <div style={{ marginTop: '15px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Status Breakdown:</p>
                {Object.entries(stats.applicationsByStatus).map(([status, count]) => (
                  <p key={status} style={{ fontSize: '12px', margin: '4px 0' }}>
                    {status}: <strong>{count}</strong>
                  </p>
                ))}
              </div>
            )}
          </div>

          {stats.interviews.length > 0 && (
            <div className={styles.card}>
              <h3 className={styles.cardHeading}>📅 Upcoming Interviews</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {stats.interviews.slice(0, 5).map((intv) => (
                  <li key={intv.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                    <p style={{ margin: '4px 0', fontWeight: 'bold' }}>
                      {new Date(intv.interviewDate).toLocaleDateString()}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      Status: <strong>{intv.status}</strong>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className={styles.actionCard}>
          <h3 className={styles.cardHeading}>Your Next Steps</h3>
          <ul className={styles.actionList}>
            <li className={styles.actionItem}>
              <p className={styles.actionText}>
                <strong>Complete your profile.</strong> Missing your work experience!
              </p>
            </li>
            {interviewCount > 0 && (
              <li className={styles.actionItem}>
                <p className={styles.actionText}>
                  You have an upcoming interview!
                </p>
              </li>
            )}
            <li className={styles.actionItem}>
              <p className={styles.actionText}>
                <strong>Explore more jobs</strong> to increase your chances.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
