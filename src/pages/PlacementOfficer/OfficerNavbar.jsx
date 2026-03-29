import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './OfficerNavbar.module.css';

const OfficerNavbar = () => {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        <Link to="/officer" className={styles.brandLink}>Placement Cell</Link>
      </div>

      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link to="/officer" className={styles.navLink}>Dashboard</Link>
        </li>

        <li className={styles.navItem}>
          <Link to="/officer/student-status" className={styles.navLink}>Student Status</Link>
        </li>

        {/* THEME TOGGLE BUTTON */}
        <li className={styles.navItem}>
          <button 
            onClick={toggleTheme} 
            className={styles.themeToggle} 
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
          </button>
        </li>

        <li className={styles.navItem}>
          <button onClick={handleLogout} className={styles.logoutButton}>Log Out</button>
        </li>
      </ul>
    </nav>
  );
};

export default OfficerNavbar;
