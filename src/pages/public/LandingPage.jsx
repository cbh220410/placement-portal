import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FloatingThemeToggle from '../../components/FloatingThemeToggle';
import styles from './LandingPage.module.css';

const roles = [
  {
    name: 'Student',
    label: 'Career Track',
    description: 'Search openings, save progress, and stay ready for interviews.',
    note: 'Jobs, applications, profile',
    route: '/login',
    accent: '#0f766e',
  },
  {
    name: 'Employer',
    label: 'Hiring Desk',
    description: 'Publish roles, review talent, and move shortlisted candidates faster.',
    note: 'Listings, applicants, interviews',
    route: '/login',
    accent: '#b45309',
  },
  {
    name: 'Placement Officer',
    label: 'Campus Ops',
    description: 'Monitor student progress and coordinate outcomes across drives.',
    note: 'Placement status, coordination, summaries',
    route: '/login',
    accent: '#1d4ed8',
  },
  {
    name: 'Admin',
    label: 'Control Room',
    description: 'Oversee users, platform health, and reporting from one place.',
    note: 'Users, reports, activity',
    route: '/login',
    accent: '#be123c',
  },
];

const highlights = [
  { value: '4', label: 'Role-based workspaces' },
  { value: '1', label: 'Shared placement pipeline' },
  { value: '24/7', label: 'Access across campus teams' },
];

const checkpoints = [
  'Profile setup and role access',
  'Drive discovery and job publishing',
  'Application review and interview scheduling',
  'Placement tracking with admin visibility',
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const LandingPage = () => {
  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <FloatingThemeToggle />

      <div className={styles.shell}>
        <motion.header className={styles.topBar} variants={fadeUp}>
          <div className={styles.brandBlock}>
            <span className={styles.brandMark}>PP</span>
            <div>
              <p className={styles.brandEyebrow}>Placement Portal</p>
              <h1 className={styles.brandTitle}>Placement Interaction System</h1>
            </div>
          </div>

          <nav className={styles.topNav} aria-label="Quick links">
            <Link to="/login" className={styles.topNavLink}>
              Login
            </Link>
            <Link to="/signup" className={styles.topNavButton}>
              Create account
            </Link>
          </nav>
        </motion.header>

        <section className={styles.hero}>
          <motion.div className={styles.copyColumn} variants={fadeUp}>
            <span className={styles.kicker}>Campus hiring, handled in one flow</span>
            <h2 className={styles.heroTitle}>
              A smoother bridge between students, recruiters, placement teams, and admins.
            </h2>
            <p className={styles.heroText}>
              This portal is designed for the full placement journey: from publishing opportunities
              and discovering jobs to tracking applications, interviews, and outcomes across the
              institution.
            </p>

            <div className={styles.actionRow}>
              <Link to="/login" className={styles.primaryAction}>
                Enter portal
              </Link>
              <Link to="/signup" className={styles.secondaryAction}>
                Register a role
              </Link>
              <Link to="/contact" className={styles.inlineLink}>
                Meet the creators
              </Link>
            </div>

            <div className={styles.metricsRow}>
              {highlights.map((item) => (
                <div key={item.label} className={styles.metricPill}>
                  <span className={styles.metricValue}>{item.value}</span>
                  <span className={styles.metricLabel}>{item.label}</span>
                </div>
              ))}
            </div>

            <div className={styles.journeyPanel}>
              <div className={styles.journeyHeader}>
                <span className={styles.journeyLabel}>Placement flow</span>
                <span className={styles.journeyHint}>Built for real campus handoffs</span>
              </div>

              <div className={styles.journeyTrack}>
                {checkpoints.map((item, index) => (
                  <div key={item} className={styles.journeyStep}>
                    <span className={styles.journeyIndex}>0{index + 1}</span>
                    <p className={styles.journeyText}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div className={styles.visualColumn} variants={fadeUp}>
            <div className={styles.orbitBackdrop} />
            <div className={styles.roleCluster}>
              {roles.map((role, index) => (
                <motion.div
                  key={role.name}
                  className={styles.roleWrap}
                  initial={{ opacity: 0, x: 32, rotate: 1.4 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.18 + index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    to={role.route}
                    className={styles.roleCard}
                    style={{ '--role-accent': role.accent }}
                  >
                    <div className={styles.roleHeader}>
                      <span className={styles.roleBadge}>{role.label}</span>
                      <span className={styles.roleArrow}>Explore</span>
                    </div>

                    <div className={styles.roleBody}>
                      <h3 className={styles.roleName}>{role.name}</h3>
                      <p className={styles.roleDescription}>{role.description}</p>
                    </div>

                    <div className={styles.roleMeta}>
                      <span>{role.note}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className={styles.signalRibbon}>
              <span className={styles.signalLabel}>Live workflow</span>
              <div className={styles.signalLine}>
                <span>Openings</span>
                <span>Review</span>
                <span>Interviews</span>
                <span>Placement</span>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
};

export default LandingPage;
