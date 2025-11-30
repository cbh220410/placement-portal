import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './StudentNavbar.module.css';

const StudentNavbar = () => {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        <Link to="/student" className={styles.brandLink}>
          Student Portal
        </Link>
      </div>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link to="/student" className={styles.navLink}>Dashboard</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/student/jobs" className={styles.navLink}>Job Listings</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/student/applications" className={styles.navLink}>My Applications</Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/student/profile" className={styles.navLink}>My Profile</Link>
        </li>
        
        {/* THEME TOGGLE BUTTON */}
        <li className={styles.navItem}>
          <button 
            onClick={toggleTheme} 
            className={styles.themeToggle} 
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </li>

        <li className={styles.navItem}>
          <button onClick={logout} className={styles.logoutButton}>Log Out</button>
        </li>
      </ul>
    </nav>
  );
};

export default StudentNavbar;