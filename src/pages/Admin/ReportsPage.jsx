import React, { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import AdminNavbar from './AdminNavbar';
import { fetchReports, isBackendUnavailable } from '../../services/portalApi';
import styles from './ReportsPage.module.css';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const ReportsPage = () => {
  const [metrics, setMetrics] = useState({
    totalStudents: 85,
    totalEmployers: 15,
    activeJobs: 50,
    totalApplications: 250,
  });
  const [monthly, setMonthly] = useState([
    { month: 'Month 1', applications: 15 },
    { month: 'Month 2', applications: 22 },
    { month: 'Month 3', applications: 35 },
    { month: 'Month 4', applications: 28 },
    { month: 'Month 5', applications: 40 },
  ]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const report = await fetchReports();
        setMetrics({
          totalStudents: Number(report.totalStudents || 0),
          totalEmployers: Number(report.totalEmployers || 0),
          activeJobs: Number(report.activeJobs || 0),
          totalApplications: Number(report.totalApplications || 0),
        });
        if (Array.isArray(report.monthlyApplications) && report.monthlyApplications.length > 0) {
          setMonthly(report.monthlyApplications);
        }
      } catch (error) {
        if (!isBackendUnavailable(error)) {
          console.error('Failed loading reports from backend:', error);
        }
      }
    };

    loadReports();
  }, []);

  const data = useMemo(
    () => ({
      labels: monthly.map((item) => item.month),
      datasets: [
        {
          label: 'Total Job Applications',
          data: monthly.map((item) => item.applications),
          backgroundColor: 'rgba(0, 123, 255, 0.6)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1,
        },
      ],
    }),
    [monthly]
  );

  return (
    <div className={styles.pageContainer}>
      <AdminNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>System Reports</h1>

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Total Students</p>
            <h2 className={styles.metricNumber}>{metrics.totalStudents}</h2>
          </div>
          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Total Employers</p>
            <h2 className={styles.metricNumber}>{metrics.totalEmployers}</h2>
          </div>
          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Active Jobs</p>
            <h2 className={styles.metricNumber}>{metrics.activeJobs}</h2>
          </div>
          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Total Applications</p>
            <h2 className={styles.metricNumber}>{metrics.totalApplications}</h2>
          </div>
        </div>
        
        <div className={styles.chartCard}>
          <h3 className={styles.cardHeading}>Job Applications Over Time</h3>
          <div className={styles.chartArea}> 
            {/* The actual chart component */}
            <Bar options={options} data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
