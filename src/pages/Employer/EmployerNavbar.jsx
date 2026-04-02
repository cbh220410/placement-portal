import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './EmployerNavbar.module.css';

const EmployerNavbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className={styles.nav}>
      <div className={styles.brandBlock}>
        <NavLink to="/employer" className={styles.brandLink}>
          Employer Portal
        </NavLink>
        <span className={styles.portalMeta}>Hiring and listings workspace</span>
      </div>

      <div className={styles.navContent}>
        <div className={styles.navList}>
          <NavLink
            to="/employer"
            end
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/employer/post-job"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Post Job
          </NavLink>
          <NavLink
            to="/employer/manage-listings"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Manage Listings
          </NavLink>
          <NavLink
            to="/employer/analytics"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Analytics
          </NavLink>
        </div>

        <div className={styles.tools}>
          <div className={styles.userChip}>
            <span className={styles.userInitial}>{user?.name?.charAt(0) || 'E'}</span>
            <span className={styles.userName}>{user?.name || 'Employer'}</span>
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

export default EmployerNavbar;
