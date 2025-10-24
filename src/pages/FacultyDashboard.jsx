import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import ApprovalBadge from '../components/common/ApprovalBadge';
import facultyData from '../data/faculty.json';
import studentsData from '../data/students.json';
import approvalsData from '../data/approvals.json';
import '../styles/faculty.css';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [faculty, setFaculty] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find faculty data
    const facultyData = facultyData.find(f => f.email === user.email);
    setFaculty(facultyData);
    
    // Get approvals for this faculty
    const facultyApprovals = approvalsData.filter(approval => {
      // Check if faculty teaches any subject in this approval
      const hasSubject = approval.subjectApprovals.some(subApproval => 
        facultyData?.subjects?.some(subject => subject.subjectId === subApproval.subjectId)
      );
      
      // Check if faculty is mentor for any student
      const isMentor = facultyData?.mentees?.includes(approval.studentId);
      
      // Check if faculty is counsellor
      const isCounsellor = facultyData?.roles?.includes('ClassCounsellor');
      
      return hasSubject || isMentor || isCounsellor;
    });
    
    setApprovals(facultyApprovals);
    setLoading(false);
  }, [user.email]);

  const handleSubjectApproval = async (approvalId, subjectId, action) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update approval in state
    setApprovals(prev => prev.map(approval => {
      if (approval.id === approvalId) {
        return {
          ...approval,
          subjectApprovals: approval.subjectApprovals.map(subApproval => {
            if (subApproval.subjectId === subjectId) {
              return {
                ...subApproval,
                status: action,
                timestamp: new Date().toISOString()
              };
            }
            return subApproval;
          })
        };
      }
      return approval;
    }));
    
    setLoading(false);
  };

  const handleMentorApproval = async (approvalId, action) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update approval in state
    setApprovals(prev => prev.map(approval => {
      if (approval.id === approvalId) {
        return {
          ...approval,
          mentorApproval: {
            ...approval.mentorApproval,
            status: action,
            timestamp: new Date().toISOString()
          }
        };
      }
      return approval;
    }));
    
    setLoading(false);
  };

  const handleCounsellorApproval = async (approvalId, action) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update approval in state
    setApprovals(prev => prev.map(approval => {
      if (approval.id === approvalId) {
        return {
          ...approval,
          counsellorApproval: {
            ...approval.counsellorApproval,
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

  const canApproveMentor = (approval) => {
    return (
      approval.subjectApprovals.every(sub => sub.status === 'approved') &&
      approval.miniProjectApproval.status === 'approved' &&
      approval.mentorApproval.status === 'pending'
    );
  };

  const canApproveCounsellor = (approval) => {
    return (
      approval.mentorApproval.status === 'approved' &&
      approval.counsellorApproval.status === 'pending'
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

  if (!faculty) {
    return (
      <div className="faculty-dashboard">
        <div className="faculty-content">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Faculty not found</h2>
            <p>Please contact the administrator.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="faculty-dashboard">
      <div className="faculty-content">
        {/* Profile Section */}
        <div className="faculty-profile">
          <div className="profile-header">
            <div className="profile-avatar">
              {getInitials(faculty.name)}
            </div>
            <div className="profile-info">
              <h2>{faculty.name}</h2>
              <p>{faculty.email}</p>
              <div className="roles-badges">
                {faculty.roles.map((role) => (
                  <span key={role} className="role-badge">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Subject Approvals Section */}
        {faculty.roles.includes('SubjectTeacher') && faculty.subjects.length > 0 && (
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
              <div className="subject-students">
                {approvals
                  .filter(approval => {
                    const subjectApproval = approval.subjectApprovals.find(
                      sub => sub.subjectId === faculty.subjects[activeTab].subjectId
                    );
                    return subjectApproval && subjectApproval.status === 'pending';
                  })
                  .map((approval) => {
                    const student = studentsData.find(s => s.id === approval.studentId);
                    const subjectApproval = approval.subjectApprovals.find(
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
                          <ApprovalBadge 
                            status={subjectApproval.status}
                            timestamp={subjectApproval.timestamp}
                          />
                        </div>
                        
                        <div className="lms-verification">
                          <div className="lms-checkbox">
                            <input
                              type="checkbox"
                              id={`lms-${approval.id}-${subjectApproval.subjectId}`}
                              checked={subjectApproval.lmsActivity}
                              onChange={(e) => {
                                // Update LMS activity status
                                setApprovals(prev => prev.map(a => {
                                  if (a.id === approval.id) {
                                    return {
                                      ...a,
                                      subjectApprovals: a.subjectApprovals.map(sub => {
                                        if (sub.subjectId === subjectApproval.subjectId) {
                                          return { ...sub, lmsActivity: e.target.checked };
                                        }
                                        return sub;
                                      })
                                    };
                                  }
                                  return a;
                                }));
                              }}
                            />
                            <label htmlFor={`lms-${approval.id}-${subjectApproval.subjectId}`}>
                              LMS Activity Verified
                            </label>
                          </div>
                          <div className="lms-activity-note">
                            Please verify that the student has completed all required LMS activities for this subject.
                          </div>
                        </div>
                        
                        <div className="approval-actions">
                          <button
                            className="reject-button"
                            onClick={() => handleSubjectApproval(approval.id, subjectApproval.subjectId, 'rejected')}
                            disabled={loading}
                          >
                            Reject
                          </button>
                          <button
                            className="approve-button"
                            onClick={() => handleSubjectApproval(approval.id, subjectApproval.subjectId, 'approved')}
                            disabled={loading || !subjectApproval.lmsActivity}
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
        )}

        {/* Mentor Approvals Section */}
        {faculty.roles.includes('Mentor') && (
          <div className="mentor-section">
            <div className="mentor-header">
              <div className="mentor-icon">👨‍🏫</div>
              <div>
                <h3 className="mentor-title">Mentor Approvals</h3>
                <p className="mentor-subtitle">Approve students after subject and mini-project approvals</p>
              </div>
            </div>
            
            <div className="mentor-students">
              {approvals
                .filter(approval => canApproveMentor(approval))
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
                          Mentor Approval Required
                        </div>
                      </div>
                      
                      <div className="mentor-requirements">
                        <h4 className="requirements-title">Prerequisites</h4>
                        <ul className="requirements-list">
                          <li className="completed">All Subject Approvals</li>
                          <li className="completed">Mini Project Approval</li>
                          <li className="pending">Mentor Approval</li>
                        </ul>
                      </div>
                      
                      <div className="approval-actions">
                        <button
                          className="reject-button"
                          onClick={() => handleMentorApproval(approval.id, 'rejected')}
                          disabled={loading}
                        >
                          Reject
                        </button>
                        <button
                          className="approve-button"
                          onClick={() => handleMentorApproval(approval.id, 'approved')}
                          disabled={loading}
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Counsellor Approvals Section */}
        {faculty.roles.includes('ClassCounsellor') && (
          <div className="counsellor-section">
            <div className="counsellor-header">
              <div className="counsellor-icon">🎓</div>
              <div>
                <h3 className="counsellor-title">Counsellor Approvals</h3>
                <p className="counsellor-subtitle">Final approval before HOD</p>
              </div>
            </div>
            
            <div className="counsellor-students">
              {approvals
                .filter(approval => canApproveCounsellor(approval))
                .map((approval) => {
                  const student = studentsData.find(s => s.id === approval.studentId);
                  
                  return (
                    <div key={approval.id} className="counsellor-student-card">
                      <div className="counsellor-student-header">
                        <div className="counsellor-student-info">
                          <h4>{student.name}</h4>
                          <div className="counsellor-student-details">
                            <span>{student.rollNo}</span>
                            <span>{student.USN}</span>
                          </div>
                        </div>
                        <div className="approval-status pending">
                          Counsellor Approval Required
                        </div>
                      </div>
                      
                      <div className="counsellor-requirements">
                        <h4 className="requirements-title">Prerequisites</h4>
                        <ul className="requirements-list">
                          <li className="completed">All Subject Approvals</li>
                          <li className="completed">Mini Project Approval</li>
                          <li className="completed">Mentor Approval</li>
                          <li className="pending">Counsellor Approval</li>
                        </ul>
                      </div>
                      
                      <div className="approval-actions">
                        <button
                          className="reject-button"
                          onClick={() => handleCounsellorApproval(approval.id, 'rejected')}
                          disabled={loading}
                        >
                          Reject
                        </button>
                        <button
                          className="approve-button"
                          onClick={() => handleCounsellorApproval(approval.id, 'approved')}
                          disabled={loading}
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
