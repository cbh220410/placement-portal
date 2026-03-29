import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PrivateRoute } from './router/PrivateRoute';
import LandingPage from './pages/public/LandingPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import SignupPage from './pages/public/SignupPage.jsx';
import StudentDashboard from './pages/Student/StudentDashboard.jsx';
import JobListingsPage from './pages/Student/JobListingsPage.jsx';
import StudentApplicationsPage from './pages/Student/ApplicationsPage.jsx';
import StudentProfilePage from './pages/Student/StudentProfilePage.jsx';
import EmployerDashboard from './pages/Employer/EmployerDashboard.jsx';
import PostJobPage from './pages/Employer/PostJobPage.jsx';
import ManageListingsPage from './pages/Employer/ManageListingsPage.jsx';
import JobDetailsPage from './pages/Employer/JobDetailsPage.jsx';
import StudentProfileViewer from './pages/Employer/StudentProfileViewer.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import ManageUsersPage from './pages/Admin/ManageUsersPage.jsx';
import ReportsPage from './pages/Admin/ReportsPage.jsx';
import AnomalyDashboard from './pages/Admin/AnomalyDashboard.jsx';
import CreatorsPage from './pages/CreatorsPage.jsx';
import InterviewSchedulerPage from './pages/Employer/InterviewSchedulerPage.jsx';
import JobAnalyticsPage from './pages/Employer/JobAnalyticsPage.jsx';
import OfficerDashboard from './pages/PlacementOfficer/OfficerDashboard';
import StudentStatusPage from './pages/PlacementOfficer/StudentStatusPage';
import UserActivityTimelinePage from './pages/Admin/UserActivityTimelinePage';

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/contact" element={<CreatorsPage />} />

            {/* Protected Student Routes */}
            <Route 
              path="/student" 
              element={<PrivateRoute requiredRole="student"><StudentDashboard /></PrivateRoute>} 
            />
            <Route 
              path="/student/jobs" 
              element={<PrivateRoute requiredRole="student"><JobListingsPage /></PrivateRoute>} 
            />
            <Route 
              path="/student/applications" 
              element={<PrivateRoute requiredRole="student"><StudentApplicationsPage /></PrivateRoute>} 
            />
            <Route 
              path="/student/profile" 
              element={<PrivateRoute requiredRole="student"><StudentProfilePage /></PrivateRoute>} 
            />

            {/* Protected Employer Routes */}
            <Route
              path="/employer"
              element={<PrivateRoute requiredRole="employer"><EmployerDashboard /></PrivateRoute>}
            />
            <Route
              path="/employer/post-job"
              element={<PrivateRoute requiredRole="employer"><PostJobPage /></PrivateRoute>}
            />
            <Route
              path="/employer/manage-listings"
              element={<PrivateRoute requiredRole="employer"><ManageListingsPage /></PrivateRoute>}
            />
            <Route
              path="/employer/manage-listings/:jobId"
              element={<PrivateRoute requiredRole="employer"><JobDetailsPage /></PrivateRoute>}
            />
            <Route
              path="/employer/view-profile/:studentId"
              element={<PrivateRoute requiredRole="employer"><StudentProfileViewer /></PrivateRoute>}
            />
            <Route
              path="/employer/schedule-interview/:studentId"
              element={<PrivateRoute requiredRole="employer"><InterviewSchedulerPage /></PrivateRoute>}
            />
            <Route
              path="/employer/analytics"
              element={<PrivateRoute requiredRole="employer"><JobAnalyticsPage /></PrivateRoute>}
            />

            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={<PrivateRoute requiredRole="admin"><AdminDashboard /></PrivateRoute>} 
            />
            <Route
              path="/admin/manage-users"
              element={<PrivateRoute requiredRole="admin"><ManageUsersPage /></PrivateRoute>}
            />
            <Route
              path="/admin/reports"
              element={<PrivateRoute requiredRole="admin"><ReportsPage /></PrivateRoute>}
            />
            <Route
              path="/admin/anomalies"
              element={<PrivateRoute requiredRole="admin"><AnomalyDashboard /></PrivateRoute>}
            />
            <Route
              path="/admin/user-timeline/:userId"
              element={<PrivateRoute requiredRole="admin"><UserActivityTimelinePage /></PrivateRoute>}
            />
            {/* Protected Officer Routes */}
          <Route 
            path="/officer" 
            element={<PrivateRoute requiredRole="officer"><OfficerDashboard /></PrivateRoute>} 
          />
          <Route
            path="/officer/student-status"
            element={<PrivateRoute requiredRole="officer"><StudentStatusPage /></PrivateRoute>}
          />

            {/* Catch-all for 404 pages */}
            <Route path="*" element={<h1>404: Page Not Found</h1>} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
