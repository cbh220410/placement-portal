import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import EmployerNavbar from "./EmployerNavbar";
import { getTable, addRow, updateRow } from "../../storage/db";
import { useAuth } from "../../context/AuthContext";
import { createInterview, fetchApplicationById, isBackendUnavailable } from "../../services/portalApi";
import styles from "./InterviewSchedulerPage.module.css";

const formatDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTimeInput = (date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const formatDisplayTime = (timeValue) => {
  const [hourText = "00", minuteText = "00"] = timeValue.split(":");
  const hour = Number(hourText);
  const minutes = Number(minuteText);
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalizedHour = hour % 12 || 12;
  return `${normalizedHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

const getRoundedSchedule = () => {
  const date = new Date();
  date.setSeconds(0, 0);
  const minutes = date.getMinutes();
  const roundedMinutes = minutes <= 30 ? 30 : 60;
  date.setMinutes(roundedMinutes);
  return date;
};

const InterviewSchedulerPage = () => {
  const { studentId: applicationId } = useParams();
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [liveNow, setLiveNow] = useState(new Date());
  const defaultSchedule = useMemo(() => getRoundedSchedule(), []);
  const [scheduleForm, setScheduleForm] = useState({
    date: formatDateInput(defaultSchedule),
    time: formatTimeInput(defaultSchedule),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduledMessage, setScheduledMessage] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const found = await fetchApplicationById(applicationId);
        setApplication(found || null);
        return;
      } catch (error) {
        if (!isBackendUnavailable(error)) {
          console.error("Failed to load application from backend:", error);
        }
      }

      const apps = getTable("applications");
      const found = apps.find((a) => Number(a.id) === Number(applicationId));
      setApplication(found || null);
    };

    loadApplication();
  }, [applicationId]);

  const minDate = formatDateInput(new Date());
  const isToday = scheduleForm.date === minDate;
  const minTime = isToday ? formatTimeInput(new Date()) : "00:00";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setScheduledMessage("");
    setScheduleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUseCurrentTime = () => {
    const now = getRoundedSchedule();
    setScheduleForm({
      date: formatDateInput(now),
      time: formatTimeInput(now),
    });
    setScheduledMessage("");
  };

  const handleBookSlot = async (event) => {
    event.preventDefault();

    if (!application || !scheduleForm.date || !scheduleForm.time) return;

    const interview = {
      id: Date.now(),
      applicationId: application.id,
      jobId: application.jobId,
      studentEmail: application.studentEmail,
      studentName: application.studentName,
      employerEmail: user.email,
      employerName: user.name,
      date: scheduleForm.date,
      time: formatDisplayTime(scheduleForm.time),
      status: "Scheduled",
      createdAt: new Date().toISOString(),
    };

    setIsSubmitting(true);

    try {
      await createInterview({
        applicationId: application.id,
        date: scheduleForm.date,
        time: formatDisplayTime(scheduleForm.time),
        employerEmail: user.email,
        employerName: user.name,
      });
    } catch (error) {
      if (!isBackendUnavailable(error)) {
        alert(error.message || "Failed to schedule interview");
        setIsSubmitting(false);
        return;
      }
      addRow("interviews", interview);
      updateRow("applications", application.id, { status: "Interview Scheduled" });
    }

    setScheduledMessage(
      `Interview scheduled for ${application.studentName} on ${scheduleForm.date} at ${formatDisplayTime(scheduleForm.time)}`
    );
    setIsSubmitting(false);
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
          <div className={styles.cardHeader}>
            <div>
              <h3 className={styles.cardHeading}>Interview Date and Time</h3>
              <p className={styles.cardSubtext}>
                Choose the actual date and time you want to schedule.
              </p>
            </div>

            <div className={styles.liveTimeBox}>
              <span className={styles.liveTimeLabel}>Current time</span>
              <strong className={styles.liveTimeValue}>{liveNow.toLocaleString()}</strong>
            </div>
          </div>

          <form onSubmit={handleBookSlot} className={styles.form}>
            <div className={styles.inputGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="date" className={styles.label}>Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={scheduleForm.date}
                  min={minDate}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="time" className={styles.label}>Time</label>
                <input
                  id="time"
                  name="time"
                  type="time"
                  value={scheduleForm.time}
                  min={minTime}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.buttonRow}>
              <button
                type="button"
                onClick={handleUseCurrentTime}
                className={styles.secondaryButton}
              >
                Use Current Time
              </button>

              <button
                type="submit"
                className={styles.primaryButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Scheduling..." : "Schedule Interview"}
              </button>
            </div>
          </form>

          {scheduledMessage ? (
            <p className={styles.confirmationText}>{scheduledMessage}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default InterviewSchedulerPage;
