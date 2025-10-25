import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ApprovalBadge from '../components/common/ApprovalBadge';
import facultyData from '../data/faculty.json';
import studentsData from '../data/students.json';
import approvalsData from '../data/approvals.json';
import subjectsData from '../data/subjects.json';
import '../styles/faculty.css';

const FacultyMentorApprovals = () => {
  const { user } = useAuth();
  const [faculty, setFaculty] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchRollNo, setSearchRollNo] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showSubjectRemapping, setShowSubjectRemapping] = useState(false);

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

  const handleSearchStudent = () => {
    if (searchRollNo.trim()) {
      const foundStudent = studentsData.find(student => 
        student.rollNo.toLowerCase().includes(searchRollNo.toLowerCase())
      );
      setSearchResults(foundStudent ? [foundStudent] : []);
    } else {
      setSearchResults([]);
    }
  };

  const handleStudentSubjectUpdate = (studentId, subjectId, action) => {
    if (action === 'add' && subjectId) {
      // Add subject to student
      const student = studentsData.find(s => s.id === studentId);
      if (student && !student.subjects?.some(sub => sub.subjectId === subjectId)) {
        const subject = subjectsData.find(s => s.subjectId === subjectId);
        if (subject) {
          const updatedStudent = {
            ...student,
            subjects: [...(student.subjects || []), {
              subjectId: subject.subjectId,
              subjectName: subject.subjectName
            }]
          };
          // In a real app, this would update the database
          console.log('Added subject to student:', updatedStudent);
        }
      }
    } else if (action === 'remove') {
      // Remove subject from student
      const student = studentsData.find(s => s.id === studentId);
      if (student) {
        const updatedStudent = {
          ...student,
          subjects: student.subjects?.filter(sub => sub.subjectId !== subjectId) || []
        };
        // In a real app, this would update the database
        console.log('Removed subject from student:', updatedStudent);
      }
    }
  };

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

        {/* Student Search Section */}
        <div className="search-section">
          <h3>Search Student by Roll Number to Change Subjects</h3>
          <div className="search-controls">
            <input
              type="text"
              placeholder="Enter Student Roll Number..."
              value={searchRollNo}
              onChange={(e) => setSearchRollNo(e.target.value)}
              className="search-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSearchStudent()}
            />
            <button 
              className="search-btn"
              onClick={handleSearchStudent}
            >
              Search
            </button>
          </div>
          
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(student => (
                <div key={student.id} className="search-result-card">
                  <div className="student-info">
                    <h4>{student.name}</h4>
                    <p>Roll No: {student.rollNo} | USN: {student.USN}</p>
                    <p>Department: {student.deptId} | Division: {student.divId}</p>
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowSubjectRemapping(true);
                    }}
                  >
                    Change Subjects
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {searchResults.length === 0 && searchRollNo && (
            <div className="no-results">
              <p>No student found with roll number: {searchRollNo}</p>
            </div>
          )}
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

        {/* Subject Remapping Modal */}
        {showSubjectRemapping && selectedStudent && (
          <div className="modal-overlay" onClick={() => setShowSubjectRemapping(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Subject Management - {selectedStudent.name}</h3>
                <button className="modal-close" onClick={() => setShowSubjectRemapping(false)}>
                  ×
                </button>
              </div>
              
              <div className="modal-body">
                <div className="student-details">
                  <p><strong>Roll No:</strong> {selectedStudent.rollNo}</p>
                  <p><strong>USN:</strong> {selectedStudent.USN}</p>
                </div>
                
                <div className="subject-management">
                  <h4>Current Subjects:</h4>
                  <div className="current-subjects">
                    {selectedStudent.subjects?.map(subject => (
                      <div key={subject.subjectId} className="subject-badge">
                        {subject.subjectName}
                        <button 
                          className="remove-btn"
                          onClick={() => handleStudentSubjectUpdate(selectedStudent.id, subject.subjectId, 'remove')}
                        >
                          ×
                        </button>
                      </div>
                    )) || <p>No subjects assigned</p>}
                  </div>
                  
                  <h4>Add New Subject:</h4>
                  <div className="add-subject">
                    <select 
                      onChange={(e) => handleStudentSubjectUpdate(selectedStudent.id, e.target.value, 'add')}
                      className="subject-select"
                    >
                      <option value="">Select Subject</option>
                      {subjectsData.map(subject => (
                        <option key={subject.subjectId} value={subject.subjectId}>
                          {subject.subjectName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowSubjectRemapping(false)}
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

export default FacultyMentorApprovals;
