import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmployerNavbar from "./EmployerNavbar";
import { getTable, addRow, updateRow } from "../../storage/db";
import { useAuth } from "../../context/AuthContext";
import styles from "./InterviewSchedulerPage.module.css";

const InterviewSchedulerPage = () => {
  const { studentId: applicationId } = useParams(); // actually applicationId
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const availableSlots = [
    { id: 1, date: "2025-10-02", time: "10:00 AM" },
    { id: 2, date: "2025-10-02", time: "02:00 PM" },
    { id: 3, date: "2025-10-03", time: "11:00 AM" },
  ];

  useEffect(() => {
    const apps = getTable("applications");
    const found = apps.find((a) => a.id === Number(applicationId));
    setApplication(found || null);
  }, [applicationId]);

  const handleBookSlot = (slot) => {
    if (!application) return;

    const interview = {
      id: Date.now(),
      applicationId: application.id,
      jobId: application.jobId,
      studentEmail: application.studentEmail,
      studentName: application.studentName,
      employerEmail: user.email,
      employerName: user.name,
      date: slot.date,
      time: slot.time,
      status: "Scheduled",
      createdAt: new Date().toISOString(),
    };

    addRow("interviews", interview);
    updateRow("applications", application.id, { status: "Interview Scheduled" });

    setSelectedSlot(slot);
    alert(
      `Interview scheduled for ${application.studentName} on ${slot.date} at ${slot.time}`
    );
  };

  if (!application) {
    return (
      <div className={styles.pageContainer}>
        <EmployerNavbar />
        <div className={styles.contentContainer}>
          <h1 className={styles.mainHeading}>Application not found!</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <EmployerNavbar />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainHeading}>
          Schedule Interview for {application.studentName}
        </h1>

        <div className={styles.schedulerCard}>
          <h3 className={styles.cardHeading}>Available Time Slots</h3>
          <div className={styles.slotsGrid}>
            {availableSlots.map((slot) => (
              <div
                key={slot.id}
                onClick={() => handleBookSlot(slot)}
                className={`${styles.slotCard} ${
                  selectedSlot?.id === slot.id ? styles.selectedSlot : ""
                }`}
              >
                <p className={styles.slotDate}>{slot.date}</p>
                <p className={styles.slotTime}>{slot.time}</p>
              </div>
            ))}
          </div>
          {selectedSlot && (
            <p className={styles.confirmationText}>
              Interview booked successfully!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewSchedulerPage;
