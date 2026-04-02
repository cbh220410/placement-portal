import React, { useEffect, useState } from 'react';
import { BriefcaseBusiness, CircleUserRound, ClipboardList, CalendarClock } from 'lucide-react';
import StudentNavbar from './StudentNavbar';
import { useAuth } from '../../context/AuthContext';
import { getApplications, getInterviews } from '../../utils/storage';
import { fetchStudentSummary, isBackendUnavailable } from '../../services/portalApi';
import styles from './StudentDashboard.module.css';

const getProfileCompletion = (profileData) => {
  const totalFields = 5;
  let completedFields = 0;
  if (profileData.name) completedFields++;
  if (profileData.resume) completedFields++;
  if (profileData.skills && profileData.skills.length > 0) completedFields++;
  if (profileData.education) completedFields++;
  if (profileData.experience) completedFields++;
  return (completedFields / totalFields) * 100;
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviewCount: 0,
    applications: [],
    interviews: [],
    applicationsByStatus: {},
    interviewsByStatus: {},
  });

  const profileData = {
    name: user.name,
    resume: 'resume.pdf',
    skills: ['React', 'JavaScript', 'HTML'],
    education: 'University of XYZ',
    experience: null,
  };

  const profileCompletion = getProfileCompletion(profileData);

  const loadSummary = async () => {
    try {
      const summary = await fetchStudentSummary(user.email);
      setStats(summary);
      return;
    } catch (error) {
      if (!isBackendUnavailable(error)) {
        console.error('Failed loading student dashboard summary:', error);
      }
    }

    const allApps = getApplications().filter((app) => app.studentEmail === user.email);
    const allInterviews = getInterviews().filter((intv) => intv.studentEmail === user.email);

    setStats({
      totalApplications: allApps.length,
      interviewCount: allInterviews.length,
      applications: allApps,
      interviews: allInterviews,
      applicationsByStatus: {},
      interviewsByStatus: {},
    });
  };

  useEffect(() => {
    loadSummary();
    const interval = setInterval(loadSummary, 5000);
    return () => clearInterval(interval);
  }, [user.email]);

  const statCards = [
    {
      label: 'Profile completion',
      value: `${profileCompletion.toFixed(0)}%`,
      note: 'Keep your profile placement-ready',
      icon: <CircleUserRound size={18} />,
    },
    {
      label: 'Applications sent',
      value: stats.totalApplications,
      note: 'Track where you stand',
      icon: <ClipboardList size={18} />,
    },
    {
      label: 'Interviews scheduled',
      value: stats.interviewCount,
      note: 'Upcoming hiring conversations',
      icon: <CalendarClock size={18} />,
    },
  ];

  const nextSteps = [
    profileCompletion < 100 ? 'Complete your profile to improve employer visibility.' : 'Your profile is in strong shape for recruiters.',
    stats.interviewCount > 0 ? 'Review your scheduled interviews and prepare for the next round.' : 'Apply to more roles to increase interview opportunities.',
    'Keep checking job listings for fresh openings that match your skills.',
  ];

  return (
    <div className={styles.pageContainer}>
      <StudentNavbar />

      <div className={styles.contentContainer}>
        <section className={styles.heroSection}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Student workspace</span>
            <h1 className={styles.mainHeading}>Welcome back, {user.name}.</h1>
            <p className={styles.heroText}>
              Stay on top of your profile, applications, and interview activity from one placement
              dashboard.
            </p>
          </div>

          <div className={styles.heroBadge}>
            <BriefcaseBusiness size={18} />
            <span>Placement journey in motion</span>
          </div>
        </section>

        <section className={styles.statGrid}>
          {statCards.map((card) => (
            <article key={card.label} className={styles.statCard}>
              <div className={styles.statHeader}>
                <span className={styles.statIcon}>{card.icon}</span>
                <span className={styles.statLabel}>{card.label}</span>
              </div>
              <p className={styles.statValue}>{card.value}</p>
              <p className={styles.statNote}>{card.note}</p>
            </article>
          ))}
        </section>

        <section className={styles.panelGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Profile readiness</h2>
              <span className={styles.panelHint}>Current completion snapshot</span>
            </div>

            <div className={styles.progressBarContainer}>
              <div className={styles.progressBar} style={{ width: `${profileCompletion}%` }} />
            </div>

            <p className={styles.panelText}>
              Your profile is <strong>{profileCompletion.toFixed(0)}%</strong> complete.
            </p>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Application breakdown</h2>
              <span className={styles.panelHint}>Status across active submissions</span>
            </div>

            {Object.keys(stats.applicationsByStatus).length > 0 ? (
              <div className={styles.statusList}>
                {Object.entries(stats.applicationsByStatus).map(([status, count]) => (
                  <div key={status} className={styles.statusRow}>
                    <span>{status}</span>
                    <strong>{count}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>Application status details will appear here as you apply.</p>
            )}
          </article>
        </section>

        <section className={styles.panelGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Upcoming interviews</h2>
              <span className={styles.panelHint}>Your next five scheduled items</span>
            </div>

            {stats.interviews.length > 0 ? (
              <div className={styles.list}>
                {stats.interviews.slice(0, 5).map((intv) => (
                  <div key={intv.id} className={styles.listItem}>
                    <p className={styles.listTitle}>
                      {new Date(intv.interviewDate).toLocaleDateString()}
                    </p>
                    <p className={styles.listMeta}>Status: {intv.status}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.emptyState}>No interviews scheduled yet.</p>
            )}
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Next steps</h2>
              <span className={styles.panelHint}>Suggested actions for this week</span>
            </div>

            <div className={styles.actionList}>
              {nextSteps.map((item) => (
                <div key={item} className={styles.actionItem}>
                  <span className={styles.actionIndex}>Go</span>
                  <p className={styles.actionText}>{item}</p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
