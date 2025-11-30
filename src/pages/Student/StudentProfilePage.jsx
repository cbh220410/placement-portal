import React, { useState } from 'react';
import StudentNavbar from './StudentNavbar';
import { useAuth } from '../../context/AuthContext'; // Import useAuth
import styles from './StudentProfilePage.module.css';

const StudentProfilePage = () => {
  const { user } = useAuth(); // Get the current logged-in user object

  // Initialize state with the logged-in user's actual data
  const [profile, setProfile] = useState({
    name: user.name || '',
    email: user.email || '', // CRITICAL: Use actual email
    resume: null,
    skills: 'React, JavaScript, CSS', // Default values for fields not on signup
    bio: 'Motivated student seeking opportunities in web development.',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
  };

  const handleResumeUpload = (e) => {
    if (e.target.files[0]) {
      setProfile(prevProfile => ({ ...prevProfile, resume: e.target.files[0].name }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile updated successfully!');
    console.log('Profile saved:', profile);
    // In a real app, you would send this updated profile data to the backend for this user.
  };

  return (
    <div className={styles.pageContainer}>
      <StudentNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>My Profile</h1>
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                value={profile.name} // Displays the actual logged-in user's name
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email} // Displays the actual logged-in user's email
                onChange={handleChange}
                disabled
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Skills (comma-separated)</label>
              <input
                type="text"
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Bio</label>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows="4"
                className={styles.input}
              ></textarea>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Upload Resume</label>
              <input
                type="file"
                onChange={handleResumeUpload}
                className={styles.fileInput}
              />
              {profile.resume && <p className={styles.fileName}>File: {profile.resume}</p>}
            </div>
            <button type="submit" className={styles.button}>
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;