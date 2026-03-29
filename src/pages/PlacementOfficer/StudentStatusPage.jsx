// src/pages/PlacementOfficer/StudentStatusPage.jsx
import React, { useEffect, useState } from "react";
import OfficerNavbar from "./OfficerNavbar";
import { getTable, updateRow } from "../../storage/db";
import {
  fetchOfficerStudentStatus,
  isBackendUnavailable,
  updateStudentPlacement,
} from "../../services/portalApi";
import styles from "./StudentStatusPage.module.css";

const StudentStatusPage = () => {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("All");
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const rows = await fetchOfficerStudentStatus();
        setStudents(rows);
        setUsingFallback(false);
        return;
      } catch (error) {
        if (!isBackendUnavailable(error)) {
          console.error("Failed to load officer status from backend:", error);
        }
      }

      setUsingFallback(true);
      const localStudents = getTable("users").filter((u) => u.role === "student");
      const localApplications = getTable("applications");
      const localInterviews = getTable("interviews");

      const rows = localStudents.map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        placementStatus: student.placementStatus || "Unplaced",
        placedCompany: student.placedCompany || "-",
        applicationCount: localApplications.filter(
          (app) => String(app.studentEmail).toLowerCase() === String(student.email).toLowerCase()
        ).length,
        interviewCount: localInterviews.filter(
          (intv) => String(intv.studentEmail).toLowerCase() === String(student.email).toLowerCase()
        ).length,
      }));
      setStudents(rows);
    };

    loadStatus();
  }, []);

  const handleStatusChange = async (id, value) => {
    try {
      if (!usingFallback) {
        const updated = await updateStudentPlacement(id, {
          placementStatus: value,
          placedCompany: value === "Placed" ? "TBD" : "-",
        });
        setStudents((prev) =>
          prev.map((student) =>
            Number(student.id) === Number(id)
              ? {
                  ...student,
                  placementStatus: updated.placementStatus,
                  placedCompany: updated.placedCompany,
                }
              : student
          )
        );
        return;
      }
    } catch (error) {
      alert(error.message || "Failed to update placement status");
      return;
    }

    updateRow("users", id, {
      placementStatus: value,
      placedCompany: value === "Placed" ? "TBD" : "-",
    });
    setStudents((prev) =>
      prev.map((student) =>
        Number(student.id) === Number(id)
          ? {
              ...student,
              placementStatus: value,
              placedCompany: value === "Placed" ? "TBD" : "-",
            }
          : student
      )
    );
  };

  const handleCompanyChange = async (id, value) => {
    try {
      if (!usingFallback) {
        await updateStudentPlacement(id, {
          placementStatus: "Placed",
          placedCompany: value,
        });
      } else {
        updateRow("users", id, { placedCompany: value, placementStatus: "Placed" });
      }
      setStudents((prev) =>
        prev.map((student) =>
          Number(student.id) === Number(id)
            ? { ...student, placementStatus: "Placed", placedCompany: value }
            : student
        )
      );
    } catch (error) {
      alert(error.message || "Failed to update company");
    }
  };

  const filtered =
    filter === "All"
      ? students
      : students.filter(
          (student) => String(student.placementStatus).toLowerCase() === filter.toLowerCase()
        );

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
            value={filter}
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
              {filtered.map((student) => (
                <tr key={student.id}>
                  <td>
                    {student.name}
                    <br />
                    <span className={styles.email}>{student.email}</span>
                  </td>

                  <td>{student.applicationCount || 0}</td>
                  <td>{student.interviewCount || 0}</td>

                  <td>
                    <select
                      value={student.placementStatus || "Unplaced"}
                      onChange={(e) => handleStatusChange(student.id, e.target.value)}
                    >
                      <option value="Unplaced">Unplaced</option>
                      <option value="Placed">Placed</option>
                    </select>
                  </td>

                  <td>
                    {student.placementStatus === "Placed" ? (
                      <input
                        value={student.placedCompany || ""}
                        onChange={(e) => handleCompanyChange(student.id, e.target.value)}
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentStatusPage;
