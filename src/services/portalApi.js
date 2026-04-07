const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

const toApiStatus = (status) => {
  if (!status) return '';
  return status.trim().toUpperCase().replace(/\s+/g, '_');
};

const toDisplayStatus = (status) => {
  if (!status) return 'Submitted';
  const normalized = status.toString().trim().toUpperCase();
  switch (normalized) {
    case 'SUBMITTED':
      return 'Submitted';
    case 'IN_REVIEW':
      return 'In Review';
    case 'INTERVIEW_SCHEDULED':
      return 'Interview Scheduled';
    case 'SELECTED':
      return 'Selected';
    case 'REJECTED':
      return 'Rejected';
    default:
      return status;
  }
};

const parseError = async (response) => {
  try {
    const data = await response.json();
    if (data?.message) {
      return data.message;
    }
    if (typeof data === 'object' && data !== null) {
      const first = Object.values(data)[0];
      if (first) {
        return String(first);
      }
    }
  } catch (error) {
    // ignore parse errors
  }
  return `Request failed with status ${response.status}`;
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: jsonHeaders,
    ...options,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  if (response.status === 204) {
    return null;
  }
  return response.json();
};

const normalizeApplication = (app) => ({
  ...app,
  status: toDisplayStatus(app.status),
});

export const isBackendUnavailable = (error) => {
  const message = error?.message?.toLowerCase() || '';
  return message.includes('failed to fetch') || message.includes('network');
};

export const fetchJobs = () => request('/api/jobs');
export const fetchJobById = (id) => request(`/api/jobs/${id}`);
export const fetchEmployerJobs = (email) =>
  request(`/api/jobs/employer?email=${encodeURIComponent(email)}`);
export const createJob = (payload) =>
  request('/api/jobs', { method: 'POST', body: JSON.stringify(payload) });
export const deleteJob = (jobId) =>
  request(`/api/jobs/${jobId}`, { method: 'DELETE' });

export const applyToJob = async (payload) => {
  const result = await request('/api/applications', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return normalizeApplication(result);
};

export const fetchStudentApplications = async (email) => {
  const data = await request(`/api/applications/student?email=${encodeURIComponent(email)}`);
  return data.map(normalizeApplication);
};

export const fetchJobApplications = async (jobId) => {
  const data = await request(`/api/applications/job/${jobId}`);
  return data.map(normalizeApplication);
};

export const fetchEmployerApplications = async (email) => {
  const data = await request(`/api/applications/employer?email=${encodeURIComponent(email)}`);
  return data.map(normalizeApplication);
};

export const fetchApplicationById = async (id) => {
  const data = await request(`/api/applications/${id}`);
  return normalizeApplication(data);
};

export const updateApplicationStatus = async (id, status) => {
  const data = await request(`/api/applications/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: toApiStatus(status) }),
  });
  return normalizeApplication(data);
};

export const createInterview = (payload) =>
  request('/api/interviews', { method: 'POST', body: JSON.stringify(payload) });

export const fetchStudentInterviews = (email) =>
  request(`/api/interviews/student?email=${encodeURIComponent(email)}`);
export const fetchApplicationInterviews = (applicationId) =>
  request(`/api/interviews/application/${applicationId}`);

export const fetchUsers = () => request('/api/users');
export const fetchUserById = (id) => request(`/api/users/${id}`);
export const fetchUserByEmail = (email) =>
  request(`/api/users/by-email?email=${encodeURIComponent(email)}`);
export const fetchStudents = () => request('/api/users/students');
export const deleteUserById = (id) => request(`/api/users/${id}`, { method: 'DELETE' });
export const updateStudentProfile = (id, payload) =>
  request(`/api/users/${id}/profile`, { method: 'PATCH', body: JSON.stringify(payload) });

export const fetchAdminSummary = () => request('/api/dashboard/admin');
export const fetchEmployerSummary = (email) =>
  request(`/api/dashboard/employer?email=${encodeURIComponent(email)}`);
export const fetchStudentSummary = (email) =>
  request(`/api/dashboard/student?email=${encodeURIComponent(email)}`);
export const fetchReports = () => request('/api/dashboard/reports');
export const fetchAnomalies = () => request('/api/dashboard/anomalies');

export const fetchOfficerSummary = () => request('/api/officer/summary');
export const fetchOfficerStudentStatus = () => request('/api/officer/student-status');
export const updateStudentPlacement = (id, payload) =>
  request(`/api/officer/students/${id}/placement`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
