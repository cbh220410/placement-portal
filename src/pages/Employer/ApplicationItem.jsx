import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./ApplicationItem.module.css";

const ApplicationItem = ({ application, onStatusChange }) => {
  const [status, setStatus] = useState(application.status || "Submitted");

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(application.id, newStatus);
    }
  };

  return (
    <div className={styles.applicationCard}>
      <div className={styles.headerRow}>
        <div>
          <Link
            to={`/employer/view-profile/${encodeURIComponent(
              application.studentEmail
            )}`}
            className={styles.nameLink}
          >
            {application.studentName || "Unknown Student"}
          </Link>
          <p className={styles.emailText}>{application.studentEmail}</p>
        </div>
        <span className={styles.statusPill}>{status}</span>
      </div>

      <div className={styles.bodyRow}>
        <p className={styles.jobText}>
          Applied for <strong>{application.jobTitle}</strong> at{" "}
          <strong>{application.company}</strong>
        </p>
        <p className={styles.appliedAt}>
          Applied on{" "}
          {application.appliedAt
            ? new Date(application.appliedAt).toLocaleString()
            : "N/A"}
        </p>
      </div>

      <div className={styles.controlsRow}>
        <div className={styles.statusGroup}>
          <label className={styles.label}>Update Status:</label>
          <select
            value={status}
            onChange={handleStatusChange}
            className={styles.statusSelect}
          >
            <option value="Submitted">Submitted</option>
            <option value="In Review">In Review</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className={styles.buttonGroup}>
          <Link to={`/employer/schedule-interview/${application.id}`}>
            <button
              className={styles.scheduleButton}
              onClick={() =>
                onStatusChange &&
                onStatusChange(application.id, "Interview Scheduled")
              }
            >
              Schedule Interview
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ApplicationItem;
