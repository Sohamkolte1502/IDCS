import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ApprovalBadge from '../components/common/ApprovalBadge';
import facultyData from '../data/faculty.json';
import studentsData from '../data/students.json';
import approvalsData from '../data/approvals.json';
import '../styles/faculty.css';

const FacultySubjectApprovals = () => {
  const { user } = useAuth();
  const [faculty, setFaculty] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find faculty data
    const currentFaculty = facultyData.find(f => f.email === user.email);
    setFaculty(currentFaculty);

    if (currentFaculty) {
      // Get approvals for this faculty's subjects
      const facultyApprovals = approvalsData.filter(approval => {
        const hasSubject = approval.subjectApprovals.some(subApproval =>
          currentFaculty.subjects?.some(subject => subject.subjectId === subApproval.subjectId)
        );
        return hasSubject;
      });
      setApprovals(facultyApprovals);
    }

    setLoading(false);
  }, [user.email]);

  const handleSubjectApproval = async (approvalId, subjectId, action) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setApprovals(prev =>
      prev.map(approval => {
        if (approval.id === approvalId) {
          return {
            ...approval,
            subjectApprovals: approval.subjectApprovals.map(subApproval =>
              subApproval.subjectId === subjectId
                ? { ...subApproval, status: action, timestamp: new Date().toISOString() }
                : subApproval
            ),
          };
        }
        return approval;
      })
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

  if (!faculty.roles.includes('SubjectTeacher') || !faculty.subjects || faculty.subjects.length === 0) {
    return (
      <div className="faculty-dashboard">
        <div className="faculty-content">
          <div className="faculty-header">
            <h1>Subject Approvals</h1>
          </div>
          <div className="section">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2>No Subject Assignments</h2>
              <p>You are not assigned to any subjects for approval.</p>
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
          <h1>Subject Approvals</h1>
        </div>

        {/* Subject Approvals Section */}
        <div className="section">
          <div className="subjects-tabs">
            <div className="tabs-header">
              {faculty.subjects.map((subject, index) => (
                <button
                  key={subject.subjectId}
                  className={`tab-button ${activeTab === index ? 'active' : ''}`}
                  onClick={() => setActiveTab(index)}
                >
                  {subject.subjectName}
                </button>
              ))}
            </div>
            <div className="tab-content">
              {/* Subject students */}
              {approvals
                .filter(approval =>
                  approval.subjectApprovals.find(
                    sub => sub.subjectId === faculty.subjects[activeTab].subjectId && sub.status === 'pending'
                  )
                )
                .map(approval => {
                  const student = studentsData.find(s => s.id === approval.studentId);
                  const subApproval = approval.subjectApprovals.find(
                    sub => sub.subjectId === faculty.subjects[activeTab].subjectId
                  );
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
                        <ApprovalBadge status={subApproval.status} timestamp={subApproval.timestamp} />
                      </div>
                      <div className="approval-actions">
                        <button
                          className="reject-button"
                          onClick={() => handleSubjectApproval(approval.id, subApproval.subjectId, 'rejected')}
                        >
                          Reject
                        </button>
                        <button
                          className="approve-button"
                          onClick={() => handleSubjectApproval(approval.id, subApproval.subjectId, 'approved')}
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultySubjectApprovals;
