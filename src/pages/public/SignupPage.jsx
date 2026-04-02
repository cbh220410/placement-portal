import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signupUser } from '../../services/authApi';
import styles from './SignupPage.module.css';
import FloatingThemeToggle from '../../components/FloatingThemeToggle';

const roleSummaries = [
  { role: 'Student', detail: 'Apply, track status, and maintain your profile.' },
  { role: 'Employer', detail: 'Post roles, review applicants, and schedule interviews.' },
  { role: 'Placement Officer', detail: 'Coordinate campus activity and monitor outcomes.' },
  { role: 'Admin', detail: 'Manage users, reports, and overall system visibility.' },
];

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveLegacyUser = (newUser) => {
    localStorage.setItem('NEW_SIGNUP_USER', JSON.stringify(newUser));
    try {
      const stored = localStorage.getItem('users');
      const users = stored ? JSON.parse(stored) : [];
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving user list:', error);
      localStorage.setItem('users', JSON.stringify([newUser]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const newUser = {
      id: Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.role,
    };

    try {
      await signupUser({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      });
      saveLegacyUser(newUser);
      alert(`Account created for ${newUser.name} as ${newUser.role}. Please log in.`);
      navigate('/login');
      return;
    } catch (apiError) {
      const isNetworkError = apiError.message?.toLowerCase().includes('failed to fetch');
      if (isNetworkError) {
        saveLegacyUser(newUser);
        alert('Backend not reachable. Account saved locally for demo mode.');
        navigate('/login');
        return;
      }
      setErrorMessage(apiError.message || 'Unable to create account');
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

          <span className={styles.kicker}>Create portal access</span>
          <h1 className={styles.title}>Join the placement system with the role that fits your work.</h1>
          <p className={styles.description}>
            New accounts plug directly into the same placement flow used for applications, hiring
            coordination, reports, and institutional tracking.
          </p>

          <div className={styles.rolePanel}>
            <div className={styles.roleHeader}>
              <span className={styles.roleLabel}>Available roles</span>
              <span className={styles.roleHint}>Choose the workspace you need</span>
            </div>

            <div className={styles.roleList}>
              {roleSummaries.map((item, index) => (
                <div key={item.role} className={styles.roleItem}>
                  <span className={styles.roleIndex}>0{index + 1}</span>
                  <div>
                    <h2>{item.role}</h2>
                    <p>{item.detail}</p>
                  </div>
                </div>
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
            <p className={styles.formEyebrow}>New account</p>
            <h2 className={styles.heading}>Create your placement portal profile</h2>
            <p className={styles.supportText}>
              Once your account is ready, you can sign in and continue in the workspace tied to
              your role.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>
                Full name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@college.edu"
                value={formData.email}
                onChange={handleChange}
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
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="role" className={styles.label}>
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="student">Student</option>
                <option value="employer">Employer</option>
                <option value="officer">Placement Officer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

            <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create account'}
            </button>
          </form>

          <div className={styles.metaRow}>
            <p className={styles.credentials}>
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default SignupPage;
