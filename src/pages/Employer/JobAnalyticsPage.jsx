import React from 'react';
import EmployerNavbar from './EmployerNavbar';
import styles from './JobAnalyticsPage.module.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const jobStats = {
  totalViews: 1200,
  totalApplications: 55,
  viewsByMonth: [100, 150, 300, 250, 400],
  applicationsByMonth: [5, 12, 20, 10, 8],
};

const chartData = jobStats.viewsByMonth.map((views, index) => ({
  month: `Month ${index + 1}`,
  views: views,
  applications: jobStats.applicationsByMonth[index],
}));

const JobAnalyticsPage = () => {
  return (
    <div className={styles.pageContainer}>
      <EmployerNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>Job Analytics Dashboard</h1>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total Views</p>
            <h2 className={styles.statNumber}>{jobStats.totalViews}</h2>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total Applications</p>
            <h2 className={styles.statNumber}>{jobStats.totalApplications}</h2>
          </div>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartHeading}>Views & Applications Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#007bff" />
              <YAxis yAxisId="right" orientation="right" stroke="#28a745" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="views" stroke="#007bff" name="Views" />
              <Line yAxisId="right" type="monotone" dataKey="applications" stroke="#28a745" name="Applications" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default JobAnalyticsPage;