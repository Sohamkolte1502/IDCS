import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import ApprovalBadge from '../components/common/ApprovalBadge';
import studentsData from '../data/students.json';
import approvalsData from '../data/approvals.json';
import '../styles/faculty.css';

const HODDashboard = () => {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [showHistory, setShowHistory] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);

  useEffect(() => {
    // Get all approvals that need HOD approval
    const hodApprovals = approvalsData.filter(approval => 
      approval.counsellorApproval.status === 'approved' &&
      approval.hodApproval.status === 'pending'
    );
    
    setApprovals(hodApprovals);
    setLoading(false);
  }, []);

  const handleHODApproval = async (approvalId, action) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update approval in state
    setApprovals(prev => prev.map(approval => {
      if (approval.id === approvalId) {
        return {
          ...approval,
          hodApproval: {
            ...approval.hodApproval,
            status: action,
            timestamp: new Date().toISOString()
          }
        };
      }
      return approval;
    }));
    
    setLoading(false);
  };

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

  const getApprovalHistory = (approval) => {
    const history = [];
    
    // Subject approvals
    approval.subjectApprovals.forEach(subApproval => {
      if (subApproval.status === 'approved') {
        history.push({
          type: 'Subject Approval',
          subject: subApproval.subjectName,
          approver: subApproval.teacherName,
          status: 'approved',
          timestamp: subApproval.timestamp
        });
      }
    });
    
    // Mini project approval
    if (approval.miniProjectApproval.status === 'approved') {
      history.push({
        type: 'Mini Project',
        subject: 'Mini Project',
        approver: approval.miniProjectApproval.supervisorName,
        status: 'approved',
        timestamp: approval.miniProjectApproval.timestamp
      });
    }
    
    // Mentor approval
    if (approval.mentorApproval.status === 'approved') {
      history.push({
        type: 'Mentor Approval',
        subject: 'Mentor',
        approver: approval.mentorApproval.mentorName,
        status: 'approved',
        timestamp: approval.mentorApproval.timestamp
      });
    }
    
    // Counsellor approval
    if (approval.counsellorApproval.status === 'approved') {
      history.push({
        type: 'Counsellor Approval',
        subject: 'Counsellor',
        approver: approval.counsellorApproval.counsellorName,
        status: 'approved',
        timestamp: approval.counsellorApproval.timestamp
      });
    }
    
    return history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
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
      {/* Sidebar Navigation */}
      <div className="faculty-sidebar">
        <div className="sidebar-header">
          <h2>HOD Dashboard</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`nav-item ${activeSection === 'approvals' ? 'active' : ''}`}
            onClick={() => setActiveSection('approvals')}
          >
            ✅ Final Approvals
          </button>
          <button 
            className={`nav-item ${activeSection === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveSection('reports')}
          >
            📈 Reports
          </button>
        </nav>
      </div>

      <div className="faculty-content">
        {/* Header */}
        <div className="faculty-header">
          <h1>HOD Dashboard</h1>
          <div className="faculty-user-info">
            <span>Welcome, {user.name}</span>
            <button className="logout-btn">Logout</button>
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="section">
            {/* HOD Profile Section */}
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
        )}

        {/* Approvals Section */}
        {activeSection === 'approvals' && (
          <div className="section">

            {/* Final Approvals Section */}
            <div className="mentor-section">
              <div className="mentor-header">
                <div className="mentor-icon">🎓</div>
                <div>
                  <h3 className="mentor-title">Final HOD Approvals</h3>
                  <p className="mentor-subtitle">Final approval for student slips</p>
                </div>
              </div>
              
              <div className="mentor-students">
                {approvals
                  .filter(approval => canApproveHOD(approval))
                  .map((approval) => {
                    const student = studentsData.find(s => s.id === approval.studentId);
                    
                    return (
                      <div key={approval.id} className="mentor-student-card">
                        <div className="mentor-student-header">
                          <div className="mentor-student-info">
                            <h4>{student.name}</h4>
                            <div className="mentor-student-details">
                              <span>{student.rollNo}</span>
                              <span>{student.USN}</span>
                            </div>
                          </div>
                          <div className="approval-status pending">
                            HOD Approval Required
                          </div>
                        </div>
                        
                        <div className="mentor-requirements">
                          <h4 className="requirements-title">Approval Chain Status</h4>
                          <ul className="requirements-list">
                            <li className="completed">All Subject Approvals</li>
                            <li className="completed">Mini Project Approval</li>
                            <li className="completed">Mentor Approval</li>
                            <li className="completed">Counsellor Approval</li>
                            <li className="pending">HOD Final Approval</li>
                          </ul>
                        </div>
                        
                        <div className="approval-actions">
                          <button
                            className="reject-button"
                            onClick={() => handleHODApproval(approval.id, 'rejected')}
                            disabled={loading}
                          >
                            Reject
                          </button>
                          <button
                            className="approve-button"
                            onClick={() => handleHODApproval(approval.id, 'approved')}
                            disabled={loading}
                          >
                            Final Approve
                          </button>
                          <button
                            className="btn btn-outline"
                            onClick={() => {
                              setSelectedApproval(approval);
                              setShowHistory(true);
                            }}
                          >
                            View History
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* Reports Section */}
        {activeSection === 'reports' && (
          <div className="section">
            <h2>HOD Reports</h2>
            <div className="reports-grid">
              <div className="report-card">
                <h3>Approval Statistics</h3>
                <p>Total Pending: {approvals.length}</p>
                <p>Ready for Approval: {approvals.filter(a => canApproveHOD(a)).length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Approval History Modal */}
        {showHistory && selectedApproval && (
          <div className="modal-overlay" onClick={() => setShowHistory(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Approval History</h3>
                <button className="modal-close" onClick={() => setShowHistory(false)}>
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="approval-history">
                  <h4>Student: {selectedApproval.studentName}</h4>
                  <p>Roll No: {selectedApproval.rollNo} | USN: {selectedApproval.USN}</p>
                  
                  <div className="history-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Subject/Area</th>
                          <th>Approver</th>
                          <th>Status</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getApprovalHistory(selectedApproval).map((item, index) => (
                          <tr key={index}>
                            <td>{item.type}</td>
                            <td>{item.subject}</td>
                            <td>{item.approver}</td>
                            <td>
                              <ApprovalBadge 
                                status={item.status}
                                timestamp={item.timestamp}
                              />
                            </td>
                            <td>
                              {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowHistory(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HODDashboard;
