import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FloatingThemeToggle from '../../components/FloatingThemeToggle';
import styles from './LandingPage.module.css';

const LandingPage = () => {
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  const roles = [
    { name: "Student", description: "Discover jobs and manage your applications.", route: "/login", color: "#007bff" },
    { name: "Employer", description: "Post listings and find the best talent.", route: "/login", color: "#28a745" },
    { name: "Admin", description: "Oversee the entire platform and user data.", route: "/login", color: "#dc3545" },
    { name: "Placement Officer", description: "Track placement records and manage company interactions.", route: "/login", color: "#8e44ad" },
  ];

  return (
    <div className={styles.container}>
      <FloatingThemeToggle />
      <h1 className={styles.mainHeading}>Placement Interaction System</h1>
      <p className={styles.subHeading}>Please select your role to log in</p>
      
      <div className={styles.cardContainer}>
        {roles.map((role, index) => (
          <motion.div
            key={index}
            className={styles.card}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -10, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
            transition={{ delay: index * 0.2 }}
          >
            <Link to={role.route} className={styles.cardLink}>
              <h2 className={styles.cardHeading} style={{ color: role.color }}>{role.name}</h2>
              <p className={styles.cardText}>{role.description}</p>
              <div className={styles.loginButton} style={{ backgroundColor: role.color }}>Log In</div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;