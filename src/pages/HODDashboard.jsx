import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import studentsData from '../data/students.json';
import approvalsData from '../data/approvals.json';
import '../styles/faculty.css';

const HODDashboard = () => {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get all approvals that need HOD approval
    const hodApprovals = approvalsData.filter(approval => 
      approval.counsellorApproval.status === 'approved' &&
      approval.hodApproval.status === 'pending'
    );
    
    setApprovals(hodApprovals);
    setLoading(false);
  }, []);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const canApproveHOD = (approval) => {
    return (
      approval.subjectApprovals.every(sub => sub.status === 'approved') &&
      approval.miniProjectApproval.status === 'approved' &&
      approval.mentorApproval.status === 'approved' &&
      approval.counsellorApproval.status === 'approved' &&
      approval.hodApproval.status === 'pending'
    );
  };

  if (loading) {
    return (
      <div className="faculty-dashboard">
        <div className="faculty-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="faculty-dashboard">
      <div className="faculty-content">
        {/* HOD Profile Section */}
        <div className="section">
          <div className="faculty-profile">
            <div className="profile-header">
              <div className="profile-avatar">
                {getInitials(user.name)}
              </div>
              <div className="profile-info">
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <div className="roles-badges">
                  <span className="role-badge">HOD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Overview */}
        <div className="section">
          <h2>Dashboard Overview</h2>
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Pending Approvals</h3>
              <div className="stat-number">{approvals.length}</div>
              <p>Students waiting for HOD approval</p>
            </div>
            <div className="stat-card">
              <h3>Ready for Review</h3>
              <div className="stat-number">{approvals.filter(a => canApproveHOD(a)).length}</div>
              <p>Students ready for final approval</p>
            </div>
            <div className="stat-card">
              <h3>Total Students</h3>
              <div className="stat-number">{studentsData.length}</div>
              <p>Total students in the system</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {approvals.slice(0, 5).map((approval) => {
              const student = studentsData.find(s => s.id === approval.studentId);
              if (!student) return null;
              
              return (
                <div key={approval.id} className="activity-item">
                  <div className="activity-info">
                    <h4>{student.name}</h4>
                    <p>{student.rollNo} - {student.USN}</p>
                  </div>
                  <div className="activity-status">
                    <span className="status-badge pending">Pending HOD Approval</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HODDashboard;
