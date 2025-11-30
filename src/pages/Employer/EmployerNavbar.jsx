// This file should be named src/pages/Employer/EmployerNavbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './EmployerNavbar.module.css';

const EmployerNavbar = () => {
  const { logout } = useAuth();

  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        <Link to="/employer" className={styles.brandLink}>
          Employer Portal
        </Link>
      </div>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link to="/employer" className={styles.navLink}>Dashboard</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/employer/post-job" className={styles.navLink}>Post a Job</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/employer/manage-listings" className={styles.navLink}>Manage Listings</Link>
        </li>
        <li className={styles.navItem}>
        <Link to="/employer/analytics" className={styles.navLink}>Analytics</Link>
        </li>
        <li className={styles.navItem}>
          <button onClick={logout} className={styles.logoutButton}>Log Out</button>
        </li>
      </ul>
    </nav>
  );
};

export default EmployerNavbar;