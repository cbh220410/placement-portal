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
    { name: "Student", description: "Discover jobs and manage your applications.", route: "/login", color: "#007bff", label: "Learner" },
    { name: "Employer", description: "Post listings and find the best talent.", route: "/login", color: "#16a34a", label: "Recruiter" },
    { name: "Admin", description: "Oversee the entire platform and user data.", route: "/login", color: "#dc2626", label: "Control" },
    { name: "Placement Officer", description: "Track placement records and manage company interactions.", route: "/login", color: "#7c3aed", label: "Coordinator" },
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
            style={{ "--role-accent": role.color }}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -10, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
            transition={{ delay: index * 0.2 }}
          >
            <Link to={role.route} className={styles.cardLink}>
              <div className={styles.cardTop}>
                <span className={styles.roleLabel}>{role.label}</span>
                <span className={styles.cardArrow}>→</span>
              </div>

              <div className={styles.cardBody}>
                <h2 className={styles.cardHeading}>{role.name}</h2>
                <p className={styles.cardText}>{role.description}</p>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.loginButton}>Enter Portal</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
