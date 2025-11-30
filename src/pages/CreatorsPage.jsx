// This file should be named src/pages/CreatorsPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CreatorsPage.module.css';

const creators = [
  { name: 'REVANTH JALADI', role: 'Frontend Developer', phone: '8074524800', portfolio: 'https://github.com/revanth', email: '2400030024@kluniversity.in', imgSrc: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' },
  { name: 'VAMSI KRISHNA', role: 'UI/UX Designer', phone: '+91 XXXX-XXXXXX', portfolio: 'https://linkedin.com/vamsi', email: 'vamsi@example.com', imgSrc: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' },
  { name: 'JAYANTH', role: 'Backend Developer', phone: '+91 XXXX-XXXXXX', portfolio: 'https://github.com/jayanth', email: 'jayanth@example.com', imgSrc: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' },
];

const CreatorsPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.heading}>Meet the Team</h1>
        <p className={styles.subheading}>Meet the team behind the project.</p>
        
        <div className={styles.cardGrid}>
          {creators.map(creator => (
            <div key={creator.name} className={styles.card}>
              <img src={creator.imgSrc} alt={creator.name} className={styles.profileImg} />
              <h3 className={styles.cardHeading}>{creator.name}</h3>
              <p className={styles.cardText}>**Role:** {creator.role}</p>
              <p className={styles.cardText}>**Phone:** {creator.phone}</p>
              <div className={styles.socials}>
                <a href={`mailto:${creator.email}`} className={styles.socialLink}>
                  <img src="https://cdn-icons-png.flaticon.com/512/732/732223.png" alt="Outlook" className={styles.socialIcon} />
                </a>
                <a href={creator.portfolio} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                  <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="GitHub" className={styles.socialIcon} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Link to="/" className={styles.backLink}>
        <button className={styles.button}>
          Go back to Home
        </button>
      </Link>
    </div>
  );
};

export default CreatorsPage;