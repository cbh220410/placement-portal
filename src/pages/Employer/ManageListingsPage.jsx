// src/pages/Employer/ManageListingsPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmployerNavbar from "./EmployerNavbar";
import { getTable } from "../../storage/db";
import { useAuth } from "../../context/AuthContext";
import { fetchEmployerJobs, isBackendUnavailable } from "../../services/portalApi";
import styles from "./ManageListingsPage.module.css";

const ManageListingsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadJobs = async () => {
    setIsRefreshing(true);
    try {
      const myJobs = await fetchEmployerJobs(user.email);
      setJobs(myJobs);
      setIsRefreshing(false);
      return;
    } catch (error) {
      if (!isBackendUnavailable(error)) {
        console.error("Failed to load employer jobs:", error);
      }
    }

    const allJobs = getTable("jobs");
    const myJobs = allJobs.filter((job) => job.employerEmail === user.email);
    setJobs(myJobs);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 5000);
    return () => clearInterval(interval);
  }, [user.email]);

  return (
    <div className={styles.pageContainer}>
      <EmployerNavbar />
      <div className={styles.contentContainer}>
        <div className={styles.toolbar}>
          <h1 className={styles.mainHeading}>Manage Job Listings</h1>
          <button onClick={loadJobs} disabled={isRefreshing} className={styles.refreshButton}>
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {jobs.length === 0 && <p className={styles.emptyState}>No jobs posted yet.</p>}

        {jobs.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>Title</th>
                <th className={styles.tableHeader}>Location</th>
                <th className={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{job.title}</td>
                  <td className={styles.tableCell}>{job.location}</td>
                  <td className={styles.tableCell}>
                    <Link to={`/employer/manage-listings/${job.id}`}>
                      <button className={styles.viewButton}>View</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageListingsPage;
