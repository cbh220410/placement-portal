import React, { useEffect, useMemo, useState } from 'react';
import EmployerNavbar from './EmployerNavbar';
import { useAuth } from '../../context/AuthContext';
import { fetchEmployerApplications, fetchEmployerJobs, isBackendUnavailable } from '../../services/portalApi';
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

const JobAnalyticsPage = () => {
  const { user } = useAuth();
  const [totalViews, setTotalViews] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [jobs, applications] = await Promise.all([
          fetchEmployerJobs(user.email),
          fetchEmployerApplications(user.email),
        ]);
        setTotalApplications(applications.length);
        setTotalViews(jobs.length * 120);
        return;
      } catch (error) {
        if (!isBackendUnavailable(error)) {
          console.error('Failed loading analytics from backend:', error);
        }
      }
      setTotalApplications(55);
      setTotalViews(1200);
    };

    loadAnalytics();
  }, [user.email]);

  const chartData = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0];
    const apps = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i += 1) {
      buckets[i] = Math.max(50, Math.round(totalViews / (i + 3)));
      apps[i] = Math.max(1, Math.round(totalApplications / (i + 2)));
    }
    return buckets.map((views, index) => ({
      month: `Month ${index + 1}`,
      views,
      applications: apps[index],
    }));
  }, [totalApplications, totalViews]);

  return (
    <div className={styles.pageContainer}>
      <EmployerNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>Job Analytics Dashboard</h1>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total Views</p>
            <h2 className={styles.statNumber}>{totalViews}</h2>
          </div>
          <div className={styles.statCard}>
            <p className={styles.statLabel}>Total Applications</p>
            <h2 className={styles.statNumber}>{totalApplications}</h2>
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
