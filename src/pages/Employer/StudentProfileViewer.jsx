// src/pages/Employer/StudentProfileViewer.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmployerNavbar from "./EmployerNavbar";
import { getTable } from "../../storage/db";
import styles from "./StudentProfileViewer.module.css";

const StudentProfileViewer = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // Load user details
    const users = getTable("users");
    const s = users.find((u) => String(u.id) === String(studentId));
    setStudent(s);

    // Load applications submitted by this student
    const allApps = getTable("applications").filter(
      (app) => String(app.studentId) === String(studentId)
    );

    setApplications(allApps);
  }, [studentId]);

  if (!student) {
    return (
      <div className={styles.pageContainer}>
        <EmployerNavbar />
        <h1 className={styles.notFoundHeading}>Student Not Found!</h1>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <EmployerNavbar />

      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>
          Viewing Profile: {student.name}
        </h1>

        {/* ---------------------------------------
            STUDENT INFORMATION CARD
        ----------------------------------------- */}
        <div className={styles.profileCard}>
          <h2 className={styles.name}>{student.name}</h2>
          <p className={styles.infoText}><strong>Email:</strong> {student.email}</p>
          <p className={styles.infoText}>
            <strong>Skills:</strong> {student.skills || "Not provided"}
          </p>
          <p className={styles.infoText}>
            <strong>Bio:</strong> {student.bio || "No bio available"}
          </p>

          <p className={styles.infoText}>
            <strong>Resume:</strong>{" "}
            {student.resume ? (
              <a
                href={student.resume}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.resumeLink}
              >
                View Resume
              </a>
            ) : (
              <span className={styles.noResume}>No Resume Uploaded</span>
            )}
          </p>
        </div>

        {/* ---------------------------------------
            APPLICATION HISTORY SECTION
        ----------------------------------------- */}
        <div className={styles.applicationHistoryCard}>
          <h2 className={styles.cardHeading}>Application History</h2>

          {applications.length === 0 ? (
            <p className={styles.noApplications}>No applications submitted.</p>
          ) : (
            <ul className={styles.appList}>
              {applications.map((app) => (
                <li key={app.id} className={styles.appItem}>
                  <strong>{app.jobTitle}</strong> — {app.status}
                  <br />
                  <small>Applied on: {new Date(app.date).toDateString()}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfileViewer;
