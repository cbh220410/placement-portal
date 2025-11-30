// src/pages/Employer/ManageListingsPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmployerNavbar from "./EmployerNavbar";
import { getTable } from "../../storage/db";
import { useAuth } from "../../context/AuthContext";
import styles from "./ManageListingsPage.module.css";

const ManageListingsPage = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const allJobs = getTable("jobs");
    const myJobs = allJobs.filter((job) => job.employerEmail === user.email);
    setJobs(myJobs);
  }, [user.email]);

  return (
    <div className={styles.pageContainer}>
      <EmployerNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>Manage Job Listings</h1>

        {jobs.length === 0 && <p>No jobs posted yet.</p>}

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
