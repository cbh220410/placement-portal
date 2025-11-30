import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import AdminNavbar from './AdminNavbar';
import styles from './ReportsPage.module.css';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const data = {
  labels: ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5'],
  datasets: [
    {
      label: 'Total Job Applications',
      data: [15, 22, 35, 28, 40], // Conceptual data for 5 months
      backgroundColor: 'rgba(0, 123, 255, 0.6)',
      borderColor: 'rgba(0, 123, 255, 1)',
      borderWidth: 1,
    },
  ],
};

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
  return (
    <div className={styles.pageContainer}>
      <AdminNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>System Reports</h1>

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Total Students</p>
            <h2 className={styles.metricNumber}>85</h2>
          </div>
          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Total Employers</p>
            <h2 className={styles.metricNumber}>15</h2>
          </div>
          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Active Jobs</p>
            <h2 className={styles.metricNumber}>50</h2>
          </div>
          <div className={styles.metricCard}>
            <p className={styles.metricLabel}>Total Applications</p>
            <h2 className={styles.metricNumber}>250</h2>
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