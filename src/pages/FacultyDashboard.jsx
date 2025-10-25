import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import ApprovalBadge from '../components/common/ApprovalBadge';
import facultyData from '../data/faculty.json';
import studentsData from '../data/students.json';
import approvalsData from '../data/approvals.json';
import subjectsData from '../data/subjects.json';
import '../styles/faculty.css';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [faculty, setFaculty] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeSection, setActiveSection] = useState('overview');
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
      // Get approvals for this faculty
      const facultyApprovals = approvalsData.filter(approval => {
        const hasSubject = approval.subjectApprovals.some(subApproval =>
          currentFaculty.subjects?.some(subject => subject.subjectId === subApproval.subjectId)
        );
        const isMentor = currentFaculty?.mentees?.includes(approval.studentId);
        const isCounsellor = currentFaculty?.roles?.includes('ClassCounsellor');
        return hasSubject || isMentor || isCounsellor;
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

  const handleCounsellorApproval = async (approvalId, action) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setApprovals(prev =>
      prev.map(approval =>
        approval.id === approvalId
          ? { ...approval, counsellorApproval: { ...approval.counsellorApproval, status: action, timestamp: new Date().toISOString() } }
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

  const canApproveCounsellor = (approval) =>
    approval.mentorApproval.status === 'approved' &&
    approval.counsellorApproval.status === 'pending';

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

  return (
    <div className="faculty-dashboard">
      {/* Sidebar Navigation */}
      <div className="faculty-sidebar">
        <div className="sidebar-header">
          <h2>Faculty Dashboard</h2>
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
            ✅ Approvals
          </button>
          <button 
            className={`nav-item ${activeSection === 'students' ? 'active' : ''}`}
            onClick={() => setActiveSection('students')}
          >
            👥 My Students
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
          <h1>Faculty Dashboard</h1>
          <div className="faculty-user-info">
            <span>Welcome, {user.name}</span>
            <button className="logout-btn">Logout</button>
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="section">
            {/* Profile Section */}
            <div className="faculty-profile">
              <div className="profile-header">
                <div className="profile-avatar">{getInitials(faculty.name)}</div>
                <div className="profile-info">
                  <h2>{faculty.name}</h2>
                  <p>{faculty.email}</p>
                  <div className="roles-badges">
                    {faculty.roles.map(role => (
                      <span key={role} className="role-badge">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Student Search for Subject Change */}
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
          </div>
        )}

        {/* Approvals Section */}
        {activeSection === 'approvals' && (
          <div className="section">

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
            )}
          </div>
        )}

        {/* Students Section */}
        {activeSection === 'students' && (
          <div className="section">
            <h2>Student Management</h2>
            
            {/* Search Section */}
            <div className="search-section">
              <div className="search-header">
                <h3>Search Student by Roll Number</h3>
                <div className="search-controls">
                  <input
                    type="text"
                    placeholder="Enter Roll Number..."
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
              </div>
              
              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="search-results">
                  <h4>Search Results:</h4>
                  {searchResults.map(student => (
                    <div key={student.id} className="search-result-card">
                      <div className="student-info">
                        <h4>{student.name}</h4>
                        <p><strong>Roll No:</strong> {student.rollNo}</p>
                        <p><strong>USN:</strong> {student.USN}</p>
                        <p><strong>Department:</strong> {student.deptId}</p>
                        <p><strong>Division:</strong> {student.divId}</p>
                      </div>
                      <div className="student-actions">
                        <button 
                          className="btn btn-primary"
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowSubjectRemapping(true);
                          }}
                        >
                          Manage Subjects
                        </button>
                      </div>
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


            {/* My Students List */}
            <div className="my-students-section">
              <h3>My Students</h3>
              <div className="students-list">
                {faculty.mentees?.map(menteeId => {
                  const student = studentsData.find(s => s.id === menteeId);
                  return student ? (
                    <div key={student.id} className="student-card">
                      <h4>{student.name}</h4>
                      <p>{student.rollNo} - {student.USN}</p>
                      <p>{student.deptId} - {student.divId}</p>
                      <button 
                        className="btn btn-outline"
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowSubjectRemapping(true);
                        }}
                      >
                        Manage Subjects
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}

        {/* Reports Section */}
        {activeSection === 'reports' && (
          <div className="section">
            <h2>Reports</h2>
            <div className="reports-grid">
              <div className="report-card">
                <h3>Approval Statistics</h3>
                <p>Total Approvals: {approvals.length}</p>
                <p>Pending: {approvals.filter(a => a.subjectApprovals.some(s => s.status === 'pending')).length}</p>
              </div>
            </div>
          </div>
        )}

        {/* Subject Remapping Modal - Global */}
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

export default FacultyDashboard;
