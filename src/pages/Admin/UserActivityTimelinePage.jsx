// This file should be named src/pages/Admin/UserActivityTimelinePage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import styles from './UserActivityTimelinePage.module.css';

const userActivityData = {
  '1': [
    { id: 1, event: 'Logged in', date: 'Sept 15, 2025' },
    { id: 2, event: 'Updated profile', date: 'Sept 16, 2025' },
    { id: 3, event: 'Applied to "Frontend Developer" job', date: 'Sept 17, 2025' },
    { id: 4, event: 'Logged out', date: 'Sept 17, 2025' },
  ],
  '2': [
    { id: 5, event: 'Logged in', date: 'Sept 16, 2025' },
    { id: 6, event: 'Posted new job listing', date: 'Sept 16, 2025' },
    { id: 7, event: 'Viewed applications for "Senior Developer"', date: 'Sept 18, 2025' },
  ],
};

const UserActivityTimelinePage = () => {
  const { userId } = useParams();
  const activity = userActivityData[userId] || [];
  const user = { name: `User ${userId}` };

  if (activity.length === 0) {
    return (
      <div className={styles.pageContainer}>
        <AdminNavbar />
        <h1 className={styles.notFoundHeading}>User has no recorded activity.</h1>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <AdminNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>Activity Timeline for {user.name}</h1>
        <div className={styles.timelineGrid}>
          {activity.map(event => (
            <div key={event.id} className={styles.timelineEvent}>
              <p className={styles.eventText}>{event.event}</p>
              <p className={styles.eventDate}>{event.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserActivityTimelinePage;