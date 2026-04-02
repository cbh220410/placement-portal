import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/authApi';
import styles from './LoginPage.module.css';
import FloatingThemeToggle from '../../components/FloatingThemeToggle';

const HARDCODED_USERS = [
  { id: 1, email: 'student@example.com', password: 'password123', name: 'Student User', role: 'student' },
  { id: 2, email: 'employer@example.com', password: 'password123', name: 'Employer User', role: 'employer' },
  { id: 3, email: 'admin@example.com', password: 'password123', name: 'System Admin', role: 'admin' },
  { id: 4, email: 'officer@example.com', password: 'password123', name: 'Placement Officer', role: 'officer' },
];

const demoAccess = [
  { role: 'Student', email: 'student@example.com' },
  { role: 'Employer', email: 'employer@example.com' },
  { role: 'Admin', email: 'admin@example.com' },
  { role: 'Officer', email: 'officer@example.com' },
];

const entryPoints = [
  'Track applications and profile progress',
  'Manage openings and candidate review',
  'Coordinate placement activity across campus',
];

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const findLegacyUser = () => {
    let user = HARDCODED_USERS.find((u) => u.email === email && u.password === password);

    if (!user) {
      try {
        const stored = localStorage.getItem('users');
        if (stored) {
          const users = JSON.parse(stored);
          user = users.find((u) => u.email === email && u.password === password);
        }
      } catch (err) {
        console.error('Error reading users from storage:', err);
      }
    }

    if (!user) {
      const storedSignup = localStorage.getItem('NEW_SIGNUP_USER');
      if (storedSignup) {
        const newUser = JSON.parse(storedSignup);
        if (newUser.email === email && newUser.password === password) {
          user = newUser;
        }
      }
    }

    return user;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await loginUser({ email, password });
      login({
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
      });
      return;
    } catch (apiError) {
      const legacyUser = findLegacyUser();
      if (legacyUser) {
        login(legacyUser);
        return;
      }
      setErrorMessage(apiError.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <FloatingThemeToggle />

      <div className={styles.shell}>
        <motion.section
          className={styles.infoPanel}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <Link to="/" className={styles.backLink}>
            Back to home
          </Link>

          <span className={styles.kicker}>Portal login</span>
          <h1 className={styles.title}>Step back into the placement workflow.</h1>
          <p className={styles.description}>
            Sign in to continue with applications, hiring reviews, scheduling, and placement
            coordination from one shared portal.
          </p>

          <div className={styles.flowCard}>
            <div className={styles.flowHeader}>
              <span className={styles.flowLabel}>What you can continue</span>
              <span className={styles.flowHint}>Secure role-based access</span>
            </div>

            <div className={styles.flowList}>
              {entryPoints.map((item, index) => (
                <div key={item} className={styles.flowItem}>
                  <span className={styles.flowIndex}>0{index + 1}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.demoPanel}>
            <div className={styles.demoHeadingRow}>
              <h2 className={styles.demoHeading}>Demo access</h2>
              <span className={styles.demoPassword}>Password: password123</span>
            </div>

            <div className={styles.demoGrid}>
              {demoAccess.map((item) => (
                <button
                  key={item.role}
                  type="button"
                  className={styles.demoChip}
                  onClick={() => {
                    setEmail(item.email);
                    setPassword('password123');
                  }}
                >
                  <span className={styles.demoRole}>{item.role}</span>
                  <span className={styles.demoEmail}>{item.email}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          className={styles.formPanel}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          <div className={styles.formIntro}>
            <p className={styles.formEyebrow}>Welcome back</p>
            <h2 className={styles.heading}>Log in to your portal</h2>
            <p className={styles.supportText}>
              Use your account to continue where your placement workflow left off.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

            <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className={styles.metaRow}>
            <p className={styles.credentials}>
              Don&apos;t have an account? <Link to="/signup">Create one</Link>
            </p>
            <Link to="/contact" className={styles.secondaryLink}>
              Contact creators
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default LoginPage;
