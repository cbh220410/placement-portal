// src/pages/public/SignupPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signupUser } from '../../services/authApi';
import styles from './SignupPage.module.css';
import FloatingThemeToggle from '../../components/FloatingThemeToggle';

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

          {errorMessage ? <p className={styles.error}>{errorMessage}</p> : null}

          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Sign Up'}
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
