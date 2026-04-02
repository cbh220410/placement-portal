import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Mail, Phone } from 'lucide-react';
import FloatingThemeToggle from '../components/FloatingThemeToggle';
import styles from './CreatorsPage.module.css';

const profile = {
  name: 'Revanth Jaladi',
  role: 'Frontend Developer',
  phone: '8074524800',
  email: '2400030024@kluniversity.in',
  github: 'https://github.com/revanth',
  summary:
    'Focused on crafting the student-facing experience, public entry flow, and a cleaner placement portal interface across light and dark themes.',
};

const ContactPage = () => {
  return (
    <div className={styles.container}>
      <FloatingThemeToggle />

      <div className={styles.shell}>
        <motion.section
          className={styles.infoPanel}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <Link to="/" className={styles.backLink}>
            Back to home
          </Link>

          <span className={styles.kicker}>Project contact</span>
          <h1 className={styles.title}>Meet the creator behind this placement portal experience.</h1>
          <p className={styles.description}>
            If you want to discuss the interface, frontend improvements, or the overall product
            direction, you can reach out directly here.
          </p>

          <div className={styles.storyCard}>
            <div className={styles.storyHeader}>
              <span className={styles.storyLabel}>Current focus</span>
              <span className={styles.storyHint}>Placement-first product design</span>
            </div>

            <p className={styles.storyText}>{profile.summary}</p>

            <div className={styles.storyPoints}>
              <div className={styles.storyPoint}>
                <span className={styles.pointIndex}>01</span>
                <p>Public portal flow and onboarding screens</p>
              </div>
              <div className={styles.storyPoint}>
                <span className={styles.pointIndex}>02</span>
                <p>Theme-aware UI for light and dark mode</p>
              </div>
              <div className={styles.storyPoint}>
                <span className={styles.pointIndex}>03</span>
                <p>Consistent visual language across role portals</p>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className={styles.profilePanel}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <div className={styles.avatar}>
            <img
              src="/revanth-profile.png"
              alt="Revanth Jaladi"
              className={styles.avatarImage}
            />
          </div>
          <p className={styles.profileEyebrow}>Primary profile</p>
          <h2 className={styles.profileName}>{profile.name}</h2>
          <p className={styles.profileRole}>{profile.role}</p>

          <div className={styles.contactList}>
            <a href={`mailto:${profile.email}`} className={styles.contactItem}>
              <Mail size={18} />
              <span>{profile.email}</span>
            </a>

            <a href={`tel:${profile.phone}`} className={styles.contactItem}>
              <Phone size={18} />
              <span>{profile.phone}</span>
            </a>

            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactItem}
            >
              <Github size={18} />
              <span>github.com/revanth</span>
            </a>
          </div>

          <div className={styles.actionRow}>
            <Link to="/login" className={styles.primaryAction}>
              Open portal
            </Link>
            <Link to="/" className={styles.secondaryAction}>
              Return home
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ContactPage;
