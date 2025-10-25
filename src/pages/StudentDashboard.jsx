import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import ApprovalBadge from '../components/common/ApprovalBadge';
import studentsData from '../data/students.json';
import approvalsData from '../data/approvals.json';
import '../styles/student.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [approval, setApproval] = useState(null);
  const [slipGenerated, setSlipGenerated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    // Find student data
    const studentData = studentsData.find(s => s.email === user.email);
    setStudent(studentData);
    
    // Find approval data
    const approvalData = approvalsData.find(a => a.studentId === studentData?.id);
    setApproval(approvalData);
    
    setLoading(false);
  }, [user.email]);

  const canGenerateSlip = () => {
    if (!approval) return false;
    
    return (
      approval.subjectApprovals.every(sub => sub.status === 'approved') &&
      approval.miniProjectApproval.status === 'approved' &&
      approval.mentorApproval.status === 'approved' &&
      approval.counsellorApproval.status === 'approved' &&
      approval.hodApproval.status === 'approved'
    );
  };

  const handleGenerateSlip = async () => {
    if (!canGenerateSlip()) return;
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSlipGenerated(true);
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

  if (loading) {
    return (
      <div className="student-dashboard">
        <div className="student-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="student-dashboard">
        <div className="student-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Student not found</h2>
            <p>Please contact the administrator.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-dashboard">
      {/* Sidebar Navigation */}
      <div className="student-sidebar">
        <div className="sidebar-header">
          <h2>Student Dashboard</h2>
        </div>
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={`nav-item ${activeSection === 'subjects' ? 'active' : ''}`}
            onClick={() => setActiveSection('subjects')}
          >
            📚 My Subjects
          </button>
          <button 
            className={`nav-item ${activeSection === 'slip' ? 'active' : ''}`}
            onClick={() => setActiveSection('slip')}
          >
            📄 Slip Generation
          </button>
          <button 
            className={`nav-item ${activeSection === 'status' ? 'active' : ''}`}
            onClick={() => setActiveSection('status')}
          >
            ✅ Approval Status
          </button>
        </nav>
      </div>

      <div className="student-content">
        {/* Header */}
        <div className="student-header">
          {/* <h1>Student Dashboard</h1> */}
          {/* <div className="student-user-info">
            <span>Welcome, {user.name}</span>
            <button className="logout-btn">Logout</button>
          </div> */}
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="section">
            {/* Profile Section */}
            <div className="student-profile">
              <div className="profile-header">
                <div className="profile-avatar">
                  {getInitials(student.name)}
                </div>
                <div className="profile-info">
                  <h2>{student.name}</h2>
                  <p>{student.email}</p>
                </div>
              </div>
          
              <div className="profile-details">
                <div className="detail-group">
                  <span className="detail-label">Roll Number</span>
                  <span className="detail-value">{student.rollNo}</span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">USN</span>
                  <span className="detail-value">{student.USN}</span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Contact</span>
                  <span className="detail-value">{student.contact}</span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Department</span>
                  <span className="detail-value">{student.deptId}</span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Year</span>
                  <span className="detail-value">{student.year}</span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Semester</span>
                  <span className="detail-value">{student.sem}</span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Division</span>
                  <span className="detail-value">{student.divId}</span>
                </div>
                <div className="detail-group">
                  <span className="detail-label">Batch</span>
                  <span className="detail-value">{student.batchId}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subjects Section */}
        {activeSection === 'subjects' && (
          <div className="section">
            {/* Subjects Section */}
            <div className="subjects-section">
              <h3>Enrolled Subjects</h3>
              <div className="subjects-grid">
                {student.subjects.map((subject) => (
                  <div key={subject.subjectId} className="subject-card">
                    <h4 className="subject-name">{subject.subjectName}</h4>
                    <p className="subject-code">{subject.subjectId}</p>
                    <p className="subject-credits">{subject.credits} Credits</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Project Section */}
            <div className="mini-project-section">
              <h3>Mini Project</h3>
              <div className="mini-project-card">
                <h4 className="project-title">{student.miniProject.title}</h4>
                <p className="project-supervisor">Supervisor: {student.miniProject.supervisor}</p>
              </div>
            </div>
          </div>
        )}

        {/* Slip Generation Section */}
        {activeSection === 'slip' && (
          <div className="section">

            {/* Slip Generation Section */}
            <div className="slip-generation">
              <h3>Slip Generation</h3>
          
          <div className="slip-status">
            <div className={`slip-status-icon ${canGenerateSlip() ? 'ready' : 'pending'}`}>
              {canGenerateSlip() ? '✓' : '○'}
            </div>
            <div className="slip-status-text">
              <h3>
                {canGenerateSlip() ? 'Ready to Generate Slip' : 'Pending Approvals'}
              </h3>
              <p>
                {canGenerateSlip() 
                  ? 'All approvals completed. You can now generate your slip.'
                  : 'Please wait for all required approvals to be completed.'
                }
              </p>
            </div>
          </div>

          {approval && (
            <div className="slip-requirements">
              <h4 className="requirements-title">Approval Status</h4>
              <ul className="requirements-list">
                {approval.subjectApprovals.map((subApproval) => (
                  <li 
                    key={subApproval.subjectId}
                    className={subApproval.status === 'approved' ? 'completed' : 'pending'}
                  >
                    {subApproval.subjectName} - {subApproval.status}
                  </li>
                ))}
                <li className={approval.miniProjectApproval.status === 'approved' ? 'completed' : 'pending'}>
                  Mini Project - {approval.miniProjectApproval.status}
                </li>
                <li className={approval.mentorApproval.status === 'approved' ? 'completed' : 'pending'}>
                  Mentor Approval - {approval.mentorApproval.status}
                </li>
                <li className={approval.counsellorApproval.status === 'approved' ? 'completed' : 'pending'}>
                  Counsellor Approval - {approval.counsellorApproval.status}
                </li>
                <li className={approval.hodApproval.status === 'approved' ? 'completed' : 'pending'}>
                  HOD Approval - {approval.hodApproval.status}
                </li>
              </ul>
            </div>
          )}

          <button
            className="generate-slip-button"
            onClick={handleGenerateSlip}
            disabled={!canGenerateSlip() || slipGenerated}
          >
            {slipGenerated ? 'Slip Generated ✓' : 'Generate Slip'}
          </button>

              {slipGenerated && (
                <div className="slip-preview">
                  <div className="slip-header">
                    <h2 className="slip-title">IDCS - College Slip</h2>
                    <p className="slip-subtitle">Digital Approval System</p>
                  </div>
                  
                  <div className="slip-content">
                    <div className="slip-section">
                      <h4>Student Information</h4>
                      <div className="slip-field">
                        <span className="slip-field-label">Name:</span>
                        <span className="slip-field-value">{student.name}</span>
                      </div>
                      <div className="slip-field">
                        <span className="slip-field-label">Roll No:</span>
                        <span className="slip-field-value">{student.rollNo}</span>
                      </div>
                      <div className="slip-field">
                        <span className="slip-field-label">USN:</span>
                        <span className="slip-field-value">{student.USN}</span>
                      </div>
                      <div className="slip-field">
                        <span className="slip-field-label">Department:</span>
                        <span className="slip-field-value">{student.deptId}</span>
                      </div>
                      <div className="slip-field">
                        <span className="slip-field-label">Year:</span>
                        <span className="slip-field-value">{student.year}</span>
                      </div>
                      <div className="slip-field">
                        <span className="slip-field-label">Semester:</span>
                        <span className="slip-field-value">{student.sem}</span>
                      </div>
                    </div>
                    
                    <div className="slip-section">
                      <h4>Academic Details</h4>
                      <div className="slip-field">
                        <span className="slip-field-label">Division:</span>
                        <span className="slip-field-value">{student.divId}</span>
                      </div>
                      <div className="slip-field">
                        <span className="slip-field-label">Batch:</span>
                        <span className="slip-field-value">{student.batchId}</span>
                      </div>
                      <div className="slip-field">
                        <span className="slip-field-label">Generated:</span>
                        <span className="slip-field-value">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="slip-approvals">
                    <h4>Approval Chain</h4>
                    <div className="approvals-grid">
                      {approval.subjectApprovals.map((subApproval) => (
                        <div key={subApproval.subjectId} className="approval-item">
                          <div className="approval-role">{subApproval.subjectName}</div>
                          <div className="approval-signature">
                            {subApproval.status === 'approved' ? '✓ Approved' : '○ Pending'}
                          </div>
                          <div className="approval-timestamp">
                            {subApproval.timestamp ? new Date(subApproval.timestamp).toLocaleDateString() : 'N/A'}
                          </div>
                        </div>
                      ))}
                      <div className="approval-item">
                        <div className="approval-role">Mini Project</div>
                        <div className="approval-signature">
                          {approval.miniProjectApproval.status === 'approved' ? '✓ Approved' : '○ Pending'}
                        </div>
                        <div className="approval-timestamp">
                          {approval.miniProjectApproval.timestamp ? new Date(approval.miniProjectApproval.timestamp).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      <div className="approval-item">
                        <div className="approval-role">Mentor</div>
                        <div className="approval-signature">
                          {approval.mentorApproval.status === 'approved' ? '✓ Approved' : '○ Pending'}
                        </div>
                        <div className="approval-timestamp">
                          {approval.mentorApproval.timestamp ? new Date(approval.mentorApproval.timestamp).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      <div className="approval-item">
                        <div className="approval-role">Counsellor</div>
                        <div className="approval-signature">
                          {approval.counsellorApproval.status === 'approved' ? '✓ Approved' : '○ Pending'}
                        </div>
                        <div className="approval-timestamp">
                          {approval.counsellorApproval.timestamp ? new Date(approval.counsellorApproval.timestamp).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      <div className="approval-item">
                        <div className="approval-role">HOD</div>
                        <div className="approval-signature">
                          {approval.hodApproval.status === 'approved' ? '✓ Approved' : '○ Pending'}
                        </div>
                        <div className="approval-timestamp">
                          {approval.hodApproval.timestamp ? new Date(approval.hodApproval.timestamp).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Section */}
        {activeSection === 'status' && (
          <div className="section">
            <h2>Approval Status</h2>
            {approval && (
              <div className="approval-status-section">
                <h3>Current Status</h3>
                <div className="status-grid">
                  {approval.subjectApprovals.map((subApproval) => (
                    <div key={subApproval.subjectId} className="status-item">
                      <h4>{subApproval.subjectName}</h4>
                      <ApprovalBadge 
                        status={subApproval.status}
                        timestamp={subApproval.timestamp}
                      />
                    </div>
                  ))}
                  <div className="status-item">
                    <h4>Mini Project</h4>
                    <ApprovalBadge 
                      status={approval.miniProjectApproval.status}
                      timestamp={approval.miniProjectApproval.timestamp}
                    />
                  </div>
                  <div className="status-item">
                    <h4>Mentor Approval</h4>
                    <ApprovalBadge 
                      status={approval.mentorApproval.status}
                      timestamp={approval.mentorApproval.timestamp}
                    />
                  </div>
                  <div className="status-item">
                    <h4>Counsellor Approval</h4>
                    <ApprovalBadge 
                      status={approval.counsellorApproval.status}
                      timestamp={approval.counsellorApproval.timestamp}
                    />
                  </div>
                  <div className="status-item">
                    <h4>HOD Approval</h4>
                    <ApprovalBadge 
                      status={approval.hodApproval.status}
                      timestamp={approval.hodApproval.timestamp}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
