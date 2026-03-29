// src/pages/Employer/PostJobPage.jsx
import React, { useState } from "react";
import EmployerNavbar from "./EmployerNavbar";
import { addRow } from "../../storage/db";
import { useAuth } from "../../context/AuthContext";
import { createJob, isBackendUnavailable } from "../../services/portalApi";
import styles from "./PostJobPage.module.css";

const PostJobPage = () => {
  const { user } = useAuth();

  const [jobDetails, setJobDetails] = useState({
    title: "",
    location: "",
    description: "",
    requirements: "",
  });

  const handleChange = (e) => {
    setJobDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newJob = {
      id: Date.now(),
      title: jobDetails.title,
      company: user.name,
      location: jobDetails.location,
      description: jobDetails.description,
      requirements: jobDetails.requirements,
      employerEmail: user.email,
      employerName: user.name,
      createdAt: new Date().toISOString(),
    };

    try {
      await createJob({
        title: jobDetails.title,
        location: jobDetails.location,
        description: jobDetails.description,
        requirements: jobDetails.requirements,
        employerEmail: user.email,
        employerName: user.name,
      });
    } catch (error) {
      if (!isBackendUnavailable(error)) {
        alert(error.message || "Failed to post job");
        return;
      }
      addRow("jobs", newJob);
    }

    alert("Job posted successfully!");

    setJobDetails({
      title: "",
      location: "",
      description: "",
      requirements: "",
    });
  };

  return (
    <div className={styles.pageContainer}>
      <EmployerNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>Post a New Job</h1>

        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Job Title</label>
              <input
                type="text"
                name="title"
                value={jobDetails.title}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Company</label>
              <input
                type="text"
                value={user.name}
                disabled
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Location</label>
              <input
                type="text"
                name="location"
                value={jobDetails.location}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Job Description</label>
              <textarea
                name="description"
                value={jobDetails.description}
                onChange={handleChange}
                rows="4"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Requirements</label>
              <textarea
                name="requirements"
                value={jobDetails.requirements}
                onChange={handleChange}
                rows="3"
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.button}>
              Post Job
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;
