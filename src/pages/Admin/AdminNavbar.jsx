import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './AdminNavbar.module.css';

const AdminNavbar = () => {
    const { logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [unreadCount, setUnreadCount] = useState(3);

    return (
        <nav className={styles.nav}>
            <div className={styles.brand}>
                <Link to="/admin" className={styles.brandLink}>
                    Admin Portal
                </Link>
            </div>
            <ul className={styles.navList}>
                <li className={styles.navItem}><Link to="/admin" className={styles.navLink}>Dashboard</Link></li>
                <li className={styles.navItem}><Link to="/admin/manage-users" className={styles.navLink}>Manage Users</Link></li>
                <li className={styles.navItem}><Link to="/admin/reports" className={styles.navLink}>Reports</Link></li>
                
                <li className={styles.navItem}>
                    <Link to="/admin/anomalies" className={`${styles.navLink} ${styles.alertLink}`}>
                        Anomaly Detection
                        {unreadCount > 0 && (
                            <span className={styles.alertBadge}>{unreadCount}</span>
                        )}
                    </Link>
                </li>
                {/* THEME TOGGLE - NEW */}
                <li className={styles.navItem}>
                    <button 
                        onClick={toggleTheme} 
                        className={styles.themeToggle} 
                        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
                    </button>
                </li>

                <li className={styles.navItem}><button onClick={logout} className={styles.logoutButton}>Log Out</button></li>
            </ul>
        </nav>
    );
};

export default AdminNavbar;

