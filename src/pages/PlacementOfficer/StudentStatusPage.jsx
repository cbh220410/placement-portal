import React, { useEffect, useMemo, useState } from "react";
import OfficerNavbar from "./OfficerNavbar";
import { getTable, updateRow } from "../../storage/db";
import {
  fetchOfficerStudentStatus,
  isBackendUnavailable,
  updateStudentPlacement,
} from "../../services/portalApi";
import styles from "./StudentStatusPage.module.css";

const normalizeStudentRow = (student) => ({
  ...student,
  placementStatus: student.placementStatus || "Unplaced",
  placedCompany: student.placedCompany && student.placedCompany !== "-" ? student.placedCompany : "",
  applicationCount: student.applicationCount || 0,
  interviewCount: student.interviewCount || 0,
});

const StudentStatusPage = () => {
  const [students, setStudents] = useState([]);
  const [companyDrafts, setCompanyDrafts] = useState({});
  const [filter, setFilter] = useState("All");
  const [usingFallback, setUsingFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savingRows, setSavingRows] = useState({});

  useEffect(() => {
    const loadStatus = async () => {
      setIsLoading(true);

      try {
        const rows = await fetchOfficerStudentStatus();
        const backendShapeIsCompatible =
          Array.isArray(rows) &&
          (rows.length === 0 ||
            rows.every(
              (row) =>
                Object.prototype.hasOwnProperty.call(row, "applicationCount") &&
                Object.prototype.hasOwnProperty.call(row, "interviewCount")
            ));

        if (!backendShapeIsCompatible) {
          throw new Error("Officer backend response is incompatible with the UI");
        }

        const normalizedRows = rows.map(normalizeStudentRow);
        setStudents(normalizedRows);
        setCompanyDrafts(
          Object.fromEntries(
            normalizedRows.map((student) => [student.id, student.placedCompany || ""])
          )
        );
        setUsingFallback(false);
        setIsLoading(false);
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

      const rows = localStudents.map((student) =>
        normalizeStudentRow({
          id: student.id,
          name: student.name,
          email: student.email,
          placementStatus: student.placementStatus || "Unplaced",
          placedCompany: student.placedCompany || "",
          applicationCount: localApplications.filter(
            (app) => String(app.studentEmail).toLowerCase() === String(student.email).toLowerCase()
          ).length,
          interviewCount: localInterviews.filter(
            (intv) => String(intv.studentEmail).toLowerCase() === String(student.email).toLowerCase()
          ).length,
        })
      );

      setStudents(rows);
      setCompanyDrafts(Object.fromEntries(rows.map((student) => [student.id, student.placedCompany || ""])));
      setIsLoading(false);
    };

    loadStatus();
  }, []);

  const setRowSaving = (id, isSaving) => {
    setSavingRows((prev) => ({ ...prev, [id]: isSaving }));
  };

  const updateStudentInState = (id, updates) => {
    setStudents((prev) =>
      prev.map((student) =>
        Number(student.id) === Number(id)
          ? normalizeStudentRow({ ...student, ...updates })
          : student
      )
    );
  };

  const handleStatusChange = async (id, value) => {
    const nextCompany = value === "Placed" ? companyDrafts[id] || "TBD" : "";
    setRowSaving(id, true);

    try {
      if (!usingFallback) {
        const updated = await updateStudentPlacement(id, {
          placementStatus: value,
          placedCompany: value === "Placed" ? nextCompany : "-",
        });

        updateStudentInState(id, {
          placementStatus: updated.placementStatus,
          placedCompany: updated.placedCompany === "-" ? "" : updated.placedCompany,
        });
      } else {
        updateRow("users", id, {
          placementStatus: value,
          placedCompany: value === "Placed" ? nextCompany : "-",
        });

        updateStudentInState(id, {
          placementStatus: value,
          placedCompany: value === "Placed" ? nextCompany : "",
        });
      }

      setCompanyDrafts((prev) => ({
        ...prev,
        [id]: value === "Placed" ? nextCompany : "",
      }));
    } catch (error) {
      alert(error.message || "Failed to update placement status");
    } finally {
      setRowSaving(id, false);
    }
  };

  const handleCompanyDraftChange = (id, value) => {
    setCompanyDrafts((prev) => ({ ...prev, [id]: value }));
  };

  const handleCompanySave = async (id) => {
    const nextCompany = (companyDrafts[id] || "").trim();

    if (!nextCompany) {
      alert("Please enter a company name.");
      return;
    }

    setRowSaving(id, true);

    try {
      if (!usingFallback) {
        const updated = await updateStudentPlacement(id, {
          placementStatus: "Placed",
          placedCompany: nextCompany,
        });

        updateStudentInState(id, {
          placementStatus: updated.placementStatus,
          placedCompany: updated.placedCompany === "-" ? "" : updated.placedCompany,
        });
      } else {
        updateRow("users", id, {
          placementStatus: "Placed",
          placedCompany: nextCompany,
        });

        updateStudentInState(id, {
          placementStatus: "Placed",
          placedCompany: nextCompany,
        });
      }
    } catch (error) {
      alert(error.message || "Failed to update company");
    } finally {
      setRowSaving(id, false);
    }
  };

  const filteredStudents = useMemo(() => {
    if (filter === "All") return students;
    return students.filter(
      (student) =>
        String(student.placementStatus).toLowerCase() === filter.toLowerCase()
    );
  }, [students, filter]);

  return (
    <div className={styles.pageContainer}>
      <OfficerNavbar />

      <div className={styles.contentContainer}>
        <section className={styles.heroSection}>
          <div>
            <span className={styles.eyebrow}>Placement tracking</span>
            <h1 className={styles.mainHeading}>Student Placement Status</h1>
            <p className={styles.heroText}>
              Review each student&apos;s application activity, interview count, and final placement status.
            </p>
          </div>

          <div className={styles.filterCard}>
            <label htmlFor="status-filter" className={styles.filterLabel}>
              Filter by Status
            </label>
            <select
              id="status-filter"
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filterSelect}
              value={filter}
            >
              <option value="All">All Students</option>
              <option value="Placed">Placed</option>
              <option value="Unplaced">Unplaced</option>
            </select>
          </div>
        </section>

        <section className={styles.tableCard}>
          {isLoading ? (
            <p className={styles.emptyState}>Loading student placement data...</p>
          ) : filteredStudents.length === 0 ? (
            <p className={styles.emptyState}>No students found for the selected filter.</p>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Student</th>
                    <th className={styles.th}>Applications</th>
                    <th className={styles.th}>Interviews</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Placed Company</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => {
                    const isSaving = Boolean(savingRows[student.id]);
                    const currentCompany = companyDrafts[student.id] ?? "";
                    const statusClass =
                      student.placementStatus === "Placed"
                        ? `${styles.statusSelect} ${styles.placed}`
                        : `${styles.statusSelect} ${styles.unplaced}`;

                    return (
                      <tr key={student.id} className={styles.tr}>
                        <td className={styles.td}>
                          <div className={styles.studentName}>{student.name}</div>
                          <div className={styles.studentEmail}>{student.email}</div>
                        </td>

                        <td className={styles.td}>{student.applicationCount}</td>
                        <td className={styles.td}>{student.interviewCount}</td>

                        <td className={styles.td}>
                          <select
                            value={student.placementStatus}
                            onChange={(e) => handleStatusChange(student.id, e.target.value)}
                            className={statusClass}
                            disabled={isSaving}
                          >
                            <option value="Unplaced">Unplaced</option>
                            <option value="Placed">Placed</option>
                          </select>
                        </td>

                        <td className={styles.td}>
                          {student.placementStatus === "Placed" ? (
                            <div className={styles.companyCell}>
                              <input
                                value={currentCompany}
                                onChange={(e) => handleCompanyDraftChange(student.id, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleCompanySave(student.id);
                                  }
                                }}
                                className={styles.companyInput}
                                placeholder="Enter company"
                                disabled={isSaving}
                              />
                              <button
                                type="button"
                                onClick={() => handleCompanySave(student.id)}
                                className={styles.saveButton}
                                disabled={isSaving}
                              >
                                {isSaving ? "Saving..." : "Save"}
                              </button>
                            </div>
                          ) : (
                            <span className={styles.companyPlaceholder}>-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentStatusPage;
