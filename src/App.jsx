import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import StudentSlip from './pages/StudentSlip';
import FacultyDashboard from './pages/FacultyDashboard';
import FacultySubjectApprovals from './pages/FacultySubjectApprovals';
import FacultyMentorApprovals from './pages/FacultyMentorApprovals';
import FacultyCounsellorApprovals from './pages/FacultyCounsellorApprovals';
import HODDashboard from './pages/HODDashboard';
import HODApprovals from './pages/HODApprovals';
import HODHistory from './pages/HODHistory';
import AdminDashboard from './pages/AdminDashboard';
import OfficeInterface from './pages/OfficeInterface';
import OfficeSearch from './pages/OfficeSearch';
import OfficeTickets from './pages/OfficeTickets';
import './styles/global.css';
import './styles/components.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

// Layout Component
const Layout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return children;
  }
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
};

// Unauthorized Component
const Unauthorized = () => (
  <div style={{ 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <h1>403 - Unauthorized</h1>
    <p>You don't have permission to access this page.</p>
    <button onClick={() => window.history.back()}>
      Go Back
    </button>
  </div>
);

// App Routes Component
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Student Routes */}
      <Route path="/student/*" element={
        <ProtectedRoute allowedRoles={['student']}>
          <Layout>
            <Routes>
              <Route path="/" element={<StudentDashboard />} />
              <Route path="/profile" element={<StudentProfile />} />
              <Route path="/slip" element={<StudentSlip />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Faculty Routes */}
      <Route path="/faculty/*" element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <Layout>
            <Routes>
              <Route path="/" element={<FacultyDashboard />} />
              <Route path="/approvals" element={<FacultySubjectApprovals />} />
              <Route path="/mentor" element={<FacultyMentorApprovals />} />
              <Route path="/counsellor" element={<FacultyCounsellorApprovals />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* HOD Routes */}
      <Route path="/hod/*" element={
        <ProtectedRoute allowedRoles={['hod']}>
          <Layout>
            <Routes>
              <Route path="/" element={<HODDashboard />} />
              <Route path="/approvals" element={<HODApprovals />} />
              <Route path="/history" element={<HODHistory />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout>
            <Routes>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/master-data" element={<AdminDashboard />} />
              <Route path="/faculty" element={<AdminDashboard />} />
              <Route path="/students" element={<AdminDashboard />} />
              <Route path="/sync" element={<AdminDashboard />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Office Routes */}
      <Route path="/office/*" element={
        <ProtectedRoute allowedRoles={['office']}>
          <Layout>
            <Routes>
              <Route path="/" element={<OfficeInterface />} />
              <Route path="/search" element={<OfficeSearch />} />
              <Route path="/tickets" element={<OfficeTickets />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;
