import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import studentsData from '../data/students.json';
import '../styles/student.css';

const StudentProfile = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find student data
    const studentData = studentsData.find(s => s.email === user.email);
    setStudent(studentData);
    setLoading(false);
  }, [user.email]);

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
      <div className="student-content">
        {/* Header */}
        <div className="student-header">
          <h1>Student Profile</h1>
        </div>

        {/* Profile Section */}
        <div className="section">
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
      </div>
    </div>
  );
};

export default StudentProfile;
