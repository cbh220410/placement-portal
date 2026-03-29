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
    console.log('🔄 Loading jobs for employer:', user.email);
    try {
      const myJobs = await fetchEmployerJobs(user.email);
      console.log('✅ Fetched jobs from backend:', myJobs);
      setJobs(myJobs);
      setIsRefreshing(false);
      return;
    } catch (error) {
      console.error('❌ Backend error:', error.message);
      if (!isBackendUnavailable(error)) {
        console.error("Failed to load employer jobs:", error);
      }
    }

    console.log('📦 Falling back to localStorage');
    const allJobs = getTable("jobs");
    console.log('All jobs in localStorage:', allJobs);
    const myJobs = allJobs.filter((job) => job.employerEmail === user.email);
    console.log('Filtered jobs for this employer:', myJobs);
    setJobs(myJobs);
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadJobs();
    // Auto-refresh every 5 seconds
    const interval = setInterval(loadJobs, 5000);
    return () => clearInterval(interval);
  }, [user.email]);

  return (
    <div className={styles.pageContainer}>
      <EmployerNavbar />
      <div className={styles.contentContainer}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 className={styles.mainHeading}>Manage Job Listings</h1>
          <button 
            onClick={loadJobs} 
            disabled={isRefreshing}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
              opacity: isRefreshing ? 0.6 : 1
            }}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

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
