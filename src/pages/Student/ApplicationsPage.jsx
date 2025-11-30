// src/pages/Student/StudentApplicationsPage.jsx
import React, { useEffect, useState } from 'react';
import StudentNavbar from './StudentNavbar';
import { useAuth } from '../../context/AuthContext';
import { getApplications, getInterviews } from '../../utils/storage';
import styles from './ApplicationsPage.module.css';

const StudentApplicationsPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const allApps = getApplications().filter(
      (app) => app.studentEmail === user.email
    );
    const interviews = getInterviews();

    const merged = allApps.map((app) => {
      const interview = interviews.find(
        (intv) => intv.applicationId === app.id
      );
      return {
        ...app,
        interviewTime: interview ? `${interview.date} at ${interview.time}` : null,
      };
    });

    setApplications(merged);
  }, [user.email]);

  return (
    <div className={styles.pageContainer}>
      <StudentNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>My Applications</h1>
        <div className={styles.applicationGrid}>
          {applications.length === 0 && (
            <p>No applications yet. Start applying to jobs!</p>
          )}

          {applications.map((app) => (
            <div key={app.id} className={styles.applicationCard}>
              <h3 className={styles.applicationTitle}>{app.jobTitle}</h3>

              <p className={styles.applicationMeta}>
                <strong>{app.company}</strong> - Status:{' '}
                <span
                  className={styles.status}
                  style={{
                    color:
                      app.interviewTime
                        ? '#ff8c00'
                        : app.status === 'Rejected'
                        ? '#dc3545'
                        : '#333',
                  }}
                >
                  {app.status}
                </span>
              </p>

              {app.interviewTime && (
                <p
                  className={styles.interviewNote}
                  style={{ fontWeight: 'bold', color: '#007bff' }}
                >
                  Interview Time: {app.interviewTime}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentApplicationsPage;
