// src/pages/public/SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './SignupPage.module.css';
import FloatingThemeToggle from '../../components/FloatingThemeToggle';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build the new user object
    const newUser = {
      id: Date.now(), // simple unique id
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role, // student / employer / officer / admin
    };

    // Save a copy for your older login flow (if you still want it)
    localStorage.setItem('NEW_SIGNUP_USER', JSON.stringify(newUser));

    // 🔥 Save into global users list
    try {
      const stored = localStorage.getItem('users');
      const users = stored ? JSON.parse(stored) : [];
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
    } catch (err) {
      console.error('Error saving user list:', err);
      localStorage.setItem('users', JSON.stringify([newUser]));
    }

    alert(`Account created for ${newUser.name} as ${newUser.role}. Please log in.`);
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles.glassContainer}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className={styles.heading}>Create a New Account</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
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
            <label htmlFor="role" className={styles.label}>I am a...</label>
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

          <button type="submit" className={styles.button}>
            Sign Up
          </button>
        </form>

        <p className={styles.credentials}>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </motion.div>
      <FloatingThemeToggle />
    </div>
  );
};

export default SignupPage;
