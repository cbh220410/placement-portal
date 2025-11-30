// src/pages/PlacementOfficer/StudentStatusPage.jsx
import React, { useEffect, useState } from "react";
import OfficerNavbar from "./OfficerNavbar";
import { getTable, updateRow } from "../../storage/db";
import styles from "./StudentStatusPage.module.css";

const StudentStatusPage = () => {
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    setStudents(getTable("users").filter(u => u.role === "student"));
    setApplications(getTable("applications"));
    setInterviews(getTable("interviews"));
  }, []);

  const handleStatusChange = (id, value) => {
    updateRow("users", id, {
      placementStatus: value,
      placedCompany: value === "Placed" ? "TBD" : "-"
    });

    setStudents(getTable("users").filter(u => u.role === "student"));
  };

  const handleCompanyChange = (id, value) => {
    updateRow("users", id, { placedCompany: value });
    setStudents(getTable("users").filter(u => u.role === "student"));
  };

  const filtered = filter === "All"
    ? students
    : students.filter(s => s.placementStatus === filter);

  return (
    <div className={styles.pageContainer}>
      <OfficerNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>Student Placement Status</h1>

        <div className={styles.filterSection}>
          <label className={styles.filterLabel}>Filter by Status: </label>
          <select
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="All">All Students</option>
            <option value="Placed">Placed</option>
            <option value="Unplaced">Unplaced</option>
          </select>
        </div>

        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Applications</th>
                <th>Interviews</th>
                <th>Status</th>
                <th>Company</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((s) => {
                const apps = applications.filter(a => a.studentEmail === s.email);
                const ints = interviews.filter(i => i.studentId == s.id);

                return (
                  <tr key={s.id}>
                    <td>{s.name}<br /><span className={styles.email}>{s.email}</span></td>

                    <td>
                      {apps.length === 0 ? "—" : apps.map(a => (
                        <div key={a.id}>{a.jobTitle} @ {a.company}</div>
                      ))}
                    </td>

                    <td>
                      {ints.length === 0 ? "—" : ints.map(i => (
                        <div key={i.id}>
                          {i.date} - {i.time}
                        </div>
                      ))}
                    </td>

                    <td>
                      <select
                        value={s.placementStatus || "Unplaced"}
                        onChange={(e) => handleStatusChange(s.id, e.target.value)}
                      >
                        <option value="Unplaced">Unplaced</option>
                        <option value="Placed">Placed</option>
                      </select>
                    </td>

                    <td>
                      {s.placementStatus === "Placed" ? (
                        <input
                          value={s.placedCompany || ""}
                          onChange={(e) => handleCompanyChange(s.id, e.target.value)}
                        />
                      ) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentStatusPage;
