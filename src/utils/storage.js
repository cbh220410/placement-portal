// src/utils/storage.js

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

// JOBS
export const getJobs = () => {
  return safeParse(localStorage.getItem("jobs"), []);
};

export const saveJobs = (jobs) => {
  localStorage.setItem("jobs", JSON.stringify(jobs));
};

// APPLICATIONS
export const getApplications = () => {
  return safeParse(localStorage.getItem("applications"), []);
};

export const saveApplications = (applications) => {
  localStorage.setItem("applications", JSON.stringify(applications));
};

// INTERVIEWS
export const getInterviews = () => {
  return safeParse(localStorage.getItem("interviews"), []);
};

export const saveInterviews = (interviews) => {
  localStorage.setItem("interviews", JSON.stringify(interviews));
};
