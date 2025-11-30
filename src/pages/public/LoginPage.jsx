// src/pages/public/LoginPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginPage.module.css';
import FloatingThemeToggle from '../../components/FloatingThemeToggle';

// Demo hardcoded users
const HARDCODED_USERS = [
  { id: 1, email: 'student@example.com',  password: 'password123', name: 'Student User',   role: 'student' },
  { id: 2, email: 'employer@example.com', password: 'password123', name: 'Employer User',  role: 'employer' },
  { id: 3, email: 'admin@example.com',    password: 'password123', name: 'System Admin',   role: 'admin' },
  { id: 4, email: 'officer@example.com',  password: 'password123', name: 'Placement Officer', role: 'officer' },
];

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    let user = null;

    // 1. Hardcoded demo users
    user = HARDCODED_USERS.find(
      (u) => u.email === email && u.password === password
    );

    // 2. Check users saved from signup in localStorage
    if (!user) {
      try {
        const stored = localStorage.getItem('users');
        if (stored) {
          const users = JSON.parse(stored);
          user = users.find(
            (u) => u.email === email && u.password === password
          );
        }
      } catch (err) {
        console.error('Error reading users from storage:', err);
      }
    }

    // 3. Fallback: legacy NEW_SIGNUP_USER (optional)
    if (!user) {
      const storedSignup = localStorage.getItem('NEW_SIGNUP_USER');
      if (storedSignup) {
        const newUser = JSON.parse(storedSignup);
        if (newUser.email === email && newUser.password === password) {
          user = newUser;
        }
      }
    }

    if (user) {
      login(user);
    } else {
      alert('Invalid credentials!');
    }
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.glassContainer}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.heading}>Login to Your Portal</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>

          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>

        <p className={styles.credentials}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>

        <div className={styles.contact}>
          <Link to="/contact">
            <button className={styles.button}>Contact Us</button>
          </Link>
        </div>
      </motion.div>
      <FloatingThemeToggle />
    </div>
  );
};

export default LoginPage;
