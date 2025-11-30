// src/pages/Student/StudentDashboard.jsx
import React, { useEffect, useState } from 'react';
import StudentNavbar from './StudentNavbar';
import { useAuth } from '../../context/AuthContext';
import { getApplications, getInterviews } from '../../utils/storage';
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
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);

  const profileData = {
    name: user.name,
    resume: 'resume.pdf',
    skills: ['React', 'JavaScript', 'HTML'],
    education: 'University of XYZ',
    experience: null,
  };

  const profileCompletion = getProfileCompletion(profileData);

  useEffect(() => {
    const allApps = getApplications().filter(
      (app) => app.studentEmail === user.email
    );
    setApplications(allApps);

    const allInterviews = getInterviews().filter(
      (intv) => intv.studentEmail === user.email
    );
    setInterviews(allInterviews);
  }, [user.email]);

  const totalApplications = applications.length;
  const interviewCount = interviews.length;

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
            <h3 className={styles.cardHeading}>Application Stats</h3>
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
          </div>
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
