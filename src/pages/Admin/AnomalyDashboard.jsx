import React from 'react';
import AdminNavbar from './AdminNavbar';
import styles from './AnomalyDashboard.module.css';

const anomalies = [
  { id: 1, type: 'High Application Rate', user: 'Jane Doe (Student)', details: 'Applied to 50 jobs in 1 hour.', severity: 'High' },
  { id: 2, type: 'Duplicate Job Posting', user: 'Acme Corp (Employer)', details: 'Posted the same "Senior Developer" job twice.', severity: 'Medium' },
  { id: 3, type: 'New Employer Alert', user: 'Tech Solutions Inc.', details: 'Joined the platform and immediately posted 10 jobs.', severity: 'Low' },
  { id: 4, type: 'Suspicious Profile', user: 'User 123 (Student)', details: 'Profile contains a broken link in the resume section.', severity: 'Low' },
];

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'High': return '#dc3545';
    case 'Medium': return '#ffc107';
    case 'Low': return '#17a2b8';
    default: return '#6c757d';
  }
};

const AnomalyDashboard = () => {
  return (
    <div className={styles.pageContainer}>
      <AdminNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>Anomaly Detection Dashboard</h1>
        
        <div className={styles.anomalyGrid}>
          {anomalies.map(anomaly => (
            <div key={anomaly.id} className={styles.anomalyCard} style={{ borderLeftColor: getSeverityColor(anomaly.severity) }}>
              <div className={styles.anomalyHeader}>
                <h3 className={styles.anomalyType}>{anomaly.type}</h3>
                <span className={styles.anomalySeverity} style={{ color: getSeverityColor(anomaly.severity) }}>{anomaly.severity}</span>
              </div>
              <p className={styles.anomalyUser}>**User:** {anomaly.user}</p>
              <p className={styles.anomalyDetails}>{anomaly.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnomalyDashboard;