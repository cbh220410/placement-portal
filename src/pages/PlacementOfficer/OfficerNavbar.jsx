import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './OfficerNavbar.module.css';

const OfficerNavbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.brandBlock}>
        <NavLink to="/officer" className={styles.brandLink}>
          Placement Cell
        </NavLink>
        <span className={styles.portalMeta}>Campus coordination workspace</span>
      </div>

      <div className={styles.navContent}>
        <div className={styles.navList}>
          <NavLink
            to="/officer"
            end
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/officer/student-status"
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Student Status
          </NavLink>
        </div>

        <div className={styles.tools}>
          <div className={styles.userChip}>
            <span className={styles.userInitial}>{user?.name?.charAt(0) || 'O'}</span>
            <span className={styles.userName}>{user?.name || 'Officer'}</span>
          </div>

          <button
            onClick={toggleTheme}
            className={styles.themeToggle}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? 'Light' : 'Dark'}
          </button>

          <button onClick={handleLogout} className={styles.logoutButton}>
            Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default OfficerNavbar;
