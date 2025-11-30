// src/pages/PlacementOfficer/OfficerDashboard.jsx
import React, { useEffect, useState } from 'react';
import OfficerNavbar from './OfficerNavbar';
import { useAuth } from '../../context/AuthContext';
import styles from './OfficerDashboard.module.css';

const OfficerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    placedStudents: 0,
    unplacedStudents: 0,
    companiesRegistered: 0,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('students');
      if (!stored) {
        setStats({
          totalStudents: 0,
          placedStudents: 0,
          unplacedStudents: 0,
          companiesRegistered: 0,
        });
        return;
      }

      const students = JSON.parse(stored);

      const totalStudents = students.length;
      const placedStudents = students.filter(s => s.status === 'Placed').length;
      const unplacedStudents = totalStudents - placedStudents;

      // Distinct companies for placed students (ignore '-' and 'TBD')
      const companySet = new Set(
        students
          .filter(s => s.status === 'Placed' && s.company && s.company !== '-' && s.company !== 'TBD')
          .map(s => s.company.trim())
      );
      const companiesRegistered = companySet.size;

      setStats({
        totalStudents,
        placedStudents,
        unplacedStudents,
        companiesRegistered,
      });
    } catch (e) {
      console.error('Error reading students for officer dashboard:', e);
    }
  }, []);

  const cards = [
    { label: 'Total Students', value: stats.totalStudents, color: '#60a5fa' },
    { label: 'Placed Students', value: stats.placedStudents, color: '#10b981' },
    { label: 'Unplaced Students', value: stats.unplacedStudents, color: '#ef4444' },
    { label: 'Companies Registered', value: stats.companiesRegistered, color: '#8b5cf6' },
  ];

  return (
    <div className={styles.pageContainer}>
      <OfficerNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>Welcome, Officer {user.name}!</h1>

        <div className={styles.statsGrid}>
          {cards.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <p className={styles.statLabel}>{stat.label}</p>
              <h2 className={styles.statValue} style={{ color: stat.color }}>
                {stat.value}
              </h2>
            </div>
          ))}
        </div>

        <div className={styles.actionCard}>
          <h3 className={styles.cardHeading}>Quick Actions</h3>
          <ul className={styles.actionList}>
            <li className={styles.actionItem}>
              <span>📊</span>
              <p>View detailed placement statistics</p>
            </li>
            <li className={styles.actionItem}>
              <span>👥</span>
              <p>Manage student placement records</p>
            </li>
            <li className={styles.actionItem}>
              <span>🏢</span>
              <p>Track company interactions</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
