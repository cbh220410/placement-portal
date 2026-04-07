import React, { useEffect, useState } from 'react';
import StudentNavbar from './StudentNavbar';
import { useAuth } from '../../context/AuthContext';
import { fetchUserByEmail, isBackendUnavailable, updateStudentProfile as updateStudentProfileApi } from '../../services/portalApi';
import styles from './StudentProfilePage.module.css';

const normalizeResumeLink = (value) => {
  const trimmed = value?.trim() || '';
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const StudentProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [backendUserId, setBackendUserId] = useState(user?.id || null);
  const [profile, setProfile] = useState({
    name: user.name || '',
    email: user.email || '',
    resume: null,
    skills: 'React, JavaScript, CSS',
    bio: 'Motivated student seeking opportunities in web development.',
  });
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        const backendProfile = await fetchUserByEmail(user.email);
        setBackendUserId(backendProfile.id || null);
        setProfile((prev) => ({
          ...prev,
          name: backendProfile.name || prev.name,
          email: backendProfile.email || prev.email,
          skills: backendProfile.skills || prev.skills,
          bio: backendProfile.bio || prev.bio,
          resume: backendProfile.resume || prev.resume,
        }));
      } catch (error) {
        if (!isBackendUnavailable(error)) {
          console.error('Failed to load profile from backend:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const userIdToUpdate = backendUserId || user.id;
      if (!userIdToUpdate) {
        throw new Error('Profile id not available. Please log out and log in again.');
      }

      const updatedProfile = await updateStudentProfileApi(userIdToUpdate, {
        name: profile.name,
        skills: profile.skills,
        bio: profile.bio,
        resume: normalizeResumeLink(profile.resume),
      });

      setBackendUserId(updatedProfile.id || userIdToUpdate);
      setProfile((prev) => ({
        ...prev,
        name: updatedProfile.name || prev.name,
        email: updatedProfile.email || prev.email,
        skills: updatedProfile.skills || '',
        bio: updatedProfile.bio || '',
        resume: updatedProfile.resume || null,
      }));
      updateUser({
        id: updatedProfile.id || userIdToUpdate,
        name: updatedProfile.name || profile.name,
        email: updatedProfile.email || profile.email,
      });
    } catch (error) {
      if (isBackendUnavailable(error)) {
        alert('Backend not reachable. Profile changes were not saved.');
      } else {
        alert(error.message || 'Failed to update profile');
      }
      setIsSaving(false);
      return;
    }
    alert('Profile updated successfully!');
    setIsSaving(false);
  };

  return (
    <div className={styles.pageContainer}>
      <StudentNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>
          My Profile {loading ? '(syncing...)' : ''}
        </h1>
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
                value={profile.email}
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
              <label className={styles.label}>Resume Link</label>
              <input
                type="url"
                name="resume"
                value={profile.resume || ''}
                onChange={handleChange}
                placeholder="Paste your Google Drive or resume URL"
                className={styles.input}
              />
              <p className={styles.helperText}>
                Paste a public Google Drive, OneDrive, or direct resume link so employers can open it.
              </p>
              {profile.resume ? (
                <a
                  href={normalizeResumeLink(profile.resume)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.resumePreviewLink}
                >
                  Preview current resume link
                </a>
              ) : null}
            </div>
            <button type="submit" className={styles.button} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
