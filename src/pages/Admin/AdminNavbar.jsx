import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './AdminNavbar.module.css';

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [unreadCount] = useState(3);

  return (
    <nav className={styles.nav}>
      <div className={styles.brandBlock}>
        <NavLink to="/admin" className={styles.brandLink}>
          Admin Portal
        </NavLink>
        <span className={styles.portalMeta}>System oversight workspace</span>
      </div>

      <div className={styles.navContent}>
        <div className={styles.navList}>
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/manage-users"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Manage Users
          </NavLink>
          <NavLink
            to="/admin/reports"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Reports
          </NavLink>
          <NavLink
            to="/admin/anomalies"
            className={({ isActive }) => `${styles.navLink} ${styles.alertLink} ${isActive ? styles.active : ''}`}
          >
            Anomalies
            {unreadCount > 0 ? <span className={styles.alertBadge}>{unreadCount}</span> : null}
          </NavLink>
        </div>

        <div className={styles.tools}>
          <div className={styles.userChip}>
            <span className={styles.userInitial}>{user?.name?.charAt(0) || 'A'}</span>
            <span className={styles.userName}>{user?.name || 'Admin'}</span>
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

export default AdminNavbar;
