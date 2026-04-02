import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './StudentNavbar.module.css';

const StudentNavbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className={styles.nav}>
      <div className={styles.brandBlock}>
        <NavLink to="/student" className={styles.brandLink}>
          Student Portal
        </NavLink>
        <span className={styles.portalMeta}>Career progress workspace</span>
      </div>

      <div className={styles.navContent}>
        <div className={styles.navList}>
          <NavLink
            to="/student"
            end
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/student/jobs"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Job Listings
          </NavLink>
          <NavLink
            to="/student/applications"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Applications
          </NavLink>
          <NavLink
            to="/student/profile"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Profile
          </NavLink>
        </div>

        <div className={styles.tools}>
          <div className={styles.userChip}>
            <span className={styles.userInitial}>{user?.name?.charAt(0) || 'S'}</span>
            <span className={styles.userName}>{user?.name || 'Student'}</span>
          </div>

          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? 'Light' : 'Dark'}
          </button>

          <button onClick={logout} className={styles.logoutButton}>
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;
