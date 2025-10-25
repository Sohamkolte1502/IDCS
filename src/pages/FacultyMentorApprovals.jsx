import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ApprovalBadge from '../components/common/ApprovalBadge';
import facultyData from '../data/faculty.json';
import studentsData from '../data/students.json';
import approvalsData from '../data/approvals.json';
import '../styles/faculty.css';

const FacultyMentorApprovals = () => {
  const { user } = useAuth();
  const [faculty, setFaculty] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find faculty data
    const currentFaculty = facultyData.find(f => f.email === user.email);
    setFaculty(currentFaculty);

    if (currentFaculty) {
      // Get approvals for this faculty's mentees
      const facultyApprovals = approvalsData.filter(approval => {
        const isMentor = currentFaculty?.mentees?.includes(approval.studentId);
        return isMentor;
      });
      setApprovals(facultyApprovals);
    }

    setLoading(false);
  }, [user.email]);

  const handleMentorApproval = async (approvalId, action) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setApprovals(prev =>
      prev.map(approval =>
        approval.id === approvalId
          ? { ...approval, mentorApproval: { ...approval.mentorApproval, status: action, timestamp: new Date().toISOString() } }
          : approval
      )
    );

    setLoading(false);
  };

  const getInitials = (name) =>
    name
      .split(' ')
      .map(w => w.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const canApproveMentor = (approval) =>
    approval.subjectApprovals.every(sub => sub.status === 'approved') &&
    approval.miniProjectApproval.status === 'approved' &&
    approval.mentorApproval.status === 'pending';

  if (loading) {
    return (
      <div className="faculty-dashboard">
        <div className="faculty-content" style={{ textAlign: 'center', padding: '2rem' }}>
          <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="faculty-dashboard">
        <div className="faculty-content" style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Faculty not found</h2>
          <p>Please contact the administrator.</p>
        </div>
      </div>
    );
  }

  if (!faculty.mentees || faculty.mentees.length === 0) {
    return (
      <div className="faculty-dashboard">
        <div className="faculty-content">
          <div className="faculty-header">
            <h1>Mentor Approvals</h1>
          </div>
          <div className="section">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2>No Mentees Assigned</h2>
              <p>You are not assigned as a mentor to any students.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="faculty-dashboard">
      <div className="faculty-content">
        {/* Header */}
        <div className="faculty-header">
          <h1>Mentor Approvals</h1>
        </div>

        {/* Mentor Approvals Section */}
        <div className="section">
          <div className="mentor-approvals">
            <h3>Mentee Approvals</h3>
            <p className="approval-description">
              Review and approve your mentees' applications. Ensure all subject approvals and mini project approvals are completed before mentor approval.
            </p>
            
            {approvals
              .filter(approval => approval.mentorApproval.status === 'pending')
              .map(approval => {
                const student = studentsData.find(s => s.id === approval.studentId);
                return (
                  <div key={approval.id} className="student-approval-card">
                    <div className="student-header">
                      <div className="student-info">
                        <h4>{student.name}</h4>
                        <div className="student-details">
                          <span className="student-roll">{student.rollNo}</span>
                          <span>{student.USN}</span>
                          <span>{student.deptId}</span>
                        </div>
                      </div>
                      <ApprovalBadge status={approval.mentorApproval.status} timestamp={approval.mentorApproval.timestamp} />
                    </div>
                    
                    {/* Prerequisites Check */}
                    <div className="prerequisites-check">
                      <h5>Prerequisites Status:</h5>
                      <div className="prerequisites-list">
                        <div className={`prerequisite-item ${approval.subjectApprovals.every(sub => sub.status === 'approved') ? 'completed' : 'pending'}`}>
                          <span>Subject Approvals: </span>
                          <span>{approval.subjectApprovals.every(sub => sub.status === 'approved') ? '✓ Completed' : '○ Pending'}</span>
                        </div>
                        <div className={`prerequisite-item ${approval.miniProjectApproval.status === 'approved' ? 'completed' : 'pending'}`}>
                          <span>Mini Project Approval: </span>
                          <span>{approval.miniProjectApproval.status === 'approved' ? '✓ Completed' : '○ Pending'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="approval-actions">
                      <button
                        className="reject-button"
                        onClick={() => handleMentorApproval(approval.id, 'rejected')}
                        disabled={!canApproveMentor(approval)}
                      >
                        Reject
                      </button>
                      <button
                        className="approve-button"
                        onClick={() => handleMentorApproval(approval.id, 'approved')}
                        disabled={!canApproveMentor(approval)}
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                );
              })}
            
            {approvals.filter(approval => approval.mentorApproval.status === 'pending').length === 0 && (
              <div className="no-pending-approvals">
                <h3>No Pending Mentor Approvals</h3>
                <p>All mentee approvals have been processed.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyMentorApprovals;
